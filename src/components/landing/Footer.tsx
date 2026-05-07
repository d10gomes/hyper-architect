export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-xs text-muted-foreground md:flex-row lg:px-10">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="font-medium text-foreground">Atelier AI</span>
          <span>· renders fiéis a cada centímetro</span>
        </div>
        <div>© {new Date().getFullYear()} Atelier AI. Todos os direitos reservados.</div>
      </div>
    </footer>
  );
}
