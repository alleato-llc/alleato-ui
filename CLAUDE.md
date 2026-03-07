# Claude Code Context

## Project Overview

`@alleato/ui` is a reusable Web Component library for Alleato projects. Framework-agnostic, built with vanilla TypeScript, themeable via CSS custom properties.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Demo server at http://localhost:3000
npm run build    # Build for distribution (tsup + CSS copy)
npm run lint     # TypeScript type checking
```

## Directory Structure

```
src/
  components/     # Web Components (16 files)
  styles/         # Shared CSS (buttons, animations)
  themes/         # Theme CSS (_base, default, terminal, 3 newspaper themes)
  index.ts        # Barrel export + registerAll()
demo/
  index.html      # Showcase page
  main.ts         # Demo imports and setup
```

## Architecture

- **CardBase** (`card-base.ts`): Base class for card components. Provides shared Shadow DOM styles (`:host`, `.icon-area`, `.card-title`, `.card-description`).
- **Card hierarchy**: `ServiceCard`, `ApproachCard`, `ShowcaseCard` all extend `CardBase`.
- **Standalone components**: `AlleatoIcon`, `SectionHeader`, `PageSection`, `NavBar`, `SiteFooter`, `FormField`, `FormContainer`, `TerminalWindow`, `TerminalIntro`, `TerminalEmbed`, `ThemePicker`.
- **`TerminalEmbed`**: Shadow DOM container for xterm.js with ResizeObserver. Emits `terminal-resize` events. Has NO xterm dependency — consumer opens terminal into the element's light DOM (not `embed.container`) so globally-loaded `xterm.css` can style it.
- Every component has a `register()` function that calls `customElements.define()` with a guard.
- `index.ts` exports all classes + individual `register` functions + `registerAll()`.

## Theme System

Three-layer CSS variable system:
- **`themes/_base.css`**: Maps Layer 1 primitives (`--theme-*`) to Layer 2 component tokens on `body`. Always import first.
- **`themes/default.css`**: Layer 1 primitives on `:root` + Layer 2 overrides for hero, nav, footer, etc.
- **`themes/terminal.css`**: Terminal theme on `body[data-theme="terminal"]`
- **`themes/newspaper-*.css`**: Three newspaper themes (broadsheet, tabloid, gazette)

Components reference tokens like `var(--card-bg, #f8f7f4)` with fallbacks, so they work without any theme imported.

**Important**: `_base.css` uses `body` selector which is more specific than `:root`. Don't auto-map tokens in `_base.css` if individual themes need different values (e.g. `--hero-headline-color` is set per-theme because the hero has a dark background in the default theme).

## Adding a New Component

1. Create `src/components/my-component.ts`
2. Export the class and a `register()` function
3. Add exports to `src/index.ts` (named export + register alias)
4. Add to `registerAll()` in `src/index.ts`
5. Add entry to `tsup.config.ts`
6. Add theme tokens to `themes/default.css` and `themes/terminal.css`
7. Add a demo section in `demo/index.html`
8. Update `.claude/skills/alleato-ui/api-reference.md`

## Common Tasks

### Changing a component's default styles
Edit the `STYLES` const in the component file. Use CSS custom properties with fallbacks.

### Adding a new icon
Add an entry to the `ICONS` record in `src/components/alleato-icon.ts`.

### Adding theme tokens
Add to `:root` in `themes/default.css` and `body[data-theme="terminal"]` in `themes/terminal.css`. If the token should auto-map from a Layer 1 primitive, add the mapping in `themes/_base.css`.
