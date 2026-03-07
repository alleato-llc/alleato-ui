import '../src/themes/_base.css';
import '../src/themes/default.css';
import '../src/themes/terminal.css';
import '../src/themes/newspaper-broadsheet.css';
import '../src/themes/newspaper-tabloid.css';
import '../src/themes/newspaper-gazette.css';
import '../src/styles/buttons.css';
import '../src/styles/animations.css';

import { registerAll } from '../src/index';
import type { NavBar } from '../src/components/nav-bar';
import type { ServiceCard } from '../src/components/service-card';
import type { ThemePicker } from '../src/components/theme-picker';

registerAll();

// Set up nav items via JS property
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('demo-nav') as NavBar;
  if (nav) {
    nav.items = [
      { label: 'Icons', href: '#icons' },
      { label: 'Cards', href: '#cards' },
      { label: 'Form', href: '#form' },
      { label: 'Contact', href: '#form', cta: true },
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

  // Configure theme picker
  const picker = document.getElementById('demo-theme-picker') as ThemePicker;
  if (picker) {
    picker.themes = [
      { id: '', label: 'Default', icon: 'sun' },
      { id: 'terminal', label: 'Terminal', icon: 'terminal' },
      { id: 'newspaper-broadsheet', label: 'Broadsheet', icon: 'newspaper' },
      { id: 'newspaper-tabloid', label: 'Tabloid', icon: 'newspaper' },
      { id: 'newspaper-gazette', label: 'Gazette', icon: 'newspaper' },
    ];

    picker.addEventListener('theme-change', (e) => {
      const { theme, previous } = (e as CustomEvent).detail;
      console.log(`Theme changed: ${previous || 'default'} → ${theme || 'default'}`);

      // Apply theme
      if (theme) {
        document.body.dataset.theme = theme;
      } else {
        delete document.body.dataset.theme;
      }

      // Backwards compat: toggle terminal-mode class
      if (previous === 'terminal') document.body.classList.remove('terminal-mode');
      if (theme === 'terminal') document.body.classList.add('terminal-mode');
    });

    // Restore saved theme on load
    const saved = localStorage.getItem('alleato-demo-theme');
    if (saved) {
      picker.current = saved;
      if (saved) document.body.dataset.theme = saved;
      if (saved === 'terminal') document.body.classList.add('terminal-mode');
    }
  }
});

// Terminal window demo
document.getElementById('restore-window')?.addEventListener('click', () => {
  const win = document.getElementById('demo-terminal-window') as import('../src/components/terminal-window').TerminalWindow;
  win?.restore();
});

// Terminal intro demo
document.getElementById('show-intro')?.addEventListener('click', async () => {
  const intro = document.getElementById('demo-intro') as import('../src/components/terminal-intro').TerminalIntro;
  const result = await intro?.prompt();
  console.log('Intro result:', result);
});
