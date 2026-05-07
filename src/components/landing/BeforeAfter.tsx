import before1 from "@/assets/before-1.jpg";
import after1 from "@/assets/after-1.jpg";
import before2 from "@/assets/before-2.jpg";
import after2 from "@/assets/after-2.jpg";
import before3 from "@/assets/before-3.jpg";
import after3 from "@/assets/after-3.jpg";

const pairs = [
  { label: "Sala de estar", before: before1, after: after1 },
  { label: "Fachada residencial", before: before2, after: after2 },
  { label: "Cozinha gourmet", before: before3, after: after3 },
];

export function BeforeAfter() {
  return (
    <section id="antes-depois" className="border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Antes e depois</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Mesma planta. Outro nível de apresentação.
          </h2>
          <p className="text-pretty mt-4 text-muted-foreground">
            Cada render preserva fielmente as linhas, proporções e composição do projeto original.
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {pairs.map((pair) => (
            <div key={pair.label}>
              <div className="mb-5 flex items-end justify-between">
                <h3 className="text-lg font-medium tracking-tight">{pair.label}</h3>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Projeto → Render</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <figure className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
                  <img src={pair.before} alt={`${pair.label} — projeto original`} loading="lazy" width={1280} height={960} className="h-full w-full object-cover" />
                  <figcaption className="absolute left-4 top-4 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                    Projeto
                  </figcaption>
                </figure>
                <figure className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
                  <img src={pair.after} alt={`${pair.label} — render fotorrealista`} loading="lazy" width={1280} height={960} className="h-full w-full object-cover" />
                  <figcaption className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Render
                  </figcaption>
                </figure>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
