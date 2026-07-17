import { useCallback, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "@tanstack/react-router";
import { UploadCloud, Loader2, Download, RefreshCw, Send, Sparkles, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { renderProject } from "@/lib/render.functions";
import { analyzeFidelity } from "@/lib/fidelity.functions";
import { FidelityReport, type FidelityReportData } from "@/components/landing/FidelityReport";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";

type ChatMessage =
  | { role: "user"; text: string }
  | { role: "ai"; text: string; imageUrl?: string };

const MAX_BYTES = 10 * 1024 * 1024;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo"));
    reader.readAsDataURL(file);
  });
}

export function UploadDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [report, setReport] = useState<FidelityReportData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");

  const renderFn = useServerFn(renderProject);
  const fidelityFn = useServerFn(analyzeFidelity);
  const fidelityMutation = useMutation({
    mutationFn: async (vars: { originalUrl: string; renderUrl: string }) =>
      fidelityFn({ data: vars }),
    onSuccess: (res) => {
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      if (res?.report) setReport(res.report);
    },
    onError: () => toast.error("Não foi possível gerar o relatório de fidelidade."),
  });
  const mutation = useMutation({
    mutationFn: async (vars: { dataUrl: string; notes?: string; previousRenderUrl?: string }) =>
      renderFn({ data: { imageDataUrl: vars.dataUrl, notes: vars.notes, previousRenderUrl: vars.previousRenderUrl } }),
    onSuccess: (res) => {
      if (res?.error) {
        toast.error(res.error);
        setChat((c) => [...c, { role: "ai", text: res.error! }]);
        return;
      }
      if (res?.imageUrl) {
        setResultUrl(res.imageUrl);
        setChat((c) => [...c, { role: "ai", text: "Render atualizado com base nos detalhes informados.", imageUrl: res.imageUrl! }]);
        toast.success("Render gerado com fidelidade ao seu projeto.");
        if (originalUrl) {
          fidelityMutation.mutate({ originalUrl, renderUrl: res.imageUrl });
        }
      }
    },
    onError: () => toast.error("Não foi possível gerar o render. Tente novamente."),
  });

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Envie uma imagem (JPG, PNG ou WEBP).");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("O arquivo excede 10MB.");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setOriginalUrl(dataUrl);
    setResultUrl(null);
    setReport(null);
    setChat([{ role: "ai", text: "Projeto recebido. Gerando o primeiro render fotorrealista com fidelidade absoluta…" }]);
    mutation.mutate({ dataUrl });
  }, [mutation]);

  const sendChat = () => {
    const text = chatInput.trim();
    if (!text || !originalUrl || mutation.isPending) return;
    setChat((c) => [...c, { role: "user", text }]);
    setChatInput("");
    mutation.mutate({ dataUrl: originalUrl, notes: text, previousRenderUrl: resultUrl ?? undefined });
  };

  const reset = () => {
    setOriginalUrl(null);
    setResultUrl(null);
    setReport(null);
    setChat([]);
    setChatInput("");
    mutation.reset();
    fidelityMutation.reset();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <section id="demo" className="border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Demonstração</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Envie um projeto e veja a IA renderizar.
          </h2>
          <p className="text-pretty mt-4 text-muted-foreground">
            Faça upload de uma planta, croqui ou modelo. O resultado mantém a mesma composição —
            apenas com materiais, luz e textura fotorrealistas.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-5xl">
          {!originalUrl && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFile(file);
              }}
              onClick={() => inputRef.current?.click()}
              className={`group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-card px-8 py-20 text-center transition-all ${
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-accent/40"
              }`}
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary ring-1 ring-primary/10">
                <UploadCloud className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">Arraste sua imagem ou clique para enviar</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                JPG, PNG ou WEBP · até 10MB · planta, croqui, modelo 3D ou foto da maquete
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>
          )}

          {originalUrl && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <figure className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
                  <img src={originalUrl} alt="Projeto enviado" className="aspect-[4/3] w-full object-cover" />
                  <figcaption className="absolute left-4 top-4 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                    Seu projeto
                  </figcaption>
                </figure>

                <figure className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
                  {mutation.isPending && (
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <p className="text-sm">Renderizando com fidelidade absoluta…</p>
                      <p className="text-xs">Pode levar até 60 segundos</p>
                    </div>
                  )}
                  {!mutation.isPending && resultUrl && (
                    <>
                      <img src={resultUrl} alt="Render gerado pela IA" className="h-full w-full object-cover" />
                      <figcaption className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        Render IA
                      </figcaption>
                    </>
                  )}
                  {!mutation.isPending && !resultUrl && (
                    <div className="text-center text-sm text-muted-foreground">
                      <p>Não foi possível gerar o render.</p>
                      <p className="mt-1 text-xs">Tente uma imagem diferente.</p>
                    </div>
                  )}
                </figure>
              </div>

              {(fidelityMutation.isPending || report) && (
                <FidelityReport data={report} loading={fidelityMutation.isPending && !report} />
              )}

              <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
                <div className="border-b border-border px-6 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Refinamento por chat</p>
                  <h3 className="mt-1 text-base font-semibold tracking-tight">Descreva detalhes para fidelizar 100%</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ex.: "o piso é deck de madeira ipê amadeirada", "parede de mármore travertino", "iluminação noturna quente".
                  </p>
                </div>

                <div className="max-h-80 space-y-3 overflow-y-auto px-6 py-5">
                  {chat.length === 0 && (
                    <p className="text-sm text-muted-foreground">Sem mensagens ainda.</p>
                  )}
                  {chat.map((m, i) => (
                    <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                      {m.role === "ai" && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Sparkles className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                        {m.role === "ai" && m.imageUrl && (
                          <img src={m.imageUrl} alt="Render" className="mt-2 w-full rounded-lg" />
                        )}
                      </div>
                      {m.role === "user" && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-foreground">
                          <User className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                  ))}
                  {mutation.isPending && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                      Aplicando ajustes ao render…
                    </div>
                  )}
                </div>

                <div className="border-t border-border p-4">
                  <div className="flex items-end gap-2">
                    <Textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendChat();
                        }
                      }}
                      placeholder="Descreva materiais, texturas, cores, iluminação ou qualquer detalhe do projeto…"
                      rows={2}
                      className="min-h-[52px] resize-none"
                      disabled={mutation.isPending}
                    />
                    <Button
                      onClick={sendChat}
                      disabled={!chatInput.trim() || mutation.isPending}
                      className="h-[52px] rounded-xl bg-primary px-4 text-primary-foreground hover:bg-primary/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button variant="outline" onClick={reset} className="rounded-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Enviar outro projeto
                </Button>
                {resultUrl && (
                  <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <a href={resultUrl} download="render-atelier-ai.png">
                      <Download className="mr-2 h-4 w-4" />
                      Baixar render
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
