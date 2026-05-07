import { Ruler, Zap, Film, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: Ruler,
    title: "Fidelidade absoluta",
    description: "Cada parede, abertura e proporção é preservada. Nada é inventado, nada é alterado.",
  },
  {
    icon: Zap,
    title: "Renders em segundos",
    description: "Substitua dias de modelagem por uma imagem pronta em menos de um minuto.",
  },
  {
    icon: Film,
    title: "Qualidade cinematográfica",
    description: "Iluminação natural, materiais realistas e atmosfera de revista de arquitetura.",
  },
  {
    icon: ShieldCheck,
    title: "Sem retrabalho",
    description: "Você envia, nós entregamos. Sem ajustes manuais, sem softwares pesados.",
  },
];

export function Benefits() {
  return (
    <section id="beneficios" className="border-t border-border/60 bg-background/40">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Benefícios</p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Feito para arquitetos que valorizam precisão.
            </h2>
            <p className="text-pretty mt-5 max-w-md text-muted-foreground">
              Tecnologia desenvolvida para escritórios de arquitetura que precisam comunicar
              suas ideias com beleza — sem comprometer o rigor técnico do projeto.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:col-span-7">
            {benefits.map((b) => (
              <div key={b.title} className="bg-card p-8">
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary ring-1 ring-primary/10">
                  <b.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-semibold tracking-tight">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
