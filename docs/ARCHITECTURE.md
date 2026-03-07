# @alleato/ui Architecture

## Overview

`@alleato/ui` is a framework-agnostic Web Components library built with vanilla TypeScript. It provides reusable, themeable, and accessible UI components for Alleato projects.

**Key principles:**
- Shadow DOM encapsulation for style isolation
- CSS custom properties for theming across Shadow DOM boundaries
- No external runtime dependencies
- Tree-shakeable exports via subpath imports
- Full TypeScript support with generated declarations

## Package Structure

```
src/
  components/          # 16 Web Component files
  styles/              # Shared utility CSS (buttons, animations)
  themes/              # Theme CSS files (5 themes + base mapping layer)
  index.ts             # Barrel export + registerAll()
demo/
  index.html           # Showcase page with all components
  main.ts              # Demo setup, theme picker, form handling
tsup.config.ts         # Build configuration (entry points, formats)
vite.config.ts         # Dev server config (port 3000)
```

---

## Component Catalog

### Base Class

**`CardBase`** (`card-base.ts`) — Abstract base for card-style components. Provides shared Shadow DOM markup and styles (icon area, title, description). Child components extend it and pass custom styles + template.

### Card Components

| Component | Element | Purpose | Key Attributes |
|-----------|---------|---------|----------------|
| `ServiceCard` | `<alleato-service-card>` | Focus area with highlights list | `icon`, `heading`, `description` + `.highlights` property |
| `ApproachCard` | `<alleato-approach-card>` | Philosophy principle with badge | `icon`, `heading`, `description`, `badge` |
| `ShowcaseCard` | `<alleato-showcase-card>` | Resource link with arrow | `icon`, `heading`, `description`, `type` |

### Layout & Navigation

| Component | Element | Purpose | Key Attributes |
|-----------|---------|---------|----------------|
| `PageSection` | `<alleato-page-section>` | Full-width section wrapper | `heading`, `subtitle` |
| `SectionHeader` | `<alleato-section-header>` | Centered heading + subtitle | `heading`, `subtitle` |
| `NavBar` | `<alleato-nav-bar>` | Fixed nav with hamburger menu | `brand`, `logo`, `menu-open` + `.items` property |
| `SiteFooter` | `<alleato-site-footer>` | Footer with branding | `brand`, `logo`, `tagline`, `location`, `badge`, `copyright` |

### Form Components

| Component | Element | Purpose | Key Attributes |
|-----------|---------|---------|----------------|
| `FormField` | `<alleato-form-field>` | Input or textarea | `label`, `name`, `type`, `placeholder`, `required`, `rows` |
| `FormContainer` | `<alleato-form-container>` | Form wrapper with validation | `action`, `method`, `submit-text`, `success-message` |

`FormContainer` emits a `form-submit` custom event with `{ detail: { fieldName: value } }`. Fields with `slot="row"` render in a 2-column grid.

### Terminal Components

| Component | Element | Purpose | Key Attributes |
|-----------|---------|---------|----------------|
| `TerminalWindow` | `<alleato-terminal-window>` | macOS-style window chrome | `title`, `closable`, `minimizable`, `maximizable` |
| `TerminalEmbed` | `<alleato-terminal-embed>` | Container for xterm.js | none (use `.container` getter) |
| `TerminalIntro` | `<alleato-terminal-intro>` | First-time terminal mode dialog | `command`, `confirm-text`, `cancel-text`, `storage-key` |

### Utility Components

| Component | Element | Purpose | Key Attributes |
|-----------|---------|---------|----------------|
| `AlleatoIcon` | `<alleato-icon>` | SVG icon renderer (17 built-in icons) | `name` |
| `ThemePicker` | `<alleato-theme-picker>` | Theme switcher dropdown | `current`, `storage-key` + `.themes` property |

---

## Component Patterns

### Shadow DOM

All components use open Shadow DOM:

```ts
constructor() {
  super();
  this.attachShadow({ mode: 'open' });
  const el = document.createElement('template');
  el.innerHTML = `<style>${STYLES}</style>${TEMPLATE}`;
  this.shadowRoot!.appendChild(el.content.cloneNode(true));
}
```

Open mode allows CSS custom properties to cross the Shadow DOM boundary, which is how theming works. Component styles are fully encapsulated — they don't leak out, and external styles don't leak in (except via custom properties).

### Registration

Every component exports a `register()` function with a define guard:

```ts
export function register() {
  if (!customElements.get('alleato-service-card')) {
    customElements.define('alleato-service-card', ServiceCard);
  }
}
```

Consumers register individually or use `registerAll()` which loads all components via dynamic imports (non-blocking).

### Reactive Attributes

Components declare observed attributes and re-render on change:

```ts
static get observedAttributes() {
  return ['icon', 'heading', 'description'];
}

attributeChangedCallback() {
  if (this.isConnected) this.render();
}
```

Some components expose JS properties (e.g., `.highlights`, `.items`, `.themes`) for data that doesn't fit well as string attributes.

---

## Theme System

### Three-Layer Token Architecture

```
Layer 1: Raw Primitives        --theme-bg, --theme-fg-primary, --theme-radius
Layer 2: Component Tokens      --card-bg, --form-input-border, --nav-logo-color
Layer 3: Direct Overrides      Hardcoded values or fallback chains in component CSS
```

**Layer 1** — ~22 atomic values per theme. Set in theme-specific CSS files on `body[data-theme="<id>"]`.

**Layer 2** — ~110 component tokens. Most are auto-mapped from Layer 1 in `_base.css`. Some are overridden per-theme when they need different values.

**Layer 3** — Component CSS with `var(--token, fallback)`. Ensures components work even without any theme imported.

### CSS Load Order

```
_base.css    ->  Maps Layer 1 to Layer 2 on `body`
default.css  ->  Sets Layer 1 on `:root`, Layer 2 overrides
terminal.css ->  Sets Layer 1 on `body[data-theme="terminal"]`, Layer 2 overrides
```

**Import order matters.** `_base.css` must come first.

### Specificity Rule

`_base.css` uses the `body` selector, which is more specific than `:root` (used by `default.css`). This means:

- Tokens auto-mapped in `_base.css` will override values set on `:root`
- **Do not** auto-map tokens in `_base.css` if individual themes need different values
- Example: `--hero-headline-color` is set per-theme (not in `_base.css`) because the hero has a dark background in the default theme but a different background in terminal mode

### Theme Activation

```ts
document.body.dataset.theme = 'terminal';  // Activates terminal.css rules
delete document.body.dataset.theme;         // Reverts to default
```

The `<alleato-theme-picker>` emits `theme-change` events — the consumer is responsible for applying the theme to `<body>`.

### Available Themes

| Theme | ID | Selector | Character |
|-------|-----|----------|-----------|
| Default | (none) | `:root` | Modern royal purple, warm neutrals |
| Terminal | `terminal` | `body[data-theme="terminal"]` | Green-on-black CRT, JetBrains Mono |
| Broadsheet | `broadsheet` | `body[data-theme="broadsheet"]` | 1900s formal, dark red, thin rules |
| Tabloid | `tabloid` | `body[data-theme="tabloid"]` | 1920s bold, red/black/yellow, heavy borders |
| Gazette | `gazette` | `body[data-theme="gazette"]` | 1940s ornamental, sepia, gold double-rules |

### Token Naming Convention

| Suffix | Usage | Example |
|--------|-------|---------|
| `-bg` | Background color | `--card-bg`, `--form-bg` |
| `-color` | Text/foreground | `--card-title-color`, `--nav-logo-color` |
| `-border` | Border shorthand | `--card-border`, `--form-input-border` |
| `-radius` | Border radius | `--card-radius`, `--form-input-radius` |
| `-shadow` | Box shadow | `--form-focus-shadow` |
| `-hover-*` | Hover state | `--card-hover-shadow` |
| `-focus-*` | Focus state | `--form-focus-shadow` |

---

## Shared Styles

**`src/styles/buttons.css`** — `.btn`, `.btn-primary`, `.btn-secondary` classes using `--btn-*` tokens. Theme-agnostic.

**`src/styles/animations.css`** — `[data-animate]` fade-up on scroll (via `IntersectionObserver` adding `.animate-visible`). Includes `@keyframes boot-flicker` for terminal mode and `prefers-reduced-motion` media query.

Consumers import these as CSS:
```ts
import '@alleato/ui/styles/buttons.css';
import '@alleato/ui/styles/animations.css';
```

---

## Build Pipeline

### Build Steps

1. **tsup** compiles TypeScript to ESM (`.js`) + CJS (`.cjs`) with declarations (`.d.ts`)
2. **copy-css** copies `src/themes/*.css` and `src/styles/*.css` to `dist/`

CSS is not processed by tsup — it's copied as-is so consumers import plain CSS files.

### Export Map

```
@alleato/ui                          ->  dist/index.js (barrel + registerAll)
@alleato/ui/components/<name>        ->  dist/components/<name>.js (individual)
@alleato/ui/themes/<name>.css        ->  dist/themes/<name>.css
@alleato/ui/styles/<name>.css        ->  dist/styles/<name>.css
```

`sideEffects: ["**/*.css"]` ensures CSS imports survive tree-shaking.

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run build` | tsup + copy-css |
| `npm run dev` | Vite dev server (port 3000) |
| `npm run lint` | `tsc --noEmit` |
| `npm run prepare` | Runs build (npm install hook) |

---

## Assumptions

- **Browser-only**: Components use DOM APIs (`customElements`, `shadowRoot`, `ResizeObserver`). No SSR support.
- **Modern browsers**: Targets ES2020+. No polyfills for Custom Elements v1, Shadow DOM, or CSS custom properties.
- **Consumer provides fonts**: Font families are referenced via CSS custom properties (`--font-heading`, `--font-body`, `--font-mono`). The consumer's page must load the actual font files.
- **Consumer applies themes**: `<alleato-theme-picker>` is pure UI. The consumer listens for `theme-change` events and sets `body.dataset.theme`.
- **xterm.js is external**: `<alleato-terminal-embed>` has no xterm dependency. The consumer provides xterm (typically via `@alleato/shell`) and opens it into the element's light DOM so globally-loaded `xterm.css` can style it.

## Tradeoffs

| Decision | Benefit | Cost |
|----------|---------|------|
| Shadow DOM for all components | Full style encapsulation | Can't style internals with global CSS; fonts need custom properties |
| Inline SVG icons in AlleatoIcon | No HTTP requests, no external assets | Adding icons requires code changes, increases bundle size |
| CSS custom properties for theming | Native, no JS runtime cost, crosses Shadow DOM | Verbose token definitions; requires discipline with naming |
| No framework dependency | Works everywhere (React, Vue, Astro, vanilla) | No reactive data binding; manual DOM updates |
| `_base.css` auto-mapping on `body` | Single source of truth for most tokens | Specificity trap — `body` beats `:root`, some tokens can't be auto-mapped |
| Dynamic imports in `registerAll()` | Non-blocking registration | Slight delay before components upgrade; flash of undefined elements |
| Three-layer token system | Flexible — themes only define Layer 1, components work without themes | Complexity; easy to put a token in the wrong layer |

## Maintenance

### Adding a New Component

1. Create `src/components/my-component.ts` extending `HTMLElement` (or `CardBase` for cards)
2. Export the class and a `register()` function
3. Add exports to `src/index.ts` (named export + register alias + `registerAll()` entry)
4. Add entry to `tsup.config.ts`
5. Define Layer 2 tokens in `themes/default.css` and `themes/terminal.css`
6. Add a demo section in `demo/index.html`
7. Update `.claude/skills/alleato-ui/api-reference.md`

### Adding a New Theme

1. Create `src/themes/my-theme.css` with Layer 1 primitives on `body[data-theme="my-theme"]`
2. Add any Layer 2 overrides needed for components that differ from `_base.css` defaults
3. Add export to `package.json` exports map
4. Consumer imports the CSS and sets `document.body.dataset.theme = 'my-theme'`

### Adding a New Icon

Add an SVG string entry to the `ICONS` record in `src/components/alleato-icon.ts`. Use 24x24 viewBox, `currentColor` for fill/stroke.

### Changing Component Styles

Edit the `STYLES` constant in the component file. Always use CSS custom properties with fallbacks so the component works without any theme imported:

```css
:host {
  background: var(--card-bg, #f8f7f4);
}
```

### Shadow DOM Gotchas

- Scope CSS resets to HTML elements only (not `*`) — universal resets inside Shadow DOM break host page styles
- Use CSS custom properties for fonts — they cross Shadow DOM, `font-family` inheritance doesn't
- `::slotted()` only styles direct slotted children, not their descendants
- After rebuilding this package: consumers should `rm -rf node_modules/.vite` and restart their dev server

---

## Accessibility

- Semantic HTML: `<nav>`, `<button>`, `<label>`, `<form>` inside Shadow DOM
- ARIA: `role="dialog"`, `aria-modal`, `aria-expanded`, `aria-haspopup="listbox"`
- Focus management: dialog focus trapping (Tab cycles between actions), Escape closes dialogs/maximized windows
- Keyboard navigation: ThemePicker supports arrow keys/Enter/Escape, NavBar hamburger is keyboard-accessible
- Reduced motion: `@media (prefers-reduced-motion: reduce)` disables scroll animations

## Performance

- **Lazy registration**: `registerAll()` uses dynamic imports (non-blocking)
- **Inline SVG**: No HTTP requests for icons
- **CSS custom properties**: Theme switching is pure CSS — no JS recomputation
- **Tree-shakeable**: Unused components excluded via subpath imports
- **No external runtime deps**: Zero additional JS to download
