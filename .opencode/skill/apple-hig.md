---
name: apple-hig
description: >
  Cross-platform UI/UX design reviewer grounded in Apple's Human Interface Guidelines (HIG),
  generalized as universal design rules for mobile and desktop apps. 53 guideline documents
  covering visual design, interaction, UX patterns, accessibility, media, and technologies.
  Works with any framework: Flutter, Tauri, Electron, React Native, SwiftUI, UIKit.
---

# Skill: Apple HIG Design Review

Use esta skill para **design review, auditoria de acessibilidade, validação de padrões UX**
contra as 53 guidelines do Apple HIG generalizadas para multiplataforma.

**Não use** para gerar design systems do zero — use `ui-ux-design` + `ui-craft`.
Esta skill é **reference + audit layer** — regras canônicas, severidade, fix guidance.

---

## 1. Estrutura do Repositório (Referência)

```
apple-design-skill/
├── SKILL.md                          # Main skill: review process, audit framework, severity system
├── references/
│   ├── hig-lookup.md                 # Topic → file routing table (USE THIS FIRST)
│   └── hig/                          # 53 design guideline documents
│       ├── accessibility.md
│       ├── color.md
│       ├── dark-mode.md
│       ├── gestures.md
│       ├── layout.md
│       ├── liquid-glass.md           # Liquid Glass / glassmorphism rules + cross-platform impl
│       ├── typography.md
│       ├── motion.md
│       ├── navigation.md
│       ├── onboarding.md
│       ├── loading.md
│       ├── modals.md
│       ├── settings.md
│       ├── notifications.md
│       ├── authentication.md
│       ├── search.md
│       ├── undo.md
│       ├── ... (36 more)
```

---

## 2. Coverage Map (53 Guidelines)

| Category | Topics | Files | Key Files |
|---|---|---|---|
| **Visual Design** | Color, typography, icons, images, materials, Liquid Glass, motion, branding, layout | 10 | `color.md`, `typography.md`, `layout.md`, `liquid-glass.md`, `motion.md`, `iconography.md`, `images.md`, `branding.md`, `materials.md`, `dark-mode.md` |
| **Interaction** | Gestures, keyboards, pointer, stylus, focus, game controls, drag-and-drop | 7 | `gestures.md`, `keyboard.md`, `pointer.md`, `focus.md`, `game-controllers.md`, `drag-drop.md`, `stylus.md` |
| **UX Patterns** | Onboarding, loading, modals, settings, notifications, auth, search, undo, etc. | 18 | `onboarding.md`, `loading.md`, `modals.md`, `settings.md`, `notifications.md`, `authentication.md`, `search.md`, `undo.md`, `empty-states.md`, `errors.md`, `forms.md`, `permissions.md`, `first-launch.md`, `updates.md`, `help.md`, `multitasking.md`, `widgets.md`, `shortcuts.md` |
| **Accessibility** | Screen readers, contrast, inclusion, RTL, privacy | 4 | `accessibility.md`, `contrast.md`, `inclusion.md`, `rtl.md`, `privacy.md` |
| **Media** | Audio, video, haptics | 3 | `audio.md`, `video.md`, `haptics.md` |
| **Technologies** | Payments, maps, ML/AI, AR, live-viewing | 5 | `payments.md`, `maps.md`, `machine-learning.md`, `augmented-reality.md`, `live-viewing.md` |

---

## 3. Workflow de Auditoria

### Passo 1: Entender o Contexto
```markdown
## Audit Context
- **Platform target:** iOS / Android / Desktop / Web / Cross-platform
- **Framework:** Flutter / React Native / SwiftUI / Tauri / Electron / Vanilla
- **Scope:** Full app / Specific screen / Component library / Design system
- **Priority:** Accessibility compliance / Visual polish / Interaction patterns / All
```

### Passo 2: Routing via `hig-lookup.md`
**Sempre comece aqui** — mapeia tópico observável → guideline file(s).

Exemplos:
| Observação | Lookup → File(s) |
|---|---|
| "Botão sem label acessível" | `accessibility.md` + `buttons.md` |
| "Contraste baixo no dark mode" | `dark-mode.md` + `contrast.md` + `color.md` |
| "Animação jank no scroll" | `motion.md` + `performance.md` |
| "Modal não fecha com ESC" | `modals.md` + `keyboard.md` + `focus.md` |
| "Touch target muito pequeno" | `gestures.md` + `layout.md` + `accessibility.md` |
| "Glassmorphism inconsistente" | `liquid-glass.md` + `materials.md` |
| "Navegação confusa no mobile" | `navigation.md` + `gestures.md` + `layout.md` |
| "Form validation UX ruim" | `forms.md` + `errors.md` + `accessibility.md` |

### Passo 3: Carregar Guidelines Relevantes
Leia **apenas** os files mapeados — não carregue todos os 53.

### Passo 4: Avaliar com Severity System

| Severity | Criteria | Action |
|---|---|---|
| **Critical** | Bloqueia usuário primário, viola lei/regulação, falha segurança, data loss | Fix imediato, block release |
| **High** | Viola HIG principle claro, degrada UX significativa, accessibility fail (WCAG AA) | Fix before next release |
| **Medium** | Inconsistência com platform conventions, UX suboptimal, maintenance risk | Fix in next sprint |
| **Low** | Polish, preference, minor inconsistency | Backlog / nice to have |

### Passo 5: Report Format

```markdown
# HIG Audit Report: <App/Screen> <Date>

## Context
- Platform: [iOS/Android/Desktop/Web]
- Framework: [Flutter/React Native/etc.]
- Scope: [Full app / Screen X / Component Y]
- Auditor: [Agent/Human]

## Findings

| Severity | Guideline | Location | Issue | HIG Reference | Fix Guidance |
|---|---|---|---|---|---|
| Critical | Accessibility | LoginScreen:45 | Icon-only button sem accessible label | `accessibility.md` §3.2, `buttons.md` §2.1 | Add `accessibilityLabel` / `aria-label` com ação descritiva |
| High | Dark Mode | HomeView:120 | Texto #666 on #1C1C1E = 3.1:1 | `dark-mode.md` §4.1, `contrast.md` §2 | Use semantic colors: `label` / `secondaryLabel` |
| Medium | Gestures | ListView:88 | Swipe-to-delete sem feedback háptico | `gestures.md` §5.3, `haptics.md` §2 | Add `HapticFeedback.mediumImpact()` on trigger |
| Low | Layout | Settings:200 | Inconsistent spacing 16px vs 20px | `layout.md` §3.2 | Use spacing scale: 8/16/24/32/40/48 |

## Summary
- Critical: X | High: Y | Medium: Z | Low: W
- **Block release:** [Yes/No] — se Critical > 0
- **Top 3 fixes:** [List]

## Platform-Specific Notes
### iOS / Mobile
- [ ] Safe areas respected (notch, home indicator)
- [ ] 44×44pt minimum touch targets
- [ ] Swipe gestures don't conflict with system gestures
- [ ] Keyboard avoidance works

### Android
- [ ] Material 3 parity where applicable
- [ ] Back gesture handling
- [ ] Edge-to-edge support

### Desktop (macOS/Windows/Linux)
- [ ] Window controls (traffic lights / minimize/maximize/close)
- [ ] Menu bar / command palette integration
- [ ] Keyboard shortcuts (Cmd/Ctrl + , for settings)
- [ ] Resize behavior, split view

### Web
- [ ] Viewport meta, no horizontal scroll
- [ ] Focus visible, keyboard nav complete
- [ ] Reduced-motion respected
- [ ] PWA manifest if installable
```

---

## 4. Key Guidelines Quick Reference

### Accessibility (`accessibility.md` + `contrast.md`)
- **Contrast:** 4.5:1 normal text, 3:1 large text (WCAG AA) — APCA preferred para perceptual accuracy
- **Touch targets:** 44×44pt minimum (iOS), 48×48dp (Android)
- **Focus:** Visible `:focus-visible` sempre, never `outline: none` sem replacement
- **Labels:** Every interactive element tem accessible name (text, `aria-label`, `accessibilityLabel`)
- **Semantics:** Buttons = `<button>` / `role="button"`, Links = `<a href>`, Headings = `<h1-6>`
- **Live regions:** `aria-live="polite"` para status updates, `"assertive"` para errors
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` desabilita non-essential animation
- **Dynamic Type:** Text scales with system font size setting (support up to 200%)

### Dark Mode (`dark-mode.md` + `color.md`)
- **Semantic colors only** — nunca hardcoded hex em componentes
- **System palettes:** `label`/`secondaryLabel`/`tertiaryLabel`, `systemBackground`/`secondarySystemBackground`/`tertiarySystemBackground`, `separator`/`opaqueSeparator`
- **Vibrancy/materials:** Use `UIBlurEffect` / `backdrop-filter` para depth, não opacity hacks
- **Images:** `UIImage` / `Image` com `renderingMode = .template` para template images; SF Symbols auto-adapt
- **Test both modes** — light + dark devem ser intentional, não apenas invertidos

### Layout (`layout.md` + `safe-areas.md`)
- **Safe areas:** `env(safe-area-inset-*)` / `SafeAreaView` / `ignoresSafeArea()` intentional
- **Spacing scale:** 8pt base (4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96)
- **Readable content guide:** Max 720px width for body text, 960px for wide layouts
- **Responsive:** Compact (phone) / Regular (tablet/desktop) size classes
- **Optical alignment:** Center align icons com text baseline, not bounding box

### Typography (`typography.md`)
- **System fonts preferred:** San Francisco (iOS/macOS), Roboto (Android), system-ui (Web)
- **Text styles:** Large Title, Title 1-3, Headline, Body, Callout, Footnote, Caption 1-2
- **Dynamic Type:** All styles scale — test largest accessibility size
- **Tracking:** Tighten at display sizes, loosen at caption sizes
- **Curly quotes:** `“ ”` `‘ ’` — não straight quotes
- **Tabular numbers:** `font-variant-numeric: tabular-nums` para números alinhados

### Motion (`motion.md`)
- **Duration scale:** 0.15s (micro), 0.25s (standard), 0.35s (emphasized), 0.5s (major)
- **Easing:** `ease-out` (enter), `ease-in` (exit), `ease-in-out` (transition)
- **Exit faster than enter** — perceived performance
- **Spatial continuity:** Element animates from/to its final position
- **Reduced motion:** Disable parallax, spring, stagger; keep functional transitions (cross-fade, slide)
- **Performance:** Transform + opacity only (compositor), `will-change` scoped, FLIP for layout changes

### Liquid Glass / Glassmorphism (`liquid-glass.md`)
- **Use system materials:** `.regularMaterial`, `.thickMaterial`, `.ultraThinMaterial` — não custom backdrop-filter stacks
- **Vibrancy:** `UIVisualEffectView` / `backdrop-filter: blur()` + `background-color: rgba(255,255,255,0.1)` (light) / `rgba(0,0,0,0.1)` (dark)
- **Borders:** Hairline (0.5pt) em `separatorColor` — nunca hardcoded white/black
- **Depth hierarchy:** Background → Base → Elevated → Overlay → Modal
- **Cross-platform:** CSS `@supports (backdrop-filter: blur(20px))` + fallback solid color

### Interaction Patterns

| Pattern | Key Rules |
|---|---|
| **Modals** (`modals.md`) | `<dialog>` element, focus trap, ESC to dismiss, backdrop click dismiss (sheet), size classes adapt |
| **Navigation** (`navigation.md`) | Tab bar ≤5 items (mobile), sidebar (desktop), back button predictable, deep links work |
| **Forms** (`forms.md`) | Inline validation, error near field, helper text, progressive disclosure, autocomplete attributes |
| **Loading** (`loading.md`) | Skeleton screens > spinners, progress indicators for >1s, cancellation for long ops |
| **Empty States** (`empty-states.md`) | Illustration + actionable copy + primary CTA — never blank |
| **Errors** (`errors.md`) | Inline + toast/sheet for critical, recoverable actions, no technical jargon |
| **Onboarding** (`onboarding.md`) | Skipable, value-first, interactive demo > slides, permission priming |

---

## 5. Cross-Platform Translation Table

| iOS / HIG Term | Android / Material | Web / CSS | Flutter | React Native | Desktop (macOS/Win) |
|---|---|---|---|---|---|
| `UIViewController` | `Activity` / `Fragment` | Page/Route | `Navigator` + `Route` | `Stack Navigator` | `NSWindowController` / `Window` |
| `UINavigationBar` | `TopAppBar` | `<header>` / `nav` | `AppBar` | `Header` | Window titlebar + toolbar |
| `UITabBar` | `BottomNavigationBar` | Fixed bottom nav | `BottomNavigationBar` | `Tab Navigator` | Sidebar / TabView |
| `UIButton` | `Button` / `TextButton` | `<button>` | `TextButton` / `ElevatedButton` | `Button` / `Pressable` | `NSButton` / `Button` |
| `UILabel` | `TextView` | `<p>` / `<span>` / heading | `Text` | `Text` | `NSTextField` |
| `UITableView` / `UICollectionView` | `RecyclerView` / `LazyColumn` | `<table>` / CSS Grid / Flex | `ListView` / `GridView` | `FlatList` / `SectionList` | `NSTableView` / `NSCollectionView` |
| `UIAlertController` | `AlertDialog` / `BottomSheet` | `<dialog>` / Modal | `AlertDialog` / `showModalBottomSheet` | `Alert` / `Modal` | `NSAlert` / `ContentDialog` |
| `UISwitch` | `Switch` | `<input type="checkbox">` styled | `Switch` | `Switch` | `NSSwitch` / `ToggleSwitch` |
| `UISlider` | `Slider` | `<input type="range">` | `Slider` | `Slider` | `NSSlider` / `Slider` |
| `UITextField` | `TextInputEditText` | `<input>` / `<textarea>` | `TextField` | `TextInput` | `NSTextField` / `TextBox` |
| `UIActivityIndicatorView` | `ProgressBar` (indeterminate) | Spinner CSS | `CircularProgressIndicator` | `ActivityIndicator` | `NSProgressIndicator` (spinning) |
| `UIProgressView` | `ProgressBar` (determinate) | `<progress>` | `LinearProgressIndicator` | `ProgressBar` | `NSProgressIndicator` (bar) |
| `UIVisualEffectView` (blur) | `Surface` + `blur` | `backdrop-filter: blur()` | `BackdropFilter` | `BlurView` (community) | `NSVisualEffectView` / `Acrylic` |
| `SF Symbols` | `Material Icons` | `system-ui` emoji / custom SVG | `CupertinoIcons` / `MaterialIcons` | `Ionicons` / custom | SF Symbols (macOS) / Fluent (Win) |
| Dynamic Type | Font scaling (sp) | `rem` + `clamp()` / `@media (prefers-reduced-motion)` | `MediaQuery.textScaler` | `PixelRatio.getFontScale()` | System font size setting |
| Safe Area | `WindowInsets` | `env(safe-area-inset-*)` | `SafeArea` / `MediaQuery.padding` | `SafeAreaView` | Window content margins |
| Haptics | `Vibrator` / `HapticFeedback` | Vibration API (limited) | `HapticFeedback` | `Haptics` (expo) | Trackpad force click / controller |

---

## 6. Severity Decision Matrix

Use para classificar findings consistentemente:

| Finding Type | Critical | High | Medium | Low |
|---|---|---|---|---|
| **Missing accessible label** on interactive | ✅ | | | |
| **Contrast < 3:1** (large text) / < 4.5:1 (normal) | ✅ | | | |
| **Contrast 3:1–4.5:1** (normal text) | | ✅ | | |
| **Touch target < 44×44pt** | ✅ | | | |
| **Touch target 44×44pt but cramped** | | ✅ | | |
| **Focus invisible** (`outline: none` sem replacement) | ✅ | | | |
| **Focus visible but low contrast** | | ✅ | | |
| **Heading level skip** (h1 → h3) | | ✅ | | |
| **Heading level skip** (h2 → h4) | | | ✅ | |
| **No reduced-motion support** | | ✅ | | |
| **Animation > 500ms** sem purpose | | | ✅ | |
| **Non-semantic interactive** (`div` com onClick) | ✅ | | | |
| **Placeholder as label** | | ✅ | | |
| **Error only at top of form** | | ✅ | | |
| **Modal não trap focus** | ✅ | | | |
| **Modal não fecha com ESC** | | ✅ | | |
| **Hardcoded colors** (sem semantic tokens) | | | ✅ | |
| **Inconsistent spacing** (16px vs 20px) | | | ✅ | |
| **Non-system font** sem justification | | | | ✅ |
| **Straight quotes** em body text | | | | ✅ |

---

## 7. Platform-Specific Checklists

### Mobile (iOS/Android) — Must Pass
- [ ] 44×44pt / 48×48dp minimum touch targets
- [ ] Safe areas respected (notch, home indicator, system gestures)
- [ ] Dynamic Type / font scaling supported up to 200%
- [ ] Dark mode intentional (semantic colors, not inverted)
- [ ] Reduced motion respected
- [ ] Back gesture / system back handled
- [ ] Keyboard avoidance (input not covered)
- [ ] Haptic feedback on key interactions
- [ ] Pull-to-refresh / swipe actions don't conflict with system
- [ ] Permissions primed before request

### Desktop (macOS/Windows/Linux) — Must Pass
- [ ] Window controls correct (traffic lights / min/max/close)
- [ ] Menu bar integration (macOS) / Command palette (Win/Linux)
- [ ] Keyboard shortcuts: Cmd/Ctrl+, (settings), Cmd/Ctrl+Z (undo), etc.
- [ ] Resize behavior: content reflows, no horizontal overflow
- [ ] Split view / multi-window support
- [ ] Focus ring visible, keyboard nav complete
- [ ] Dark mode follows system (macOS) / app setting (Win/Linux)
- [ ] Accessibility tree exposes correct roles/states

### Web / PWA — Must Pass
- [ ] Viewport meta: `width=device-width, initial-scale=1`
- [ ] No horizontal scroll at 320px
- [ ] Focus visible on all interactive elements
- [ ] Keyboard navigation: Tab order logical, Skip link if needed
- [ ] ARIA labels on icon-only buttons
- [ ] Heading outline valid (h1-h6 no skips)
- [ ] Landmarks: `<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>`
- [ ] Reduced motion: `@media (prefers-reduced-motion: reduce)` disables non-essential
- [ ] Images: `width`/`height` or `aspect-ratio` (no CLS)
- [ ] Forms: `autocomplete`, `inputmode`, labels associated
- [ ] PWA: manifest, service worker, install prompt (if applicable)

---

## 8. Integração com suas Skills

| Sua Skill | Como usa Apple HIG |
|---|---|
| `ui-ux-design` | Priority 1-3 (Accessibility, Touch, Performance) **= subset of HIG**. Quando sua skill diz "consulte `pro-rules.md`", use esta skill para guidelines granulares + severity. |
| `ui-craft` | Anti-slop detector 43 rules **overlaps HIG** (accessibility, dark patterns, forms). UICraftScore a11y dimension **usa 5 checks** que mapeiam para HIG. Agents `a11y-auditor` **complementa** HIG audit. |
| `ui-ux-orchestrator` | Audit node chama `ux-audit-skill` + `design-critic-skill` → **adicione HIG audit** como validation gate extra para mobile/desktop targets. |

**Workflow combinado:**
```bash
# 1. Sua skill: design system generation
python .../search.py "manga reader downloader" --design-system -p "MangaScraper"

# 2. UI Craft: build + anti-slop + scoring
/ui-craft:craft landing
/ui-craft:heuristic
npx ui-craft-detect --scope changed --fail-on error

# 3. Apple HIG: audit específico mobile/desktop
# Carrega guidelines relevantes via hig-lookup.md
# Ex: dark-mode.md + contrast.md + gestures.md + accessibility.md
# Gera report com severity matrix

# 4. Orchestrator: compliance gate
# workflow-compliance-supervisor verifica se HIG findings resolvidos
```

---

## 9. Quick Commands (Mental Shortcuts)

| Task | Guideline Files to Load |
|---|---|
| Audit dark mode | `dark-mode.md`, `color.md`, `contrast.md`, `materials.md` |
| Audit accessibility | `accessibility.md`, `contrast.md`, `focus.md`, `keyboard.md`, `inclusion.md` |
| Audit touch/gestures | `gestures.md`, `layout.md`, `haptics.md`, `pointer.md` |
| Audit forms | `forms.md`, `errors.md`, `validation.md`, `accessibility.md` |
| Audit navigation | `navigation.md`, `modals.md`, `tab-bar.md`, `sidebar.md` |
| Audit typography | `typography.md`, `dynamic-type.md`, `layout.md` |
| Audit motion | `motion.md`, `performance.md`, `reduced-motion.md` |
| Audit glassmorphism | `liquid-glass.md`, `materials.md`, `dark-mode.md` |
| Audit onboarding | `onboarding.md`, `first-launch.md`, `permissions.md` |
| Audit settings | `settings.md`, `forms.md`, `navigation.md` |

---

## 10. Installation

### Claude Code
```bash
git clone https://github.com/dickwu/apple-design-skill.git
claude install-skill ./apple-design-skill
```

### Cursor (Option A — .cursor/rules)
```markdown
# .cursor/rules/apple-design.mdc
---
description: Apple HIG design review and improvement
globs: ["**/*.dart", "**/*.tsx", "**/*.jsx", "**/*.vue", "**/*.svelte", "**/*.swift"]
---
@import https://raw.githubusercontent.com/dickwu/apple-design-skill/main/SKILL.md
```

### Cursor (Option B — Project Rules)
Settings → Rules → Add rule → paste SKILL.md content → Reference Files: add `references/` directory

### Codex / Generic Agent
```bash
git clone https://github.com/dickwu/apple-design-skill.git .design-rules
# Reference in AGENTS.md or custom instructions
```

---

## 11. Origin & License

Design rules extracted and generalized from **Apple's publicly available Human Interface Guidelines**.
Platform-specific terms (iOS → mobile, macOS → desktop) and Apple APIs replaced with framework-agnostic equivalents while preserving all design principles.

**License:** Derived from Apple's public HIG documentation. Use at your own discretion.

---

## 12. Princípios Norteadores (Apple HIG)

1. **Clarity over cleverness** — obvious always wins
2. **Deference to content** — UI gets out of the way
3. **Depth communicates hierarchy** — materials, shadows, layering
4. **Consistency breeds trust** — platform conventions > custom patterns
5. **Direct manipulation** — touch/pointer interacts with content, not chrome
6. **Feedback is mandatory** — every action has visible response
7. **Accessibility is not optional** — inclusive by default
8. **System integration** — respect platform behaviors, gestures, settings
9. **Progressive disclosure** — complexity on demand
10. **Human-centered** — design for people, not specs