# @alleato/ui API Reference

## `registerAll()`

Registers all 10 custom elements. Uses dynamic imports for lazy loading.

```ts
import { registerAll } from '@alleato/ui';
registerAll();
```

---

## `<alleato-icon>`

SVG icon component with 13 built-in icons.

**Attributes:**
| Attribute | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Icon name |

**Available icons:** `app`, `cicd`, `culture`, `collaboration`, `people`, `adapt`, `software`, `resume`, `github`, `books`, `blog`, `arrow`, `logo`, `terminal`

**CSS Custom Properties:**
| Property | Default | Description |
|----------|---------|-------------|
| `--icon-size` | `24px` | Icon dimensions |

---

## `<alleato-section-header>`

Section heading with optional subtitle.

**Attributes:**
| Attribute | Type | Description |
|-----------|------|-------------|
| `heading` | `string` | Heading text |
| `subtitle` | `string` | Subtitle text |

**CSS Custom Properties:**
| Property | Default | Description |
|----------|---------|-------------|
| `--section-header-max-width` | `700px` | Max width |
| `--section-header-margin-bottom` | `4rem` | Bottom margin |
| `--section-header-title-size` | `clamp(2rem, 4vw, 3rem)` | Title font size |
| `--section-header-title-color` | `inherit` | Title color |
| `--section-header-subtitle-size` | `1.1rem` | Subtitle font size |
| `--section-header-subtitle-color` | `inherit` | Subtitle color |

---

## `<alleato-page-section>`

Page section wrapper with container and optional auto-generated header.

**Attributes:**
| Attribute | Type | Description |
|-----------|------|-------------|
| `heading` | `string` | Auto-creates `<alleato-section-header>` |
| `subtitle` | `string` | Passed to section header |

**Slots:** Default slot for section content.

**CSS Custom Properties:**
| Property | Default | Description |
|----------|---------|-------------|
| `--section-padding` | `6rem` | Vertical padding |
| `--section-bg` | `transparent` | Background (set this to a `--section-bg-*` token) |
| `--section-color` | `inherit` | Text color |
| `--container-width` | `1200px` | Max container width |
| `--section-bg-default` | `var(--color-white)` | Semantic token: default section background |
| `--section-bg-alt` | `var(--color-light)` | Semantic token: alternate section background |
| `--section-bg-emphasis` | gradient | Semantic token: emphasis/dark section background |

**Behavior:** Automatically sets `data-animate` attribute for scroll animations.

**Usage:** Set `--section-bg` to a semantic token so themes control the actual color:
```css
.my-section { --section-bg: var(--section-bg-default); }
```

---

## `<alleato-nav-bar>`

Fixed navigation bar with logo, links, and mobile hamburger menu.

**Attributes:**
| Attribute | Type | Description |
|-----------|------|-------------|
| `brand` | `string` | Brand text |
| `logo` | `string` | Icon name for logo |

**JS Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `items` | `NavItem[]` | Navigation items |

```ts
interface NavItem {
  label: string;
  href: string;
  cta?: boolean;  // Renders as CTA button
}
```

**Slots:**
| Slot | Description |
|------|-------------|
| `toggle` | Content placed in toggle area (e.g., theme switch) |

**CSS Custom Properties:**
| Property | Default | Description |
|----------|---------|-------------|
| `--nav-bg` | `rgba(255, 252, 246, 0.95)` | Background |
| `--nav-backdrop` | `blur(10px)` | Backdrop filter |
| `--nav-border` | `1px solid #e8e4df` | Bottom border |
| `--nav-height` | `72px` | Bar height |
| `--nav-logo-color` | `inherit` | Logo text color |
| `--nav-logo-font` | `var(--font-heading)` | Logo font |
| `--nav-link-color` | `inherit` | Link color |
| `--nav-link-font` | `inherit` | Link font family |
| `--nav-link-hover-color` | `inherit` | Link hover color |
| `--nav-cta-bg` | `#6C3BAA` | CTA background |
| `--nav-cta-color` | `white` | CTA text color |
| `--nav-hamburger-color` | `currentColor` | Hamburger icon color |

---

## `<alleato-site-footer>`

Page footer with logo, tagline, location, and copyright.

**Attributes:**
| Attribute | Type | Description |
|-----------|------|-------------|
| `brand` | `string` | Brand name |
| `logo` | `string` | Icon name for logo |
| `tagline` | `string` | Tagline text |
| `location` | `string` | Location text |
| `badge` | `string` | Badge text (e.g., "LLC") |
| `copyright` | `string` | Copyright text |

**CSS Custom Properties:**
| Property | Default | Description |
|----------|---------|-------------|
| `--footer-bg` | `#1a1a1a` | Background |
| `--footer-color` | `white` | Text color |
| `--footer-logo-color` | `white` | Logo color |
| `--footer-tagline-color` | `#999` | Tagline color |
| `--footer-accent-bg` | gradient | Top accent bar |

---

## `<alleato-service-card>` (extends CardBase)

Card for displaying a service/focus area with icon, title, description, and highlights.

**Attributes:**
| Attribute | Type | Description |
|-----------|------|-------------|
| `icon` | `string` | Icon name |
| `heading` | `string` | Card title |
| `description` | `string` | Card description |
| `hoverable` | `boolean` | Enable hover effects |

**JS Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `highlights` | `string[]` | Bullet point highlights |

**CSS Custom Properties:** Inherits all `--card-*` tokens from CardBase, plus:
| Property | Default | Description |
|----------|---------|-------------|
| `--card-accent-height` | `3px` | Top accent bar height |
| `--card-accent-color` | `currentColor` | Accent bar color |
| `--card-highlight-color` | `inherit` | Highlight text color |
| `--card-highlight-dot` | `currentColor` | Bullet dot color |

---

## `<alleato-approach-card>` (extends CardBase)

Card for displaying a philosophy principle with badge number.

**Attributes:**
| Attribute | Type | Description |
|-----------|------|-------------|
| `icon` | `string` | Icon name |
| `heading` | `string` | Card title |
| `description` | `string` | Card description |
| `badge` | `string` | Badge text (e.g., "01") |
| `hoverable` | `boolean` | Enable hover effects |

**CSS Custom Properties:** Inherits `--card-*` tokens, plus:
| Property | Default | Description |
|----------|---------|-------------|
| `--card-badge-color` | `inherit` | Badge text color |
| `--card-badge-opacity` | `0.7` | Badge opacity |

---

## `<alleato-showcase-card>` (extends CardBase)

Card for displaying a resource/project with type label and arrow.

**Attributes:**
| Attribute | Type | Description |
|-----------|------|-------------|
| `icon` | `string` | Icon name |
| `heading` | `string` | Card title |
| `description` | `string` | Card description |
| `type` | `string` | Type label (e.g., "GitHub", "Blog") |
| `hoverable` | `boolean` | Enable hover effects |

**CSS Custom Properties:** Inherits `--card-*` tokens, plus:
| Property | Default | Description |
|----------|---------|-------------|
| `--card-type-color` | `inherit` | Type label color |
| `--card-arrow-color` | `inherit` | Arrow icon color |

---

## `<alleato-form-field>`

Form input or textarea with label.

**Attributes:**
| Attribute | Type | Description |
|-----------|------|-------------|
| `label` | `string` | Label text |
| `name` | `string` | Field name |
| `type` | `string` | Input type or "textarea" |
| `placeholder` | `string` | Placeholder text |
| `required` | `boolean` | Required validation |
| `rows` | `string` | Textarea rows (default: "5") |

**JS Properties:**
| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | Get/set field value |
| `validity` | `ValidityState` | Field validity state |

**Methods:**
| Method | Returns | Description |
|--------|---------|-------------|
| `reportValidity()` | `boolean` | Trigger native validation UI |

**CSS Custom Properties:**
| Property | Default | Description |
|----------|---------|-------------|
| `--form-label-color` | `#333` | Label color |
| `--form-input-bg` | `#fffcf6` | Input background |
| `--form-input-border` | `1px solid #e8e4df` | Input border |
| `--form-input-color` | `#333` | Input text color |
| `--form-focus-border-color` | `#6C3BAA` | Focus border |
| `--form-focus-shadow` | glow | Focus shadow |

---

## `<alleato-form-container>`

Form wrapper that handles validation and submission.

**Attributes:**
| Attribute | Type | Description |
|-----------|------|-------------|
| `action` | `string` | Form action URL |
| `method` | `string` | HTTP method (default: "POST") |
| `submit-text` | `string` | Submit button text |
| `success-message` | `string` | Success message text |

**Events:**
| Event | Detail | Description |
|-------|--------|-------------|
| `form-submit` | `Record<string, string>` | Fired on valid submission with field data |

**Slots:**
| Slot | Description |
|------|-------------|
| `row` | Fields displayed in a grid row |
| default | Fields displayed full-width |

**CSS Custom Properties:**
| Property | Default | Description |
|----------|---------|-------------|
| `--form-bg` | `#fffcf6` | Form background |
| `--form-border` | `1px solid #e8e4df` | Form border |
| `--form-radius` | `12px` | Border radius |
| `--form-submit-bg` | gradient | Submit button background |
| `--form-submit-color` | `#1a1a1a` | Submit button text |

---

## CSS Exports

| Import Path | Description |
|-------------|-------------|
| `@alleato/ui/themes/default.css` | Default theme tokens (`:root`) |
| `@alleato/ui/themes/terminal.css` | Terminal theme (`body.terminal-mode`) |
| `@alleato/ui/styles/buttons.css` | `.btn`, `.btn-primary`, `.btn-secondary` |
| `@alleato/ui/styles/animations.css` | `[data-animate]` scroll animations |

---

## CardBase CSS Custom Properties

Shared by all card components:

| Property | Default | Description |
|----------|---------|-------------|
| `--card-padding` | `1.5rem` | Inner padding |
| `--card-bg` | `#f8f7f4` | Background |
| `--card-border` | `1px solid #e8e4df` | Border |
| `--card-radius` | `12px` | Border radius |
| `--card-transition` | `all 0.3s ease` | Transition |
| `--card-hover-transform` | `translateY(-4px)` | Hover transform |
| `--card-hover-shadow` | shadow | Hover box shadow |
| `--card-hover-bg` | `var(--card-bg)` | Hover background |
| `--card-icon-size` | `48px` | Icon area size |
| `--card-icon-bg` | `#6C3BAA` | Icon background |
| `--card-icon-color` | `white` | Icon color |
| `--card-title-size` | `1.25rem` | Title font size |
| `--card-title-color` | `inherit` | Title color |
| `--card-description-color` | `inherit` | Description color |
