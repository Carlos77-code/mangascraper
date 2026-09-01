---
name: ui-craft
description: >
  Design engineering system for AI coding agents. Anti-slop detection, deterministic scoring,
  design memory persistence, review agents, MCP quality gates, and opinionated craft references.
  Ships designer-grade UI by default — same prompt, shippable result.
---

# Skill: UI Craft

Use esta skill para **qualquer tarefa de UI**: construir superfícies, revisar, animar, polir, auditar, tokenizar, finalizar.
Funciona em 4 rungs (escadas) — comece no rung 0 (zero effort), suba quando quiser controle.

**Não use** para lógica backend pura, API design, infra — a menos que mude como a UI *parece, sente, move ou é interagida*.

---

## 1. Conceito Central: The Ladder (4 Rungs)

| Rung | Objetivo | Comando principal | Esforço |
|---|---|---|---|
| **0 · Ask** | Melhor UI com zero esforço | (nenhum — skill ativa passivamente) | none |
| **1 · Direct** | Controle sobre uma passada | `/craft`, `/critique`, `/polish`, `/animate`, … | one command |
| **2 · Persist** | Consistência cross-session | `/brief`, `/tokens`, `/remember` | write once |
| **3 · Enforce** | Proof que não regrediu | `/finalize`, review agents, MCP gates, `ui-craft-detect` | wire once |

**Express lane:** `/sddesign` — walk rungs 1→3 em um guided run para uma surface grande.

---

## 2. Quick Start (Rung 0)

Instale o CLI (recomendado):
```bash
# macOS/Linux
curl -fsSL https://skills.smoothui.dev/install | bash
# Windows
irm https://skills.smoothui.dev/install.ps1 | iex

ui-craft install  # detecta harness, wiring interativo
```

Ou via plugin (Claude Code):
```
/plugin marketplace add educlopez/ui-craft
/plugin install ui-craft
```

**Primeiro uso:** rode `/start` — lê projeto (framework, tokens, brief, UI existente), reporta rung atual, sugere próximo comando.

---

## 3. Discovery & Knobs (Rung 0→1)

Antes de buildar, skill analisa projeto por design decisions existentes:
- CSS variables, Tailwind config, font imports, component themes
- Se já tem design system → respeita
- Se não → 4 perguntas rápidas (style, accent color, font, optional animation stack)

**3 Knobs numéricos (1-10) mudam comportamento, não só tom:**

| Knob | 1 | 10 | Default |
|---|---|---|---|
| `CRAFT_LEVEL` | ship fast, skip Polish Pass | pixel-perfect, compound details | 7 |
| `MOTION_INTENSITY` | hover states only | scroll-linked, page transitions, magnetic cursor | 5 |
| `VISUAL_DENSITY` | whitespace-heavy editorial | dashboard-dense | 5 |

Em `MOTION_INTENSITY 8+`, carrega `references/stack.md` apenas se user optar em Motion/GSAP/Three.js no Discovery.

---

## 4. Style Variants (Opt-in Sibling Skills)

| Variant | Triggers on | Knobs locked | Style anchors |
|---|---|---|---|
| `ui-craft-minimal` | "minimal", "Linear-like", "Notion-like" | CRAFT=8, MOTION=3, DENSITY=2 | Monochrome + one accent, Inter/Geist, hairline borders |
| `ui-craft-editorial` | "editorial", "magazine", "Medium-like" | CRAFT=9, MOTION=4, DENSITY=3 | Serif display + humanist body, wide reading column, OpenType |
| `ui-craft-dense-dashboard` | "dashboard", "admin panel", "Bloomberg-like" | CRAFT=7, MOTION=3, DENSITY=9 | IBM Plex + mono numbers, semantic palette, 4/8px grid |

Cada variant defere ao main skill para base rules — só sobrescreve knob defaults + style-specific guidance.

**Style presets** (playful/brutalist): `examples/presets/playful.md`, `examples/presets/brutalist.md` — aplicados via knob values + overrides.

---

## 5. Slash Commands (25 comandos organizados por rung)

### Front Door
| Command | Does |
|---|---|
| `/ui-craft:start` | Read-only. Lê projeto, reporta rung, nomeia próximo comando worth running. |

### Rung 1 · Direct — One focused pass
**Build a surface:**
| Command | Does | Next |
|---|---|---|
| `/ui-craft:craft` | One-shot surface build. Craft Read + variance + signature bet → named composition → theme → build order → acceptance bar. Surfaces: `dashboard`, `landing`, `auth`. | `/finalize` |
| `/ui-craft:shape` | Wireframe-first. ASCII layout + content inventory + state list + open questions antes de JSX. | `/craft` |
| `/ui-craft:redesign` | Redesign sem regression. Audita existente, classifica preserve (brand, IA/SEO, content, conversion), pick scope (refresh/reskin/rebuild), moderniza. | `/critique` |

**Adjust one dimension:**
| Command | Does | Next |
|---|---|---|
| `/ui-craft:animate` | Add/fix motion. Honra `MOTION_INTENSITY` + stack. | `/polish` |
| `/ui-craft:adapt` | Responsive pass — mobile, tablet, desktop, touch, safe areas. | `/audit` |
| `/ui-craft:typeset` | Typography pass — fonts, scale, tracking, micro-typography. | `/polish` |
| `/ui-craft:colorize` | Introduz color estrategicamente — one accent, 3-5 placements, no decoration. | `/tokens` |
| `/ui-craft:clarify` | UX copy — button labels, error messages, empty states, CTAs. | `/critique` |
| `/ui-craft:extract` | Pull repeated patterns → shared components + tokens. | `/tokens` |
| `/ui-craft:distill` | Strip to essence. Cut sections que não earn space. Absorve visual-weight reduction. | `/polish` |
| `/ui-craft:delight` | Purposeful micro-interactions — copy first, animation last. | `/finalize` |
| `/ui-craft:polish` | Final pass — compound details que turn "done" into "crafted". | `/finalize` |
| `/ui-craft:bolder` | Raise DESIGN_VARIANCE + motion amplitude — stronger composition, type, signature. | `/critique` |
| `/ui-craft:quieter` | Lower variance + motion — more restrained grids, type, color. Honra prefers-reduced-motion. | `/critique` |

**Review a surface:**
| Command | Does | Next |
|---|---|---|
| `/ui-craft:heuristic` | **Signature move.** Scored critique — Nielsen 10 + 6 design laws + 5 persona walkthroughs. Markdown scorecard com impact tags. No code changes. | fix, then `/finalize` |
| `/ui-craft:critique` | UX — hierarchy, clarity, anti-slop. No code changes. | `/polish` |
| `/ui-craft:audit` | Technical — a11y, performance, responsive. Prioritized findings table. | `/harden` |
| `/ui-craft:unhappy` | State-first — design every non-happy state (idle/loading/empty/error/partial/conflict/offline) antes do happy path. | `/harden` |
| `/ui-craft:harden` | Production readiness — loading/empty/error states, i18n, offline, edge cases. | `/finalize` |

### Rung 2 · Persist — Written once, read forever
| Command | Does | Next |
|---|---|---|
| `/ui-craft:brief` | Write/update durable design brief at `.ui-craft/brief.md` — 5 required sections + principles workshop. Run before net-new project. | `/tokens` |
| `/ui-craft:tokens` | Audit/establish 3-layer token spine (primitive → semantic → component). Light + dark both intentional. 7 required categories. | `/craft` |
| `/ui-craft:remember` | Record learned design constraint into `.ui-craft/brief.md` — corrections que persist across sessions. | keep working |

### Rung 3 · Enforce — Wired once into review/CI
| Command | Does | Next |
|---|---|---|
| `/ui-craft:finalize` | Pre-ship gate. Runs detector + brief/token check + 10-pass finish bar + feedback hierarchy filter. Output only — no auto-fix. | ship |

**Rung 3 rest** não são comandos: 2 review agents, MCP quality gates, composite score, `ui-craft-detect` em CI.

### Express Lane
| Command | Does | Next |
|---|---|---|
| `/ui-craft:sddesign` | Full spec-driven pipeline: brief → tokens → shape → craft → converge → ship. Escreve `.ui-craft/spec.md`. Walks rungs 1→3 em one run. | ship |

---

## 6. Rung 0 in Practice — Intent Routing

| You say | It runs |
|---|---|
| "Build a pricing page" | Build pass — layout, typo, color, spacing, a11y, responsive decided together |
| "Add an entrance to this modal" | Motion pass — right easing, duration, origin point |
| "Review this component" | Review pass — generic AI patterns, a11y gaps, missed details |
| "Polish this dashboard" | Polish pass — 20 small things que turn "done" into "crafted" |

Climb to rung 1 quando quiser nomear a pass yourself.

---

## 7. 32 Domain References (Carregados via routing table)

| Domain | Covers |
|---|---|
| `craft-intent` | Craft Read, DESIGN_VARIANCE knob, signature bets, product+marketing build patterns, accent rotation |
| `recipe-dashboard` | 3 named compositions (Overview/Command/Analytics), exact shell spec, build order, acceptance bar |
| `recipe-landing` | Marketing compositions (product-forward/message-forward/proof-forward), section grammar, CTA hierarchy |
| `recipe-auth` | Sign-in/sign-up compositions (split panel/centered card), form contract, trust signals |
| `theme-presets` | 4 named production token stacks (Graphite, Porcelain, Carbon, Signal) — full OKLCH, type, radius, shadow, motion; light+dark intentional |
| `motion` | Decision ladder, duration+easing token scales, interaction rules, choreography, motion budget, reduced-motion contract, rendering perf |
| `layout` | Spacing systems, optical alignment, layered shadows, visual hierarchy |
| `typography` | `text-wrap: balance`, tabular-nums, font scale, curly quotes |
| `color` | OKLCH, design tokens, dark mode, APCA contrast |
| `accessibility` | WAI-ARIA, keyboard nav, focus management, touch targets |
| `modern-css` | View Transitions, Anchor Positioning, Popover, `<dialog>`, `interpolate-size`, `color-mix()`, scroll-driven, container queries |
| `responsive` | Fluid sizing, mobile-first, touch zones, safe areas |
| `sound` | Web Audio API, feedback sounds, appropriateness matrix |
| `copy` | Voice/tone matrix, reading level, terminology, locale-aware strings, inclusive language, error/empty/CTA tactics |
| `review` | Systematic critique methodology, anti-slop detection, Polish Pass |
| `dashboard` | Signal-to-noise hierarchy (hero/supporting/context/deep-dive), sidebar, metric cards, data tables |
| `inspiration` | Pattern archetypes from mature SaaS — hero archetypes, signature details, what mature interfaces never do |
| `brief` | Durable design brief format — product purpose, primary user, 3-5 ranked principles, success metric, out of scope |
| `tokens` | 3-layer token spine (primitive→semantic→component). Both modes intentional. 7 required categories. |
| `finish-bar` | 10-pass finishing protocol with measurable criteria. Hierarchy/type/surface/spacing/icon/states/motion/microcopy/pixel/data |
| `principles-catalog` | 42 example principles across 8 product categories, seed para `/brief` workshop |
| `stack` | Motion, GSAP, Three.js — decision tree, patterns, perf gotchas, anti-patterns (opt-in) |
| `heuristics` | Nielsen's 10 + Fitts/Hick/Doherty/Cleveland-McGill/Miller/Tesler com 1-5 scoring rubric + impact framing |
| `personas` | 5 archetypes (first-timer, power user, low-bandwidth, screen-reader, one-thumb) com walkthrough checklists |
| `state-design` | Idle/loading/empty/error/partial/conflict/offline — design unhappy path first |
| `dataviz` | Cleveland-McGill perceptual hierarchy, chart selection matrix, ColorBrewer+Okabe-Ito, direct labeling, Tufte |
| `ai-chat` | Streaming contract, 7-state model, tool traces, citations, feedback affordances, generative UI, conversation layout |
| `forms` | Validation timing, progressive disclosure, multi-step wizards, autosave, optimistic submit, field-specific patterns |
| `spec` | `.ui-craft/spec.md` format — per-surface composition, layout skeleton, component inventory, state lattice, acceptance bar |
| `agents` | design-reviewer, a11y-auditor — read-only, fresh context, parallel |

---

## 8. Anti-Slop Detection (43 Rules)

Scanner **zero-dep** (`ui-craft-detect` / `npx ui-craft-detect`) — usa em CI, pre-commit, agent hooks, MCP.

**Categories:**
- **AI Slop** (transition: all, bounce easing, purple gradients, ALL CAPS, glassmorphism neon, identical card grids, glow affordances, colored accent borders, emoji icons, gradient blobs, bento abuse, stagger-animate everything, star ratings, generic CTAs, text walls, pure black text)
- **Dark Patterns** (confirmshaming, destructive actions without confirmation)
- **A11y** (icon-only buttons sem label, modal sem `<dialog>`, `outline: none` sem `:focus-visible`, streaming sem `aria-live`, heading-level skips)
- **Forms** (placeholder-as-label, missing autocomplete)
- **Auth tells** (caps "OR" dividers, full-bleed saturated brand panels)
- **Marketing copy tells** (eyebrow floods, scroll cues, numbered section eyebrows, duplicate CTA intent, em-dash floods)
- **Perf** (images sem dimensions → CLS)
- **Tables** (no overflow handling mobile)
- **Dataviz** (categorical rainbow palettes)
- **State design** (data fetching sem empty/error branches)
- **Placeholder copy shipped** (Lorem ipsum, TODO, John Doe)

### CLI Usage
```bash
# Scan directory
npx ui-craft-detect ./src

# JSON output
npx ui-craft-detect ./src --json

# Diff-scoped (CI gate — only new issues in changed lines)
npx ui-craft-detect --scope changed --fail-on error

# Live URL scan (puppeteer se disponível, fetch fallback)
npx ui-craft-detect https://your-site.com

# Install agent hooks (Claude Code / Cursor)
npx ui-craft-detect hooks install

# Install pre-commit hook
npx ui-craft-detect init-hook --native  # ou --husky

# CI integration (GitHub Action)
npx ui-craft-detect ci install
```

**Exit codes:** 0 clean, 1 findings (ou below threshold), 2 arg error.

---

## 9. Design Quality Scores

### UICraftScore (Deterministic 0-100)
```javascript
score = 100
      − (antiSlop_critical × 8) − (antiSlop_major × 4) − (antiSlop_warn × 1)
      − (token_findings × 2)
      − (a11y_critical × 8) − (a11y_major × 4)
clamped [0, 100]
```
**Grades:** A ≥ 90, B ≥ 80, C ≥ 70, D ≥ 60, F < 60

**Dimensions:**
| Dimension | Source | Penalty |
|---|---|---|
| `anti_slop` | 43 rules from detect | critical −8, major −4, warn −1 |
| `token_discipline` | Raw hex, off-scale radius/spacing/z-index | −2 per finding (flat) |
| `a11y` | 5 static checks (no overlap): img-no-alt, non-semantic-interactive, positive-tabindex, aria-invalid-no-describedby, no-reduced-motion | critical −8, major −4 |

**Run:**
```bash
# Single file
node scripts/eval.mjs src/components/Hero.tsx

# Directory
node scripts/eval.mjs src/components/

# Full regression gate (8 fixtures)
node scripts/eval.mjs --baseline

# JSON + threshold
node scripts/eval.mjs src/components/Hero.tsx --json --threshold 80
```

### UsabilityScore (Judged 0-100)
Rolled up from `/heuristic` scorecard (Nielsen 10 + 6 design laws):
```
heuristic_base = round( ((mean(nielsen_scores) − 1) / 4) × 100 )
UsabilityScore = clamp( heuristic_base − 5 × (failed design laws), 0, 100 )
```
Same grade bands. **Judged, not deterministic** — varia run to run. Gate CI on UICraftScore; use UsabilityScore para review depth.

---

## 10. MCP Server (7 Deterministic Tools)

```json
{ "mcpServers": { "ui-craft": { "command": "npx", "args": ["-y", "ui-craft-mcp@0.9.0"] } } }
```

| Tool | Does |
|---|---|
| `route_task` | Routes natural-language prompt → references, commands, tools, first move (pointers only) |
| `check_anti_slop` | 43-rule scanner via `scan()` — in-process, no subprocess |
| `tokens_lint` | Off-system token detector: raw hex, non-scale radius/spacing px, magic z-index |
| `acceptance_bar` | Acceptance checklist for surface (dashboard/landing/auth/generic) — data only |
| `score_ui` | Composite UICraftScore (0-100 + grade + per-dim subscores) |
| `fold_candidates` | Landing-fold composition classes, preferring unused ones |
| `check_fold` | Renders URL → fold screenshot, class, drift, invariants |

**Boundary:** MCP = checks layer (deterministic, identical output). Skill = taste layer (judgment, aesthetics). Never overlap.

---

## 11. Agents (Claude Code Plugin — Read-Only, Parallel)

| Agent | Invocation | Does |
|---|---|---|
| `design-reviewer` | `ui-craft:design-reviewer` | Adversarial design critique — anti-slop signals, Nielsen/design-law heuristics. Severity-tagged findings (Critical/Warning/Suggestion, file:line). No edits. |
| `a11y-auditor` | `ui-craft:a11y-auditor` | Accessibility audit — keyboard, focus-visible, APCA contrast, ARIA, touch targets, reduced-motion. Severity-tagged findings. No edits. |

**Parallel verify team:**
```
Delegate ui-craft:design-reviewer and ui-craft:a11y-auditor together on [target].
Run both simultaneously. Each returns independent severity-tagged findings table.
```

**When agents vs commands:**
- Agents — fresh context, parallel, read-only. Best: final review, PR audit, CI-style verification.
- Commands (`/critique`, `/audit`) — inline, sequential. Best: interactive build sessions.

---

## 12. Framework Agnostic Implementation

Skill detecta styling approach e adapta:
- **Tailwind CSS** — utility classes, maps rules to Tailwind equivalents
- **CSS Modules** — scoped `.module.css`
- **styled-components/Emotion** — tagged templates
- **Vanilla CSS** — custom properties + modern features
- **SFC styles** (Vue, Svelte, Astro) — `<style>` blocks

---

## 13. Canonical Pipeline

```
Discovery → /brief → /tokens → build → /finalize → ship
```

- `brief` + `tokens` = durable artifacts at `.ui-craft/brief.md` + project token destination
- Sobrevivem across sessions, anchor every subsequent design decision
- `/finalize` runs 10-pass finish bar before merge, gated on brief existing

---

## 14. Project Structure (Skill Internal)

```
ui-craft/
├── agents/
│   ├── design-reviewer.md
│   └── a11y-auditor.md
├── skills/
│   ├── ui-craft/
│   │   ├── SKILL.md              # Slim entry — knobs, discovery, anti-slop, routing
│   │   └── references/           # 32 domain references
│   ├── ui-craft-minimal/
│   ├── ui-craft-editorial/
│   └── ui-craft-dense-dashboard/
├── commands/                      # 25 slash commands (source of truth)
├── examples/
│   ├── animation-storyboard.md
│   └── presets/
│       ├── playful.md
│       └── brutalist.md
├── evals/
│   └── quality/                   # score.mjs, fixtures, baselines.json
├── scripts/
│   ├── detect.mjs                # ui-craft-detect CLI
│   └── validate.mjs              # Manifest + link checker
├── cli/assets/<harness>/          # Per-harness assets (go:embed)
├── .codex/skills/, .cursor/skills/, .gemini/skills/, .opencode/skills/, .agents/skills/
└── .github/workflows/validate.yml
```

---

## 15. Quality Gate (Before PR/Publish)

```bash
npm ci --prefix mcp
pnpm verify
```
Non-fail-fast: distribution-contract checks, plugin/link validation, mirror drift guards, detector+quality suites, MCP smoke tests, Go tests/vet/fmt.

**Sync mirrors after skill/command changes:**
```bash
npm run sync            # skills/ + commands/ → cli/assets/ + repo-root mirrors
npm run check:mirrors   # Drift guard (CI runs this)
```

---

## 16. Integração com sua `ui-ux-design.md`

| Sua skill | UI Craft | Como combinam |
|---|---|---|
| `--design-system` generation | `/craft` + recipes | Sua skill gera design system; UI Craft implementa via recipe (dashboard/landing/auth) + acceptance bar |
| Priority table (1-10) | Anti-slop 43 rules + heuristics | Sua prioridade 1-3 ⊂ anti-slop + a11y checks; prioridade 4-10 ⊂ heuristic scoring |
| `pro-rules.md` checklist | `/finalize` 10-pass finish bar | Checklist vira gate determinístico no finish bar |
| Stack guidelines | Framework-agnostic detection | Sua skill passa stack; UI Craft adapta implementation |
| Design tokens | 3-layer token spine (primitive→semantic→component) | Sua skill gera tokens; UI Craft valida + persistência cross-session |
| Persist design system | `.ui-craft/brief.md` + `.ui-craft/spec.md` | Master/Overrides → Brief + Spec (mais estruturado) |

**Workflow combinado:**
```bash
# 1. Sua skill: generate design system
python .../search.py "manga reader downloader" --design-system -p "MangaScraper" --persist --output-dir .

# 2. UI Craft: brief + tokens from generated system
/ui-craft:brief   # lê MASTER.md, escreve .ui-craft/brief.md
/ui-craft:tokens  # extrai tokens do MASTER.md para 3-layer spine

# 3. Build surface
/ui-craft:craft dashboard  # usa recipe-dashboard + seus tokens

# 4. Validate
/ui-craft:heuristic        # scored critique
/ui-craft:finalize         # pre-ship gate

# 5. CI gate
npx ui-craft-detect --scope changed --fail-on error
```

---

## 17. Referências Rápidas (Arquivos do Skill UI Craft)

| Arquivo | Conteúdo |
|---|---|
| `skills/ui-craft/SKILL.md` | Entry point — knobs, discovery, anti-slop list, routing table |
| `skills/ui-craft/references/craft-intent.md` | Craft Read, DESIGN_VARIANCE, signature bets |
| `skills/ui-craft/references/recipe-dashboard.md` | Dashboard compositions, shell spec, build order, acceptance bar |
| `skills/ui-craft/references/recipe-landing.md` | Landing compositions, section grammar, CTA hierarchy |
| `skills/ui-craft/references/recipe-auth.md` | Auth compositions, form contract, trust signals |
| `skills/ui-craft/references/theme-presets.md` | Graphite, Porcelain, Carbon, Signal — full OKLCH stacks |
| `skills/ui-craft/references/motion.md` | Decision ladder, easing scales, choreography, perf |
| `skills/ui-craft/references/heuristics.md` | Nielsen 10 + 6 laws rubric, scoring, impact tags |
| `skills/ui-craft/references/finish-bar.md` | 10-pass protocol with measurable criteria |
| `skills/ui-craft/references/tokens.md` | 3-layer spine, 7 categories, cross-refs |
| `skills/ui-craft/references/anti-slop.md` | 43 rules com exemplos good/bad |
| `evals/quality/score.mjs` | UICraftScore formula, weights, grade bands |
| `scripts/detect.mjs` | Anti-slop scanner (CLI + MCP tool) |
| `agents/design-reviewer.md` | Adversarial critic agent |
| `agents/a11y-auditor.md` | Accessibility auditor agent |

---

## 18. Exemplo MangaScraper com UI Craft

```bash
# 1. Design system (sua skill)
python .../search.py "manga reader downloader entertainment dark mode" \
  --design-system -p "MangaScraper" --persist --output-dir .

# 2. Brief + Tokens (UI Craft)
/ui-craft:brief      # lê design-system/MangaScraper/MASTER.md
/ui-craft:tokens     # estabelece 3-layer spine

# 3. Craft landing page (recipe-landing)
/ui-craft:craft landing

# 4. Review + Finalize
/ui-craft:heuristic
/ui-craft:finalize

# 5. CI gate
npx ui-craft-detect --scope changed --fail-on error
```

---

## 19. Princípios Norteadores (UI Craft)

1. **Taste writes code** — skill + commands produzem implementação, não só advice
2. **Deterministic gates** — anti-slop, tokens, scoring são identical every run
3. **Judgment separated** — agents = independent review; commands = inline lens
4. **Persistence by default** — brief/tokens/spec sobrevivem sessions
5. **Anti-slop first** — reject AI patterns before adding craft
6. **Score don't guess** — UICraftScore reproduzível; UsabilityScore para depth
7. **Framework follows design** — detect stack, adapt implementation
8. **Reduced-motion default** — animação é progressive enhancement
9. **Content reflows** — texto/chips/badges nunca clipam
10. **Ship the spec** — `/sddesign` ou `/finalize` antes de merge