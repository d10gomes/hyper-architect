import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-20 text-center shadow-[var(--shadow-navy)] lg:px-16 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(1_0_0/0.08),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-balance mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-primary-foreground md:text-5xl">
              Seus projetos merecem uma apresentação à altura.
            </h2>
            <p className="text-pretty mx-auto mt-5 max-w-xl text-base text-primary-foreground/70">
              Comece agora — gratuito por tempo limitado para arquitetos.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="group h-12 rounded-full bg-background px-8 text-foreground hover:bg-background/90">
                <a href="#demo">
                  Testar Agora
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
