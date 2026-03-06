import '../src/themes/default.css';
import '../src/themes/terminal.css';
import '../src/styles/buttons.css';
import '../src/styles/animations.css';

import { registerAll } from '../src/index';
import type { NavBar } from '../src/components/nav-bar';
import type { ServiceCard } from '../src/components/service-card';

registerAll();

// Set up nav items via JS property
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('demo-nav') as NavBar;
  if (nav) {
    nav.items = [
      { label: 'Icons', href: '#' },
      { label: 'Cards', href: '#' },
      { label: 'Form', href: '#' },
      { label: 'Contact', href: '#', cta: true },
    ];
  }

  // Set highlights on service cards via JS property
  const service1 = document.getElementById('service-1') as ServiceCard;
  if (service1) {
    service1.highlights = ['Microservices', 'API Design', 'Cloud Native'];
  }

  const service2 = document.getElementById('service-2') as ServiceCard;
  if (service2) {
    service2.highlights = ['GitHub Actions', 'Jenkins', 'ArgoCD'];
  }

  const service3 = document.getElementById('service-3') as ServiceCard;
  if (service3) {
    service3.highlights = ['Code Review', 'Mentorship', 'Best Practices'];
  }

  // Form submit handler
  const form = document.getElementById('demo-form');
  form?.addEventListener('form-submit', (e) => {
    console.log('Form submitted:', (e as CustomEvent).detail);
  });
});

// Theme toggle
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('terminal-mode');
  const btn = document.getElementById('theme-toggle')!;
  btn.textContent = document.body.classList.contains('terminal-mode')
    ? 'Switch to Default'
    : 'Toggle Terminal Mode';
});
