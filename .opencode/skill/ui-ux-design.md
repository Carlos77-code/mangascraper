---
name: ui-ux-design
description: >
  Design e implementação de interfaces de usuário profissionais. Cobre design systems,
  acessibilidade, responsividade, animações, tipografia, cores, padrões de UX,
  validação pré-entrega e guidelines por stack (React, Vue, HTML/Tailwind, Flutter, etc.).
---

# Skill: UI/UX Design

Use esta skill para **qualquer tarefa visual/interativa**: novas páginas, componentes, design systems, revisão de UI, correção de UX, acessibilidade, responsividade, animações, tipografia, cores, charts, ou implementação stack-specific.

**Não use** para lógica pura de backend, API/database design, infra/DevOps, ou scripts não-visuais — a menos que a tarefa mude como algo *parece, sente, move ou é interagido*.

---

## 1. Análise de Requisitos (Obrigatório)

Extraia do pedido do usuário:

| Item | O que buscar |
|---|---|
| **Product type** | SaaS, e-commerce, portfolio, dashboard, entertainment, tool, productivity, hybrid |
| **Público/contexto** | Faixa etária, uso (commute, lazer, trabalho), device principal |
| **Palavras-chave de estilo** | playful, vibrant, minimal, dark-mode, content-first, immersive, premium, brutalist |
| **Stack** | Detecte no projeto: `package.json` (react/next/vue/svelte/nuxt/angular), `pubspec.yaml` (Flutter), `*.xcodeproj`/`Package.swift` (SwiftUI), `composer.json` (Laravel), `app.json` + `react-native` (RN). **Nunca assuma** — se não detectável e importa, pergunte. |

---

## 2. Gerar Design System (Obrigatório p/ novas páginas/projetos)

```bash
python "${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py" \
  "<product_type> <industry> <keywords>" \
  --design-system -p "Project Name" [--persist --output-dir "<project-root>"]
```

**Exemplo MangaScraper:**
```bash
python .../search.py "manga reader downloader entertainment tool dark mode" \
  --design-system -p "MangaScraper" --persist --output-dir .
```

**Saída agrega:** pattern (landing), style (visual), colors (palette), typography (pairing), effects (animations), anti-patterns, pre-delivery checklist.

### 2b. Persistir (Master + Overrides)

`--persist` cria:
```
design-system/<slug>/
├── MASTER.md              # Source of Truth global (colors, typo, spacing, components)
└── pages/
    └── <page-name>.md     # Overrides só do que muda nesta página
```

**Regra:** Se `MASTER.md` existe, `--persist` **não sobrescreve** a menos que `--force` + autorização explícita. Leia antes de regenerar.

### 2c. Design Dials (opcional, 1–10)

| Dial | Baixo (1–3) | Médio (4–7) | Alto (8–10) |
|---|---|---|---|
| `--variance` | Centrado/minimal (Minimalism) | Balanced/modern | Bold/asymmetric (Brutalism, Bento) |
| `--motion` | Micro-interações sutis | Scroll/stagger padrão | Coreografia complexa (pin, Flip, SplitText) |
| `--density` | Espaçoso (24–96px) | Padrão (16–64px) | Denso/dashboard (8–32px) |

`--motion` anexa snippet GSAP pronto (framework notes, Do/Don't, perf). `--density` sobrescreve tabela `--space-*` no output.

---

## 3. Buscas Detalhadas (Conforme Necessidade)

```bash
python .../search.py "<keyword>" --domain <domain> [-n <max>]
```

| Necessidade | Domain | Exemplo |
|---|---|---|
| Product patterns | `product` | `"entertainment social" --domain product` |
| Estilos visuais | `style` | `"glassmorphism dark" --domain style` |
| Paletas de cor | `color` | `"entertainment vibrant" --domain color` |
| Font pairings | `typography` | `"playful modern" --domain typography` |
| Google Fonts individuais | `google-fonts` | `"sans serif popular variable" --domain google-fonts` |
| Chart types | `chart` | `"real-time dashboard" --domain chart` |
| UX best practices | `ux` | `"error summary validation" --domain ux` |
| Landing structure | `landing` | `"hero social-proof" --domain landing` |
| Ícones/acessibilidade | `icons` | `"decorative icon aria hidden" --domain icons` |
| GSAP presets | `gsap` | `"scroll reveal stagger" --domain gsap` |
| Stack guidelines | `--stack <stack>` | `"form validation" --stack react` |

**Domínio é auto-detectado se omitido**, mas pode misroutear termos sobrepostos (ex: "font" → typography + google-fonts). Se resultado off-topic, passe `--domain` explícito.

**Se busca retorna 0 resultados:** não fabrique. Retente 1x com query mais estreita ou domain/stack explícito. Se ainda vazio, use defaults da tabela de prioridade abaixo e diga explicitamente: *"no match for X, using general defaults"*.

---

## 4. Stack Guidelines

```bash
python .../search.py "<keyword>" --stack <stack>
```

Stacks suportados: `react`, `nextjs`, `vue`, `svelte`, `astro`, `nuxtjs`, `nuxt-ui`, `angular`, `laravel`, `swiftui`, `react-native`, `flutter`, `jetpack-compose`, `html-tailwind`, `shadcn`, `threejs`, `javafx`, `wpf`, `winui`, `avalonia`, `uno`, `uwp`.

Use stack detectado no **Passo 1**.

---

## 5. Tabela de Prioridade (Regras Built-in)

Use quando busca falha ou como fallback. Ordem = prioridade.

| Pri | Categoria | Domain | Must Have | Anti-Patterns |
|---|---|---|---|---|
| 1 | **Accessibility** | `ux` | Contrast 4.5:1, Alt text, Keyboard nav, Aria-labels | Remover focus rings, Icon-only buttons sem label |
| 2 | **Touch & Interaction** | `ux` | Min 44×44px, 8px+ spacing, Loading feedback | Hover-only, Instant state (0ms) |
| 3 | **Performance** | `ux` | WebP/AVIF, Lazy load, Reserve space (CLS < 0.1) | Layout thrashing, CLS alto |
| 4 | **Style Selection** | `style, product` | Match product type, Consistency, SVG icons (no emoji) | Mix flat/skeuomorphic aleatório, Emoji como ícone |
| 5 | **Layout & Responsive** | `ux` | Mobile-first breakpoints, Viewport meta, No horizontal scroll | Horizontal scroll, Fixed px containers, Disable zoom |
| 6 | **Typography & Color** | `typography, color` | Base 16px, Line-height 1.5, Semantic color tokens | Text < 12px body, Gray-on-gray, Raw hex em componentes |
| 7 | **Animation** | `ux, gsap` | Context-aware timing, Motion conveys meaning, Spatial continuity | Uma duração p/ tudo, Animar width/height, Sem reduced-motion |
| 8 | **Forms & Feedback** | `ux` | Visible labels, Error near field, Helper text, Progressive disclosure | Placeholder-only label, Errors só no topo, Overwhelm upfront |
| 9 | **Navigation** | `ux` | Predictable back, Bottom nav ≤5, Deep linking | Overloaded nav, Broken back, No deep links |
| 10 | **Charts & Data** | `chart` | Legends, Tooltips, Accessible colors | Cor sozinha p/ significado |

**Referência completa:** `references/quick-reference.md` (119 guidelines) e `references/pro-rules.md` (checklist pré-entrega nativo/mobile).

---

## 6. Workflow Padrão

### Novo Projeto/Página
```
1. Analisar requisitos (Passo 1)
2. Gerar --design-system (Passo 2) → persistir se novo projeto
3. Buscas suplementares (Passo 3) p/ gaps específicos
4. Stack guidelines (Passo 4) p/ implementação
5. Implementar sintetizando tudo
6. Pré-entrega: ler references/pro-rules.md + checklist
```

### Bug/Componente Específico
```
1. Identificar outcome observável (ex: "focus not obscured")
2. Buscar outcome semântico: --domain ux
3. Se componente-specific: --domain icons / --stack <stack>
4. Aplicar fix + validar contra prioridade 1–3
```

### Revisão de UI Existente
```
1. Ler arquivos alvo (HTML/CSS/JS/TSX)
2. Verificar contra prioridade 1–10 acima
3. Reportar no formato estruturado (ver seção 8)
```

---

## 7. Formatos de Output

`--design-system` suporta:
- `-f ascii` (default, terminal)
- `-f markdown` (documentação)
- `--json` (machine-readable, completo, sem truncamento)

Buscas de domínio: `--json` p/ dados completos (campos longos truncam em 300 chars no human-readable).

---

## 8. Formato de Relatório (Revisão/Auditoria)

```markdown
## UI/UX Review: `caminho/arquivo.html` (ou .css, .tsx)

### Resumo
[1-2 frases: qualidade geral, aderência ao design system, blockers]

### Pontos Fortes
- ...

### Problemas Encontrados

| Severidade | Arquivo:Linha | Categoria | Descrição | Sugestão |
|---|---|---|---|---|
| Alto | index.html:45 | Accessibility | Contraste 3.2:1 no botão primário | Ajustar cor p/ 4.5:1 mínimo |
| Médio | app.css:120 | Animation | Transição 0.5s em width/height | Usar transform + opacity |

### Recomendações Prioritárias
1. [Ação 1 - maior impacto]
2. [Ação 2]
3. [Ação 3]

### Checklist Pré-Entrega (pro-rules.md)
- [ ] Sem emojis como ícones (SVG: Heroicons/Lucide)
- [ ] `cursor:pointer` em todos clicáveis
- [ ] Timing segue plataforma/componente/preferência
- [ ] Light mode: contraste texto 4.5:1 mínimo
- [ ] Focus states visíveis p/ keyboard nav
- [ ] `prefers-reduced-motion` respeitado
- [ ] Text/chips/badges reflow sem clipping
- [ ] Responsivo: 375px, 768px, 1024px, 1440px
```

**Severidades:**
- `Alto`: bug visual, falha acessibilidade, quebra funcionalidade
- `Médio`: violação convenção, UX confusa, tipografia/cor fora do system
- `Baixo`: sugestão cosmética, polimento opcional

---

## 9. Validação Pós-Implementação

Quando código for gerado/modificado:

### 1. Lint/Typecheck (se projeto tiver)
```bash
npm run lint 2>&1
npm run typecheck 2>&1  # ou tsc --noEmit
```

### 2. Testes Visuais/Regression (se configurado)
```bash
npm run test:visual 2>&1
# ou playwright, chromatic, percy, etc.
```

### 3. Build
```bash
npm run build 2>&1
```

### 4. Checklist Manual (obrigatório)
- [ ] Lint/Typecheck zero erros
- [ ] Build sucesso
- [ ] Checklist `pro-rules.md` passou
- [ ] Nenhuma alteração fora do escopo
- [ ] Design tokens usados (sem raw hex/valores mágicos)
- [ ] Responsivo testado nos 4 breakpoints
- [ ] Reduced-motion testado
- [ ] Keyboard navigation funcional

---

## 10. Dicas para Melhores Resultados

| Problema | Ação |
|---|---|
| Não decide style/color | Re-rodar `--design-system` com keywords diferentes |
| Dark mode contraste | `references/quick-reference.md` §6: `color-dark-mode` + `color-accessible-pairs` |
| Animações não naturais | §7: `spring-physics` + `easing` + `exit-faster-than-enter` |
| Form UX ruim | §8: `inline-validation` + `error-clarity` + `focus-management` |
| Navegação confusa | §9: `nav-hierarchy` + `bottom-nav-limit` + `back-behavior` |
| Layout quebra mobile | §5: `mobile-first` + `breakpoint-consistency` |
| Performance/jank | §3: `virtualize-lists` + `main-thread-budget` + `debounce-throttle` |

---

## 11. Referências Rápidas (Arquivos do Skill UI UX Pro Max)

| Arquivo | Conteúdo |
|---|---|
| `references/quick-reference.md` | 119 UX guidelines organizadas por categoria |
| `references/pro-rules.md` | App-specific polish: icons, touch feedback, dark mode contrast, safe areas, checklist canônico |
| `data/styles.csv` | 79 styles taxonomy (50 active, 29 supplemental, 9 deprecated) |
| `data/colors.csv` | 192 paletas industry-specific |
| `data/typography.csv` | 74 font pairings com Google Fonts imports |
| `data/ui-reasoning.csv` | 192 reasoning rules (product → pattern/style/color/typo) |
| `data/landing-patterns.csv` | 34 landing page structures |
| `data/charts.csv` | 25 chart types recommendations |
| `data/gsap-presets.csv` | 17 animation presets com snippets |
| `scripts/search.py` | Search engine (BM25, domain/stack filtering) |

---

## 12. Exemplo Completo: MangaScraper

**Input:** "Melhorar visual do MangaScraper (Flask + vanilla HTML/CSS/JS, manga downloader → PDF)"

**Execução:**
```bash
# 1. Design system
python .../search.py "manga reader downloader entertainment tool dark mode" \
  --design-system -p "MangaScraper" --persist --output-dir .

# 2. Suplementar: UX do fluxo download/progress
python .../search.py "progress indicator loading feedback" --domain ux

# 3. Stack: vanilla/html-tailwind
python .../search.py "form validation progress" --stack html-tailwind

# 4. Acessibilidade específica
python .../search.py "focus not obscured" --domain ux
python .../search.py "decorative icon aria hidden" --domain icons

# 5. Implementar + validar contra pro-rules.md
```

**Output esperado:** `design-system/MangaScraper/MASTER.md` com tokens, componentes (Input, Button, Progress, Status, Card), spacing scale, motion presets, dark mode tokens, e página `pages/index.md` com overrides se necessário.

---

## 13. Princípios Norteadores

1. **Design system first** — nunca improvise cores/spacing/typo por componente
2. **Semantic tokens** — `--color-primary`, `--space-md`, `--font-heading` — nunca raw values
3. **Accessibility não-negociável** — prioridade 1 sempre
4. **Platform conventions** — iOS ≠ Android ≠ Web; respeite cada um
5. **Performance = UX** — CLS, INP, LCP são métricas de design
6. **Reduced-motion default** — animação é progressive enhancement
7. **Content reflows** — texto/chips/badges nunca clipam; truncation tem fallback acessível
8. **Consistency > Creativity** — sistema coerente vence componente bonito isolado
9. **Test real devices** — breakpoint testing não substitui device real
10. **Document decisions** — MASTER.md é source of truth; overrides são exceções documentadas