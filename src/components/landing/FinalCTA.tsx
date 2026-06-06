import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { joinWaitlist } from "@/lib/waitlist.functions";

export function FinalCTA() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const joinFn = useServerFn(joinWaitlist);

  const mutation = useMutation({
    mutationFn: (value: string) => joinFn({ data: { email: value } }),
    onSuccess: () => {
      setJoined(true);
      setEmail("");
      toast.success("Você está na lista! Entraremos em contato em breve.");
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Email inválido.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    mutation.mutate(trimmed);
  };

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

            <div className="mx-auto mt-10 max-w-md">
              {joined ? (
                <div className="flex items-center justify-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-5 py-3 text-sm text-primary-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  Você está na lista! Entraremos em contato em breve.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    maxLength={255}
                    disabled={mutation.isPending}
                    className="h-12 flex-1 rounded-full border-primary-foreground/20 bg-primary-foreground/5 px-5 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground/40"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    disabled={mutation.isPending}
                    className="h-12 rounded-full bg-background px-6 text-foreground hover:bg-background/90"
                  >
                    {mutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Entrar na lista de espera"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
