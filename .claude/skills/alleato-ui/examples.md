# @alleato/ui Examples

## Minimal Setup

```html
<!doctype html>
<html>
<head>
  <script type="module">
    import { registerAll } from '@alleato/ui';
    import '@alleato/ui/themes/default.css';
    registerAll();
  </script>
</head>
<body>
  <alleato-icon name="logo"></alleato-icon>
</body>
</html>
```

## Icons

```html
<alleato-icon name="app"></alleato-icon>
<alleato-icon name="github" style="--icon-size: 48px; color: purple;"></alleato-icon>
```

## Section Header

```html
<alleato-section-header
  heading="Our Approach"
  subtitle="How we work with you"
></alleato-section-header>
```

## Page Section

```html
<alleato-page-section heading="Technologies" subtitle="What we use">
  <p>Content goes here via the default slot.</p>
</alleato-page-section>
```

## NavBar with JS Property Hydration

```html
<alleato-nav-bar id="nav" brand="Alleato" logo="logo">
  <div slot="toggle">
    <button>Theme</button>
  </div>
</alleato-nav-bar>

<script type="module">
  import { registerAll } from '@alleato/ui';
  registerAll();

  const nav = document.getElementById('nav');
  nav.items = [
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact', cta: true },
  ];
</script>
```

## Service Card with Highlights

```html
<alleato-service-card
  id="svc"
  icon="app"
  heading="Platform Design"
  description="Building scalable systems."
  hoverable
></alleato-service-card>

<script type="module">
  document.getElementById('svc').highlights = [
    'Microservices',
    'API Design',
    'Cloud Native',
  ];
</script>
```

## Approach Card

```html
<alleato-approach-card
  icon="collaboration"
  heading="Honest Dialogue"
  description="We speak plainly and listen deeply."
  badge="01"
  hoverable
></alleato-approach-card>
```

## Showcase Card

```html
<alleato-showcase-card
  icon="github"
  heading="alleato-ui"
  description="Our component library."
  type="Open Source"
  hoverable
></alleato-showcase-card>
```

## Form with Submit Handler

```html
<alleato-form-container
  id="contact"
  submit-text="Send Message"
  success-message="Thanks! We'll be in touch."
>
  <alleato-form-field slot="row" label="Name" name="name" required></alleato-form-field>
  <alleato-form-field slot="row" label="Email" name="email" type="email" required></alleato-form-field>
  <alleato-form-field label="Message" name="message" type="textarea" rows="5" required></alleato-form-field>
</alleato-form-container>

<script type="module">
  document.getElementById('contact').addEventListener('form-submit', (e) => {
    console.log('Form data:', e.detail);
    // { name: '...', email: '...', message: '...' }
  });
</script>
```

## Site Footer

```html
<alleato-site-footer
  brand="Alleato"
  logo="logo"
  tagline="Your engineering ally."
  location="New York, NY"
  badge="LLC"
  copyright="&copy; 2025 Alleato LLC"
></alleato-site-footer>
```

## Theme Switching

```ts
// Toggle terminal mode
document.body.classList.toggle('terminal-mode');
```

## Astro Integration

```astro
---
// In Layout.astro
import '@alleato/ui/themes/default.css';
import '@alleato/ui/themes/terminal.css';
import '@alleato/ui/styles/buttons.css';
import '@alleato/ui/styles/animations.css';
---

<!-- In a component -->
<alleato-page-section heading="Services" subtitle="What we do">
  <div class="card-grid">
    {items.map(item => (
      <alleato-service-card
        icon={item.icon}
        heading={item.title}
        description={item.description}
        hoverable
      />
    ))}
  </div>
</alleato-page-section>

<script>
  import { register } from '@alleato/ui/components/service-card';
  import { register as registerSection } from '@alleato/ui/components/page-section';
  register();
  registerSection();
</script>
```

## Dark Context (for dark backgrounds)

```html
<alleato-page-section class="dark-context" style="--section-bg: #1a1a2e;">
  <alleato-approach-card
    icon="people"
    heading="People First"
    description="Light text on dark backgrounds."
    badge="01"
    hoverable
  ></alleato-approach-card>
</alleato-page-section>
```
