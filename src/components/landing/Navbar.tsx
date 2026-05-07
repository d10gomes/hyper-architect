import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <a href="#top" className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span className="text-sm font-semibold tracking-tight">Atelier AI</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#como-funciona" className="transition-colors hover:text-foreground">Como funciona</a>
          <a href="#antes-depois" className="transition-colors hover:text-foreground">Antes e depois</a>
          <a href="#beneficios" className="transition-colors hover:text-foreground">Benefícios</a>
          <a href="#demo" className="transition-colors hover:text-foreground">Demonstração</a>
        </nav>
        <Button asChild size="sm" className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90">
          <a href="#demo">Testar Agora</a>
        </Button>
      </div>
    </header>
  );
}
