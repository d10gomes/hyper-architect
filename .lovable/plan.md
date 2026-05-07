## Visão geral

Landing page minimalista e luxuosa (estilo Apple + Autodesk) para uma startup de IA que transforma projetos arquitetônicos em renders hiper-realistas. Tudo em **Português (BR)**, fundo claro, paleta branco/preto/cinza com detalhes em azul-escuro (`oklch(0.28 0.08 250)` — navy profundo).

A demonstração de upload **não será apenas visual**: o arquivo enviado é processado pela Lovable AI (Nano Banana Pro — `google/gemini-3-pro-image-preview`) com prompt rígido de fidelidade, devolvendo um render fotorrealista da MESMA composição/planta enviada.

## Design system (src/styles.css)

- Fundo: branco puro com leve gradiente `#FAFAFA → #FFFFFF`
- Texto: preto suave (oklch ~0.15)
- Acento: azul-escuro navy (CTAs, linhas finas, hovers)
- Tipografia: stack system Apple-like (`-apple-system, "SF Pro Display", Inter`), pesos 300/500/600, tracking apertado em headlines
- Bordas finas 1px cinza-claro, raio 12–16px, sombras quase imperceptíveis
- Animações sutis (fade/slide-up) ao entrar no viewport

## Estrutura de rotas (single page conforme briefing)

Tudo em `src/routes/index.tsx` (landing única, sem subpáginas — o briefing pede uma landing). Componentes quebrados em `src/components/landing/`:

- `Navbar.tsx` — logo "Atelier AI" + links âncora + CTA "Testar Agora"
- `Hero.tsx` — headline grande, subheadline, CTA, imagem hero gerada por IA (interior renderizado luxuoso)
- `HowItWorks.tsx` — 3 passos: Envie · Processamos · Receba (ícones lucide finos)
- `BeforeAfter.tsx` — grid lado a lado, 3 pares (planta/wireframe → render fotorrealista)
- `Benefits.tsx` — 4 cards: Fidelidade absoluta · Velocidade · Qualidade cinematográfica · Sem retrabalho
- `UploadDemo.tsx` — drag & drop real, chama server function, mostra loading elegante e exibe render gerado
- `FinalCTA.tsx` — chamada final + botão
- `Footer.tsx` — minimalista

## Demonstração de upload (núcleo funcional)

**Server function** `src/lib/render.functions.ts`:
- Recebe imagem base64 (planta, croqui, modelo 3D bruto, foto de maquete)
- Chama Lovable AI Gateway com `google/gemini-3-pro-image-preview` em modo edição de imagem
- Prompt do sistema reforça **fidelidade absoluta**: "Render fotorrealista mantendo EXATAMENTE a mesma planta, proporções, aberturas, paredes, mobiliário e composição da imagem de entrada. Não invente, mova ou remova elementos. Apenas aplique materiais realistas, iluminação natural cinematográfica, texturas, sombras e atmosfera premium."
- Retorna data URL da imagem gerada
- Tratamento de 429/402 com mensagens claras

**Cliente**: drag-and-drop, preview do original, spinner minimalista, exibição lado a lado do resultado, botão "Baixar render".

Limite: 10MB, formatos JPG/PNG/WEBP.

## Imagens (geradas por IA na build)

Via skill `ai-gateway`, gero e salvo em `src/assets/`:
1. `hero.jpg` — interior arquitetônico luxuoso, luz natural, minimalista
2. `before-1.jpg` / `after-1.jpg` — sala de estar (wireframe → render)
3. `before-2.jpg` / `after-2.jpg` — fachada residencial
4. `before-3.jpg` / `after-3.jpg` — cozinha gourmet

## Detalhes técnicos

- TanStack Start, rota única `/`
- Lovable Cloud habilitado (necessário para `LOVABLE_API_KEY` da AI Gateway)
- Server function chamada via `useServerFn` + `useMutation`
- Sem dependências novas além do que já existe (shadcn já instalado)
- Totalmente responsivo (mobile-first, breakpoints `md` e `lg`)

## Entregáveis desta tarefa

1. Habilitar Lovable Cloud
2. Gerar 7 imagens de referência via AI
3. Atualizar `src/styles.css` com paleta + tipografia
4. Criar componentes em `src/components/landing/`
5. Criar `src/lib/render.functions.ts` (server function de render)
6. Substituir `src/routes/index.tsx` pela landing completa
7. Atualizar metadata (title/description/og) no `__root.tsx`
