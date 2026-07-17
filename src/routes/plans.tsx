import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/plans")({
  component: PlansPage,
  head: () => ({
    meta: [{ title: "Planos — Atelier AI" }, { name: "description", content: "Planos e créditos de render Atelier AI." }],
  }),
});

const PLANS = [
  { id: "free", name: "Free", price: "R$ 0", renders: 3, features: ["3 renders / mês", "Qualidade padrão", "Suporte por email"] },
  { id: "starter", name: "Starter", price: "R$ 49", renders: 30, features: ["30 renders / mês", "Qualidade premium", "Refinamento por chat"], highlight: false },
  { id: "pro", name: "Pro", price: "R$ 149", renders: 150, features: ["150 renders / mês", "Qualidade premium 4K", "Relatório de fidelidade", "Prioridade na fila"], highlight: true },
  { id: "studio", name: "Studio", price: "R$ 349", renders: 500, features: ["500 renders / mês", "Tudo do Pro", "Suporte dedicado", "Acesso beta a novos modelos"] },
];

function PlansPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Planos</p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">Escolha seu plano de renders</h1>
          <p className="mt-4 text-pretty text-muted-foreground">Cada render entregue com sucesso consome 1 crédito. Créditos renovam a cada 30 dias.</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`flex flex-col rounded-2xl border p-6 shadow-[var(--shadow-soft)] ${
                p.highlight ? "border-primary bg-primary/5" : "border-border bg-card"
              }`}
            >
              {p.highlight && (
                <span className="mb-2 self-start rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                  Recomendado
                </span>
              )}
              <h3 className="text-lg font-semibold tracking-tight">{p.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-semibold">{p.price}</span>
                <span className="text-sm text-muted-foreground">/mês</span>
              </div>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`mt-6 rounded-full ${p.highlight ? "bg-primary text-primary-foreground" : ""}`}
                variant={p.highlight ? "default" : "outline"}
              >
                <a href={`mailto:contato@atelier.ai?subject=Upgrade%20plano%20${p.name}`}>
                  {p.id === "free" ? "Começar grátis" : "Assinar"}
                </a>
              </Button>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-xs text-muted-foreground">
          Pagamentos integrados em breve. Por enquanto, entre em contato para ativar seu upgrade manualmente.
        </p>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-primary hover:underline">← Voltar para o app</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
