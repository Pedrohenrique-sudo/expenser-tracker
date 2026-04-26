# Brainstorm de Design - Expense Tracker

## Abordagem 1: Minimalismo Moderno com Foco em Dados
**Design Movement:** Modernismo Suíço + Data Visualization

**Princípios Centrais:**
- Clareza absoluta através de tipografia e espaçamento
- Hierarquia visual rigorosa baseada em tamanho e peso
- Dados como protagonista, não como decoração
- Eficiência máxima: cada pixel serve um propósito

**Filosofia de Cores:**
- Paleta neutra: Tons de cinza profundo (charcoal #1a1a1a), branco puro, com acentos em verde esmeralda (#10b981)
- Verde para ações positivas (economia, adição), vermelho suave (#ef4444) para gastos
- Fundo levemente cinzento (#f9fafb) para reduzir fadiga ocular

**Paradigma de Layout:**
- Grid assimétrico: Dashboard principal com cards em proporção 2:1
- Sidebar esquerda fixa com categorias (navegação vertical)
- Gráficos em destaque acima de tabelas detalhadas
- Uso extensivo de whitespace para respiração visual

**Elementos Assinatura:**
- Linhas horizontais sutis como divisores
- Indicadores circulares para percentuais de gastos
- Tipografia em peso 600+ para títulos (Poppins Bold)
- Ícones monocromáticos com traço fino

**Filosofia de Interação:**
- Transições suaves (200ms) em hover
- Feedback tátil: mudança de cor e elevação sutil
- Modais minimalistas com fundo desfocado
- Confirmações visuais imediatas para ações

**Animações:**
- Números contadores animados ao carregar (0 → valor final em 600ms)
- Gráficos que se desenham ao aparecer (stroke animation)
- Fade-in suave para cards em cascata (stagger de 50ms)
- Hover: elevação de 2px com sombra suave

**Sistema Tipográfico:**
- Display: Poppins Bold (700) para títulos principais
- Heading: Poppins SemiBold (600) para seções
- Body: Inter Regular (400) para conteúdo
- Mono: JetBrains Mono para valores monetários

**Probabilidade:** 0.08

---

## Abordagem 2: Design Orgânico e Acessível
**Design Movement:** Neomorphism + Glassmorphism

**Princípios Centrais:**
- Suavidade e arredondamento em todas as formas
- Profundidade através de sombras e desfoque
- Acessibilidade como prioridade (alto contraste, fontes legíveis)
- Sensação tátil e tridimensional

**Filosofia de Cores:**
- Paleta quente: Azul suave (#3b82f6), tons de bege (#fef3c7), rosa morna (#fda4af)
- Fundo em gradiente suave: branco com toque de azul claro
- Acentos em laranja dourado (#f59e0b) para destaque
- Modo escuro com azul profundo (#1e3a8a) e acentos em ouro (#fbbf24)

**Paradigma de Layout:**
- Cards arredondados flutuantes com sombra suave
- Layout em cascata (masonry-like) que se adapta ao conteúdo
- Navegação em abas arredondadas no topo
- Gráficos dentro de "bolhas" com fundo desfocado

**Elementos Assinatura:**
- Bordas arredondadas (border-radius: 24px) em todos os elementos
- Efeito glassmorphism: fundo com backdrop-filter blur
- Ícones coloridos e amigáveis (Lucide com cores)
- Gradientes suaves em backgrounds

**Filosofia de Interação:**
- Cliques produzem "ondas" suaves (ripple effect)
- Botões crescem levemente ao hover
- Transições fluidas e orgânicas (300ms com easing ease-out)
- Feedback háptico simulado com micro-animações

**Animações:**
- Entrada de cards com bounce suave (cubic-bezier)
- Ícones que giram levemente ao hover (5-10 graus)
- Barras de progresso que preenchem com fluidez
- Números que "fluem" para o novo valor

**Sistema Tipográfico:**
- Display: Outfit Bold (700) para títulos (fonte moderna e amigável)
- Heading: Outfit SemiBold (600)
- Body: Outfit Regular (400) para melhor legibilidade
- Mono: IBM Plex Mono para valores

**Probabilidade:** 0.07

---

## Abordagem 3: Brutalism Digital com Toque Playful
**Design Movement:** Brutalism + Memphism

**Princípios Centrais:**
- Honestidade estrutural: mostra a "construção" da interface
- Bordas retas e ângulos definidos (sem arredondamento excessivo)
- Cores ousadas e contrastantes
- Tipografia grande e ousada como elemento visual

**Filosofia de Cores:**
- Paleta ousada: Preto (#000000), amarelo elétrico (#fbbf24), roxo vibrante (#a855f7)
- Fundo em padrão sutil: linhas diagonais ou grid
- Acentos em ciano (#06b6d4) e magenta (#ec4899)
- Alto contraste para máxima legibilidade

**Paradigma de Layout:**
- Grid rigoroso com espaçamento uniforme (16px)
- Blocos de conteúdo com bordas pretas visíveis (2-4px)
- Tipografia como elemento visual dominante
- Layouts assimétricos com blocos de tamanhos variados

**Elementos Assinatura:**
- Bordas pretas espessas em cards e componentes
- Padrões de fundo (stripes, dots, grid)
- Ícones com traço espesso e cores vibrantes
- Tipografia em MAIÚSCULAS para destaque

**Filosofia de Interação:**
- Cliques causam mudança de cor imediata (sem transição)
- Estados visuais muito claros: ativo/inativo/hover
- Feedback direto e óbvio
- Sem efeitos suaves: tudo é franco e direto

**Animações:**
- Transições abruptas (100ms) ou nenhuma
- Escalas discretas em hover (1.05x ou 1.1x)
- Rotações de 90 graus em ícones
- Piscar de cores em destaque

**Sistema Tipográfico:**
- Display: Bebas Neue (700) para títulos (geometria forte)
- Heading: Space Mono Bold (700) para seções
- Body: Space Mono Regular (400) para conteúdo
- Mono: IBM Plex Mono para valores

**Probabilidade:** 0.06

---

## Decisão Final

Escolhida: **Abordagem 1 - Minimalismo Moderno com Foco em Dados**

Esta abordagem foi selecionada porque:
1. Um rastreador de gastos é fundamentalmente uma ferramenta de análise de dados
2. Minimalismo permite que os dados sejam o foco, não a decoração
3. Acessibilidade e clareza são críticas para uma ferramenta financeira
4. A paleta neutra com verde/vermelho é intuitiva para contexto de gastos
5. Escalabilidade: fácil adicionar mais dados sem poluição visual
