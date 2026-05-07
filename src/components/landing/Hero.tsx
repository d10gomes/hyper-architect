import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero.jpg";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-10 lg:pb-28 lg:pt-32">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="fade-in-up lg:col-span-6">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              IA para arquitetos · v1.0
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Transforme projetos em renders realistas{" "}
              <span className="text-primary">sem alterar um centímetro.</span>
            </h1>
            <p className="text-pretty mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Envie sua planta, croqui ou modelo 3D. A nossa IA devolve um render fotorrealista
              mantendo fidelidade absoluta ao projeto original — proporções, paredes, aberturas e composição.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="group h-12 rounded-full bg-primary px-7 text-primary-foreground shadow-[var(--shadow-navy)] hover:bg-primary/90">
                <a href="#demo">
                  Testar Agora
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </Button>
              <a href="#antes-depois" className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
                Ver antes e depois
              </a>
            </div>
            <div className="mt-12 flex items-center gap-8 text-xs text-muted-foreground">
              <div>
                <div className="text-2xl font-semibold tracking-tight text-foreground">100%</div>
                <div className="mt-0.5">Fidelidade ao projeto</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="text-2xl font-semibold tracking-tight text-foreground">~60s</div>
                <div className="mt-0.5">Por render</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="text-2xl font-semibold tracking-tight text-foreground">4K</div>
                <div className="mt-0.5">Qualidade cinematográfica</div>
              </div>
            </div>
          </div>

          <div className="fade-in-up lg:col-span-6">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elevated)]">
                <img
                  src={heroImage}
                  alt="Render fotorrealista de uma sala de estar luxuosa minimalista"
                  width={1920}
                  height={1280}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
