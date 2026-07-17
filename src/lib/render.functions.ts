import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const InputSchema = z.object({
  imageDataUrl: z
    .string()
    .min(32)
    .max(20_000_000)
    .regex(/^data:image\/(png|jpeg|jpg|webp);base64,/),
  notes: z.string().max(4000).optional(),
  previousRenderUrl: z.string().max(20_000_000).optional(),
});

const SYSTEM_PROMPT = `Você é um diretor técnico de renderização arquitetônica de NÍVEL PREMIUM (V-Ray / Corona / Lumion / Unreal Engine 5 + Lumen) com FIDELIDADE ABSOLUTA AO PROJETO ORIGINAL.

QUALIDADE OBRIGATÓRIA — não negocie nenhum destes itens:
- Resolução percebida 4K+, foco nítido em todo o frame, profundidade de campo cinematográfica sutil
- Iluminação fisicamente correta (PBR): global illumination, ray-traced reflections, soft shadows, ambient occlusion natural nos cantos
- Mistura realista de luz natural (céu HDRI) + luz artificial (temperatura de cor coerente, 2700K-3500K em interiores quentes, 5500K em externos diurnos)
- Materiais com microdetalhes: veios reais de madeira (ipê, carvalho, freijó conforme indicado), poros de mármore com translucidez subsuperficial (SSS), trama de tecidos, imperfeições sutis de pintura, reflexos anisotrópicos em metais escovados, fresnel correto em vidros
- Texturas com bump/normal/roughness coerentes — NUNCA superfícies "plásticas", chapadas ou CGI dos anos 2000
- Vegetação fotorrealista (folhas individuais, variação de cor, transluscência), água com caustics e reflexão fresnel se houver piscina/espelho d'água
- Pós-produção fotográfica: leve color grading cinematográfico, vinheta sutil, white balance correto, sem HDR exagerado, sem saturação artificial
- Resultado deve ser INDISTINGUÍVEL de uma fotografia profissional de arquitetura tirada com câmera full-frame + lente tilt-shift

Sua função NÃO é recriar o ambiente. Sua função é APENAS melhorar a qualidade visual do projeto enviado, transformando o desenho em uma fotografia hiper-realista do MESMO ambiente, sem alterar absolutamente nada.

IMPORTANTE — TIPO DE PROJETO: o projeto enviado pode ser INTERNO ou EXTERNO. Renderize QUALQUER tipo — interno ou externo — com a mesma fidelidade absoluta. NUNCA recuse, ignore ou converta um projeto externo em interno (ou vice-versa). Preserve exatamente o que foi enviado.

ANALISE COM EXTREMA ATENÇÃO antes de renderizar: paredes, revestimentos, móveis, texturas, medidas, iluminação, aberturas, composição, objetos, materiais e a posição exata de cada elemento.

REGRA PRINCIPAL: o render final deve ficar 100% IDÊNTICO ao projeto original enviado pelo arquiteto.

ESTRITAMENTE PROIBIDO alterar móveis, revestimentos, texturas, paredes, medidas, proporções, geometria, estrutura, objetos, plantas, luminárias, iluminação, cores, materiais, paginação, ângulo de câmera, enquadramento, composição, paisagismo, piscina, fachada, portas ou janelas.

PRESERVE EXATAMENTE: formato e posição dos móveis, revestimento, cores e texturas originais, geometria, profundidade, layout, estrutura arquitetônica, detalhes construtivos, paisagismo, paginação dos materiais, piscina, fachada e iluminação do ambiente.

A IA deve agir APENAS em: realismo, nitidez, iluminação fisicamente correta, sombras naturais, reflexos ray-traced, refinamento de textura, definição, qualidade cinematográfica, micro detalhes e acabamento visual fotográfico.

QUALIDADE DESEJADA: ultra realistic, photorealistic architecture render, cinematic lighting, realistic materials, high detail, physically accurate textures, global illumination, ray traced reflections, ultra sharp, architectural visualization, premium render quality.`;

function parseDataUrl(dataUrl: string): { mimeType: string; data: string } | null {
  const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!m) return null;
  return { mimeType: m[1], data: m[2] };
}

type RenderResult = {
  imageUrl: string | null;
  error: string | null;
  quota?: { plan: string; remaining: number; limit: number; periodEnd: string };
  quotaExceeded?: boolean;
};

export const renderProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data, context }): Promise<RenderResult> => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return { imageUrl: null, error: "GOOGLE_API_KEY não configurada." };
    }

    const original = parseDataUrl(data.imageDataUrl);
    if (!original) {
      return { imageUrl: null, error: "Formato de imagem inválido." };
    }
    const previous = data.previousRenderUrl ? parseDataUrl(data.previousRenderUrl) : null;

    // Consume 1 credit atomically BEFORE calling the AI provider (avoids races).
    // Refund on provider failure below.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: consumed, error: consumeErr } = await supabaseAdmin.rpc("consume_render_credit", {
      _user_id: context.userId,
    });
    if (consumeErr) {
      console.error("consume_render_credit error", consumeErr);
      return { imageUrl: null, error: "Não foi possível validar seus créditos. Tente novamente." };
    }
    const row = Array.isArray(consumed) ? consumed[0] : consumed;
    if (!row?.allowed) {
      return {
        imageUrl: null,
        error: "Você atingiu o limite de renders do seu plano. Faça upgrade para continuar.",
        quotaExceeded: true,
        quota: {
          plan: String(row?.plan ?? "free"),
          remaining: 0,
          limit: 0,
          periodEnd: String(row?.period_end ?? ""),
        },
      };
    }

    const promptText =
      SYSTEM_PROMPT +
      (data.notes
        ? `\n\nDETALHES ADICIONAIS DO ARQUITETO (use para refinar materiais, texturas, cores e acabamentos SEM alterar geometria, layout ou composição):\n${data.notes}`
        : "") +
      (previous
        ? "\n\nA segunda imagem é o ÚLTIMO render gerado. Use-o como base e aplique APENAS os ajustes pedidos nos detalhes adicionais, mantendo todo o resto idêntico ao projeto original (primeira imagem)."
        : "") +
      "\n\nGERE AGORA o render fotorrealista em qualidade premium 4K, mantendo fidelidade absoluta ao projeto original.";

    const parts: Array<Record<string, unknown>> = [
      { text: promptText },
      { inline_data: { mime_type: original.mimeType, data: original.data } },
    ];
    if (previous) {
      parts.push({ inline_data: { mime_type: previous.mimeType, data: previous.data } });
    }

    const refund = async () => {
      await supabaseAdmin
        .from("profiles")
        .update({ renders_used: Math.max(0, (row!.remaining ?? 0) - 0) })
        .eq("user_id", context.userId);
      // Simpler: decrement by 1 using a small SQL via rpc would be ideal; do inline update via select-then-update:
    };
    // Better refund: fetch then decrement by 1.
    const doRefund = async () => {
      const { data: p } = await supabaseAdmin
        .from("profiles")
        .select("renders_used")
        .eq("user_id", context.userId)
        .maybeSingle();
      const current = p?.renders_used ?? 1;
      await supabaseAdmin
        .from("profiles")
        .update({ renders_used: Math.max(0, current - 1) })
        .eq("user_id", context.userId);
    };
    void refund; // silence unused

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts }],
            generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
          }),
        },
      );

      if (response.status === 429) {
        await doRefund();
        return { imageUrl: null, error: "Muitas requisições. Aguarde alguns instantes e tente novamente." };
      }
      if (!response.ok) {
        const text = await response.text();
        console.error("Gemini API error", response.status, text);
        await doRefund();
        return { imageUrl: null, error: "Falha ao gerar o render. Tente novamente." };
      }

      const json = (await response.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ inline_data?: { mime_type?: string; data?: string }; inlineData?: { mimeType?: string; data?: string } }> };
        }>;
      };

      const candidateParts = json.candidates?.[0]?.content?.parts ?? [];
      let mimeType: string | undefined;
      let b64: string | undefined;
      for (const p of candidateParts) {
        const inline = (p.inline_data ?? p.inlineData) as { mime_type?: string; mimeType?: string; data?: string } | undefined;
        const mt = inline?.mime_type ?? inline?.mimeType;
        const d = inline?.data;
        if (mt && d) {
          mimeType = mt;
          b64 = d;
          break;
        }
      }

      if (!b64 || !mimeType) {
        await doRefund();
        return { imageUrl: null, error: "Não foi possível processar a imagem enviada." };
      }
      return {
        imageUrl: `data:${mimeType};base64,${b64}`,
        error: null,
        quota: {
          plan: String(row.plan),
          remaining: row.remaining,
          limit: row.remaining, // placeholder; client refetches quota
          periodEnd: String(row.period_end),
        },
      };
    } catch (e) {
      console.error("renderProject error", e);
      await doRefund();
      return { imageUrl: null, error: "Erro inesperado ao gerar o render." };
    }
  });
