import before1 from "@/assets/before-1.jpg";
import after1 from "@/assets/after-1.jpg";
import after2 from "@/assets/after-2.jpg";
import before3 from "@/assets/before-3.jpg";
import after3 from "@/assets/after-3.jpg";

type Pair = {
  label: string;
  before: string | "facade-svg";
  after: string;
};

const pairs: Pair[] = [
  { label: "Sala de estar", before: before1, after: after1 },
  { label: "Fachada residencial", before: "facade-svg", after: after2 },
  { label: "Cozinha gourmet", before: before3, after: after3 },
];

function FacadeElevation({ label }: { label: string }) {
  return (
    <svg
      role="img"
      aria-label={`${label} — elevação frontal técnica`}
      viewBox="0 0 1280 960"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width="1280" height="960" fill="hsl(var(--card, 0 0% 100%))" />
      {/* Grid de fundo técnico */}
      <g stroke="currentColor" strokeWidth="0.5" opacity="0.08" className="text-foreground">
        {Array.from({ length: 25 }).map((_, i) => (
          <line key={`v-${i}`} x1={i * 50 + 40} y1="40" x2={i * 50 + 40} y2="920" />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={`h-${i}`} x1="40" y1={i * 50 + 40} x2="1240" y2={i * 50 + 40} />
        ))}
      </g>

      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="text-foreground"
      >
        {/* Linha do solo */}
        <line x1="120" y1="780" x2="1160" y2="780" />
        <line x1="100" y1="790" x2="1180" y2="790" strokeWidth="1" opacity="0.5" />

        {/* Corpo da casa */}
        <rect x="260" y="380" width="760" height="400" />

        {/* Telhado em duas águas */}
        <polyline points="220,400 640,180 1060,400" />
        <line x1="260" y1="380" x2="260" y2="400" strokeWidth="1.2" opacity="0.6" />
        <line x1="1020" y1="380" x2="1020" y2="400" strokeWidth="1.2" opacity="0.6" />
        <line x1="220" y1="400" x2="260" y2="400" strokeWidth="1.2" opacity="0.6" />
        <line x1="1020" y1="400" x2="1060" y2="400" strokeWidth="1.2" opacity="0.6" />

        {/* Chaminé */}
        <rect x="860" y="240" width="50" height="90" />
        <line x1="855" y1="240" x2="915" y2="240" strokeWidth="3" />

        {/* Porta central */}
        <rect x="600" y="560" width="120" height="220" />
        <line x1="660" y1="560" x2="660" y2="780" strokeWidth="1.2" opacity="0.6" />
        <circle cx="700" cy="675" r="4" fill="currentColor" />

        {/* Degraus da entrada */}
        <line x1="570" y1="790" x2="750" y2="790" />
        <line x1="555" y1="800" x2="765" y2="800" />

        {/* Janela esquerda inferior */}
        <rect x="340" y="500" width="180" height="160" />
        <line x1="430" y1="500" x2="430" y2="660" strokeWidth="1.2" />
        <line x1="340" y1="580" x2="520" y2="580" strokeWidth="1.2" />
        <rect x="328" y="488" width="204" height="12" strokeWidth="1.5" />

        {/* Janela direita inferior */}
        <rect x="800" y="500" width="180" height="160" />
        <line x1="890" y1="500" x2="890" y2="660" strokeWidth="1.2" />
        <line x1="800" y1="580" x2="980" y2="580" strokeWidth="1.2" />
        <rect x="788" y="488" width="204" height="12" strokeWidth="1.5" />

        {/* Janelas superiores (sótão) */}
        <rect x="480" y="280" width="120" height="80" />
        <line x1="540" y1="280" x2="540" y2="360" strokeWidth="1.2" />
        <rect x="680" y="280" width="120" height="80" />
        <line x1="740" y1="280" x2="740" y2="360" strokeWidth="1.2" />

        {/* Cota de dimensão (cima) */}
        <g strokeWidth="1" opacity="0.55">
          <line x1="220" y1="140" x2="1060" y2="140" />
          <line x1="220" y1="130" x2="220" y2="150" />
          <line x1="1060" y1="130" x2="1060" y2="150" />
          <line x1="220" y1="140" x2="220" y2="180" strokeDasharray="3 4" />
          <line x1="1060" y1="140" x2="1060" y2="180" strokeDasharray="3 4" />
        </g>

        {/* Cota de altura (lado direito) */}
        <g strokeWidth="1" opacity="0.55">
          <line x1="1120" y1="180" x2="1120" y2="780" />
          <line x1="1110" y1="180" x2="1130" y2="180" />
          <line x1="1110" y1="780" x2="1130" y2="780" />
        </g>
      </g>

      {/* Etiquetas de cota */}
      <g className="fill-foreground" opacity="0.55" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="18">
        <text x="640" y="130" textAnchor="middle">12,40 m</text>
        <text x="1145" y="490" transform="rotate(90 1145 490)" textAnchor="middle">7,80 m</text>
      </g>
    </svg>
  );
}

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
                <figure className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
                  {pair.before === "facade-svg" ? (
                    <FacadeElevation label={pair.label} />
                  ) : (
                    <img src={pair.before} alt={`${pair.label} — projeto original`} loading="lazy" width={1280} height={960} className="h-full w-full object-cover" />
                  )}
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
