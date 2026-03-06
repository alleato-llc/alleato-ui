# @alleato/ui

Reusable Web Components for Alleato projects. Framework-agnostic, themeable, and accessible.

## Install

```bash
npm install @alleato/ui
```

## Quick Start

```ts
import { registerAll } from '@alleato/ui';
import '@alleato/ui/themes/default.css';

registerAll();
```

```html
<alleato-service-card
  icon="app"
  heading="Platform Design"
  description="Building scalable systems."
  hoverable
></alleato-service-card>
```

## Components

| Tag | Description | Key Attributes |
|-----|-------------|----------------|
| `<alleato-icon>` | SVG icon (13 built-in) | `name` |
| `<alleato-section-header>` | Section heading + subtitle | `heading`, `subtitle` |
| `<alleato-page-section>` | Section wrapper with container | `heading`, `subtitle` |
| `<alleato-nav-bar>` | Fixed navigation bar | `brand`, `logo`; `.items` (JS) |
| `<alleato-site-footer>` | Page footer | `brand`, `logo`, `tagline`, `location`, `badge`, `copyright` |
| `<alleato-service-card>` | Service/focus area card | `icon`, `heading`, `description`; `.highlights` (JS) |
| `<alleato-approach-card>` | Philosophy/approach card | `icon`, `heading`, `description`, `badge` |
| `<alleato-showcase-card>` | Resource/project card | `icon`, `heading`, `description`, `type` |
| `<alleato-form-field>` | Form input/textarea | `label`, `name`, `type`, `placeholder`, `required`, `rows` |
| `<alleato-form-container>` | Form wrapper | `submit-text`, `success-message`; emits `form-submit` |

## Theming

Components use CSS custom properties. Import a theme to set defaults:

```ts
import '@alleato/ui/themes/default.css';    // Light theme
import '@alleato/ui/themes/terminal.css';   // Terminal mode (activated by body.terminal-mode)
```

To switch to terminal mode:

```ts
document.body.classList.add('terminal-mode');
```

### Custom Themes

Override CSS custom properties in your own stylesheet. See `src/themes/default.css` for the full token list.

## Individual Imports

Import only what you need for tree-shaking:

```ts
import { ServiceCard, register } from '@alleato/ui/components/service-card';
register();
```

## CSS Utilities

```ts
import '@alleato/ui/styles/buttons.css';     // .btn, .btn-primary, .btn-secondary
import '@alleato/ui/styles/animations.css';  // [data-animate] scroll animations
```

## Demo

```bash
npm run dev
```

Opens a demo page at http://localhost:3000 with all components and a theme toggle.

## Development

```bash
npm install
npm run dev      # Demo server
npm run build    # Build for distribution
npm run lint     # Type check
```

## License

MIT - Alleato LLC
