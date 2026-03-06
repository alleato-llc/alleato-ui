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
  components/     # Web Components (11 files)
  styles/         # Shared CSS (buttons, animations)
  themes/         # Theme CSS (default, terminal)
  index.ts        # Barrel export + registerAll()
demo/
  index.html      # Showcase page
  main.ts         # Demo imports and setup
```

## Architecture

- **CardBase** (`card-base.ts`): Base class for card components. Provides shared Shadow DOM styles (`:host`, `.icon-area`, `.card-title`, `.card-description`).
- **Card hierarchy**: `ServiceCard`, `ApproachCard`, `ShowcaseCard` all extend `CardBase`.
- **Standalone components**: `AlleatoIcon`, `SectionHeader`, `PageSection`, `NavBar`, `SiteFooter`, `FormField`, `FormContainer`.
- Every component has a `register()` function that calls `customElements.define()` with a guard.
- `index.ts` exports all classes + individual `register` functions + `registerAll()`.

## Theme System

Two CSS files define token values consumed by components:
- `themes/default.css`: `:root` token definitions (cards, form, nav, footer, content)
- `themes/terminal.css`: `body.terminal-mode` overrides using `--term-*` variables

Components reference tokens like `var(--card-bg, #f8f7f4)` with fallbacks, so they work without any theme imported.

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
Add to `:root` in `themes/default.css` and `body.terminal-mode` in `themes/terminal.css`.
