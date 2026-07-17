import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";
import { getMyQuota } from "@/lib/quota.functions";
import { LogOut, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function Navbar() {
  const { user } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const quotaFn = useServerFn(getMyQuota);

  const { data: quota } = useQuery({
    queryKey: ["quota", user?.id ?? "anon"],
    queryFn: () => quotaFn(),
    enabled: !!user,
    staleTime: 15_000,
  });

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Você saiu.");
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span className="text-sm font-semibold tracking-tight">Atelier AI</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="/#como-funciona" className="transition-colors hover:text-foreground">Como funciona</a>
          <a href="/#antes-depois" className="transition-colors hover:text-foreground">Antes e depois</a>
          <Link to="/plans" className="transition-colors hover:text-foreground">Planos</Link>
          <a href="/#demo" className="transition-colors hover:text-foreground">Demonstração</a>
        </nav>
        <div className="flex items-center gap-2">
          {user && quota && (
            <Link
              to="/plans"
              className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium sm:inline-flex"
              title={`Plano ${quota.plan}`}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{quota.remaining}</span>
              <span className="text-muted-foreground">/ {quota.limit} renders</span>
            </Link>
          )}
          {user ? (
            <Button size="sm" variant="ghost" onClick={signOut} className="rounded-full">
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Button asChild size="sm" className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90">
              <Link to="/auth">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
