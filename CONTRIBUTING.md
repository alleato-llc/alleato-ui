# Contributing to @alleato/ui

## Setup

```bash
git clone <repo-url>
cd alleato-ui
npm install
npm run dev
```

## Development

- `npm run dev` starts the demo server at http://localhost:3000
- `npm run build` builds the package
- `npm run lint` runs TypeScript type checking

## Adding a New Component

Every new component must:

1. Be in `src/components/` as a single `.ts` file
2. Export the class and a `register()` function
3. Use `customElements.define()` with a guard (`if (!customElements.get(...)`)
4. Be added to `src/index.ts` (exports + `registerAll()`)
5. Be added as an entry in `tsup.config.ts`
6. Have theme tokens in both `themes/default.css` and `themes/terminal.css`
7. Have a demo section in `demo/index.html`
8. Be documented in `.claude/skills/alleato-ui/api-reference.md`

## Code Style

- Match existing patterns (Shadow DOM, CSS custom properties with fallbacks)
- Card components should extend `CardBase`
- Use `var(--token-name, fallback)` for all visual properties
- Keep components self-contained with inline styles in template literals

## Pull Requests

- One feature/fix per PR
- Ensure `npm run build` and `npm run lint` pass
- Update demo and documentation as needed
