import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  originalUrl: z.string().min(32).max(20_000_000),
  renderUrl: z.string().min(32).max(20_000_000),
});

const SYSTEM = `Você é um auditor técnico de renderização arquitetônica. Sua única tarefa é comparar a IMAGEM ORIGINAL (projeto/desenho do arquiteto) com o RENDER GERADO e medir o quão fiel o render é ao original em 5 critérios:

1. objetos — móveis, luminárias, plantas, decoração (mesma quantidade, formato e posição)
2. paredes — geometria, espessura, posicionamento e divisões
3. aberturas — portas, janelas, vãos (quantidade, tamanho e posição)
4. revestimentos — pisos, paredes, tetos, materiais e paginação
5. composicao — ângulo de câmera, enquadramento, proporções e profundidade

Retorne APENAS um JSON válido (sem markdown, sem comentários) no formato exato:
{
  "scores": { "objetos": number, "paredes": number, "aberturas": number, "revestimentos": number, "composicao": number },
  "overall": number,
  "notes": { "objetos": string, "paredes": string, "aberturas": string, "revestimentos": string, "composicao": string },
  "summary": string
}

Cada score é um inteiro de 0 a 100 (100 = idêntico). "overall" é a média ponderada arredondada. Cada "notes[k]" é uma frase curta em português (máx 90 caracteres) explicando o que mudou ou foi mantido. "summary" é uma frase curta de veredito geral.`;

type FidelityResult = {
  scores: { objetos: number; paredes: number; aberturas: number; revestimentos: number; composicao: number };
  overall: number;
  notes: { objetos: string; paredes: string; aberturas: string; revestimentos: string; composicao: string };
  summary: string;
};

export const analyzeFidelity = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { report: null as FidelityResult | null, error: "Serviço de IA não configurado." };
    }
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro",
          messages: [
            { role: "system", content: SYSTEM },
            {
              role: "user",
              content: [
                { type: "text", text: "Imagem 1 = ORIGINAL. Imagem 2 = RENDER. Compare e devolva o JSON." },
                { type: "image_url", image_url: { url: data.originalUrl } },
                { type: "image_url", image_url: { url: data.renderUrl } },
              ],
            },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (res.status === 429) return { report: null, error: "Muitas requisições. Aguarde e tente novamente." };
      if (res.status === 402) return { report: null, error: "Créditos de IA insuficientes." };
      if (!res.ok) {
        console.error("fidelity gateway error", res.status, await res.text());
        return { report: null, error: "Falha ao analisar fidelidade." };
      }
      const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const content = json.choices?.[0]?.message?.content ?? "";
      const cleaned = content.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      const parsed = JSON.parse(cleaned) as FidelityResult;
      return { report: parsed, error: null as string | null };
    } catch (e) {
      console.error("analyzeFidelity error", e);
      return { report: null, error: "Erro inesperado ao analisar fidelidade." };
    }
  });
