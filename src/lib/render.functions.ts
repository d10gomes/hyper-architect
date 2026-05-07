import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  imageDataUrl: z
    .string()
    .min(32)
    .max(20_000_000)
    .regex(/^data:image\/(png|jpeg|jpg|webp);base64,/),
});

const SYSTEM_PROMPT = `Você é um motor de renderização arquitetônica fotorrealista de altíssima fidelidade.

REGRAS ABSOLUTAS:
1. Mantenha EXATAMENTE a mesma planta, proporções, dimensões, ângulo de câmera, paredes, aberturas, mobiliário e composição da imagem de entrada.
2. NÃO invente, mova, remova ou redimensione nenhum elemento estrutural.
3. NÃO adicione objetos novos que não estejam no desenho original.
4. Apenas aplique materiais realistas (madeira, mármore, vidro, concreto), iluminação natural cinematográfica, texturas refinadas, sombras suaves e atmosfera premium estilo arquitetura de luxo.
5. Estética: minimalista, sofisticada, paleta neutra, qualidade de revista de arquitetura.
6. O resultado deve parecer uma fotografia profissional do mesmo espaço desenhado.`;

export const renderProject = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { imageUrl: null as string | null, error: "Serviço de IA não configurado." };
    }

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-pro-image-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: SYSTEM_PROMPT + "\n\nGere agora o render fotorrealista mantendo fidelidade absoluta a esta imagem." },
                { type: "image_url", image_url: { url: data.imageDataUrl } },
              ],
            },
          ],
          modalities: ["image", "text"],
        }),
      });

      if (response.status === 429) {
        return { imageUrl: null, error: "Muitas requisições. Aguarde alguns instantes e tente novamente." };
      }
      if (response.status === 402) {
        return { imageUrl: null, error: "Créditos de IA insuficientes. Adicione créditos no workspace." };
      }
      if (!response.ok) {
        const text = await response.text();
        console.error("AI gateway error", response.status, text);
        return { imageUrl: null, error: "Falha ao gerar o render. Tente novamente." };
      }

      const json = (await response.json()) as {
        choices?: Array<{ message?: { images?: Array<{ image_url?: { url?: string } }> } }>;
      };
      const url = json.choices?.[0]?.message?.images?.[0]?.image_url?.url ?? null;

      if (!url) {
        return { imageUrl: null, error: "Não foi possível processar a imagem enviada." };
      }
      return { imageUrl: url, error: null as string | null };
    } catch (e) {
      console.error("renderProject error", e);
      return { imageUrl: null, error: "Erro inesperado ao gerar o render." };
    }
  });
