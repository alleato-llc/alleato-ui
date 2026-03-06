---
name: alleato-ui
description: |
  Alleato UI Web Components library. Triggers on:
  - import from @alleato/ui
  - questions about alleato components, theming, or terminal mode
  - creating pages with alleato-* custom elements
---

# @alleato/ui

A reusable Web Component library for Alleato projects.

## Setup

```bash
npm install @alleato/ui
```

## Usage

```ts
import { registerAll } from '@alleato/ui';
import '@alleato/ui/themes/default.css';

registerAll();
```

For terminal mode, also import:
```ts
import '@alleato/ui/themes/terminal.css';
```

Activate with `document.body.classList.add('terminal-mode')`.

## Components

10 custom elements: `alleato-icon`, `alleato-section-header`, `alleato-page-section`, `alleato-nav-bar`, `alleato-site-footer`, `alleato-service-card`, `alleato-approach-card`, `alleato-showcase-card`, `alleato-form-field`, `alleato-form-container`.

## References

- See `api-reference.md` for full component API (attributes, properties, events, slots, CSS tokens).
- See `examples.md` for usage patterns per component.
