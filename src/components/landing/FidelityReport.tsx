import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export type FidelityReportData = {
  scores: { objetos: number; paredes: number; aberturas: number; revestimentos: number; composicao: number };
  overall: number;
  notes: { objetos: string; paredes: string; aberturas: string; revestimentos: string; composicao: string };
  summary: string;
};

const LABELS: Record<keyof FidelityReportData["scores"], string> = {
  objetos: "Objetos",
  paredes: "Paredes",
  aberturas: "Aberturas",
  revestimentos: "Revestimentos",
  composicao: "Composição",
};

function tone(score: number) {
  if (score >= 95) return { bar: "bg-primary", text: "text-primary", ring: "ring-primary/20" };
  if (score >= 85) return { bar: "bg-foreground", text: "text-foreground", ring: "ring-foreground/15" };
  return { bar: "bg-amber-500", text: "text-amber-600", ring: "ring-amber-500/20" };
}

export function FidelityReport({ data, loading }: { data: FidelityReportData | null; loading: boolean }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm">Auditando fidelidade do render…</p>
        </div>
      </div>
    );
  }
  if (!data) return null;

  const overall = tone(data.overall);
  const passing = data.overall >= 90;

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Relatório de fidelidade</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">Comparação original vs. render</h3>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{data.summary}</p>
        </div>
        <div className={`flex items-center gap-4 rounded-2xl border border-border bg-background px-6 py-4 ring-1 ${overall.ring}`}>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Fidelidade geral</p>
            <p className={`text-4xl font-semibold tabular-nums ${overall.text}`}>{data.overall}<span className="text-xl text-muted-foreground">/100</span></p>
          </div>
          {passing ? (
            <CheckCircle2 className="h-8 w-8 text-primary" strokeWidth={1.5} />
          ) : (
            <AlertTriangle className="h-8 w-8 text-amber-500" strokeWidth={1.5} />
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {(Object.keys(LABELS) as Array<keyof typeof LABELS>).map((key) => {
          const score = data.scores[key];
          const t = tone(score);
          return (
            <div key={key} className="rounded-xl border border-border/70 bg-background p-4">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-medium">{LABELS[key]}</p>
                <p className={`text-sm font-semibold tabular-nums ${t.text}`}>{score}<span className="text-xs text-muted-foreground">/100</span></p>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full ${t.bar} transition-all duration-700`} style={{ width: `${score}%` }} />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{data.notes[key]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
