import { Upload, Sparkles, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Envie seu projeto",
    description: "Planta, croqui, modelo 3D ou foto da maquete. Aceitamos JPG, PNG e WEBP.",
  },
  {
    icon: Sparkles,
    title: "A IA processa",
    description: "Nosso modelo aplica materiais, iluminação e textura mantendo cada linha do desenho.",
  },
  {
    icon: Download,
    title: "Receba o render",
    description: "Imagem fotorrealista pronta em segundos — fiel ao projeto, em qualidade premium.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="border-t border-border/60 bg-background/40">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Como funciona</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Do desenho ao render em três passos
          </h2>
          <p className="text-pretty mt-4 text-muted-foreground">
            Um fluxo direto, sem retrabalho. Sem softwares pesados. Sem alterações no seu projeto.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group relative rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 text-primary ring-1 ring-primary/10">
                <step.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="mb-2 text-xs font-medium tracking-widest text-muted-foreground">
                0{i + 1}
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
