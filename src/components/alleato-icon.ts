const ICONS: Record<string, string> = {
  app: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M9 9h6M9 13h6M9 17h4"/>
  </svg>`,
  cicd: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
    <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>`,
  culture: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="8" r="4"/>
    <path d="M6 20c0-3 2.5-5 6-5s6 2 6 5"/>
    <path d="M16 4c1 0.5 2 1.5 2 3s-1 2.5-2 3"/>
    <path d="M18 11c2 1 3 2.5 3 4"/>
  </svg>`,
  collaboration: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>`,
  people: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>`,
  adapt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M21 12a9 9 0 1 1-9-9"/>
    <path d="M21 3v6h-6"/>
    <path d="M21 3l-9 9"/>
  </svg>`,
  software: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <path d="M8 21h8"/>
    <path d="M12 17v4"/>
    <path d="M7 8l3 2-3 2"/>
    <path d="M13 12h4"/>
  </svg>`,
  resume: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>`,
  github: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>`,
  books: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>`,
  blog: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M7 17L17 7M17 7H7M17 7V17"/>
  </svg>`,
  logo: `<svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">
    <circle cx="8" cy="12" r="4.5"/>
    <ellipse cx="8" cy="23" rx="5" ry="6"/>
    <circle cx="24" cy="8" r="5.5"/>
    <ellipse cx="24" cy="20" rx="6" ry="7"/>
    <circle cx="40" cy="12" r="4.5"/>
    <ellipse cx="40" cy="23" rx="5" ry="6"/>
    <ellipse cx="24" cy="30" rx="22" ry="8"/>
    <ellipse cx="24" cy="30" rx="5" ry="2" opacity="0.6"/>
    <path d="M20 26 Q19 22 21 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>
    <path d="M24 25 Q25 20 23 15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
    <path d="M28 26 Q29 22 27 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>
  </svg>`,
  terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <path d="M7 8l3 2-3 2"/>
    <path d="M13 12h4"/>
  </svg>`,
};

const STYLES = `
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--icon-size, 24px);
    height: var(--icon-size, 24px);
    color: inherit;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

export class AlleatoIcon extends HTMLElement {
  static get observedAttributes() {
    return ['name'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `<style>${STYLES}</style><span class="icon"></span>`;
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const container = this.shadowRoot!.querySelector('.icon');
    if (!container) return;
    const name = this.getAttribute('name') || '';
    container.innerHTML = ICONS[name] || '';
  }
}

export function register() {
  if (!customElements.get('alleato-icon')) {
    customElements.define('alleato-icon', AlleatoIcon);
  }
}
