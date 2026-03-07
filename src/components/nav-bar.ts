const STYLES = `
  :host {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: var(--nav-bg, rgba(255, 252, 246, 0.95));
    backdrop-filter: var(--nav-backdrop, blur(10px));
    border-bottom: var(--nav-border, 1px solid #e8e4df);
    transition: background 0.3s ease;
  }

  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: var(--nav-height, 72px);
    max-width: var(--container-width, 1200px);
    margin: 0 auto;
    padding: 0 2rem;
    box-sizing: border-box;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: var(--nav-logo-font, var(--font-heading, inherit));
    font-weight: 600;
    font-size: var(--nav-logo-size, 1.25rem);
    color: var(--nav-logo-color, inherit);
    text-decoration: none;
  }

  .logo alleato-icon {
    --icon-size: var(--nav-logo-icon-size, 36px);
    color: var(--nav-logo-icon-color, var(--nav-logo-color, inherit));
  }

  nav {
    display: flex;
    align-items: center;
    gap: var(--nav-gap, 2rem);
  }

  .nav-link {
    font-size: 0.95rem;
    font-weight: 500;
    font-family: var(--nav-link-font, inherit);
    color: var(--nav-link-color, inherit);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .nav-link:hover {
    color: var(--nav-link-hover-color, inherit);
  }

  .nav-link[data-cta] {
    padding: 0.5rem 1.25rem;
    background: var(--nav-cta-bg, #6C3BAA);
    color: var(--nav-cta-color, white) !important;
    border-radius: var(--nav-cta-radius, 8px);
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .nav-link[data-cta]:hover {
    background: var(--nav-cta-hover-bg, #553090);
    transform: translateY(-1px);
  }

  .hamburger-btn {
    display: none;
    width: 40px;
    height: 40px;
    background: transparent;
    border: none;
    cursor: pointer;
    position: relative;
  }

  .hamburger-line,
  .hamburger-line::before,
  .hamburger-line::after {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--nav-hamburger-color, currentColor);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    transition: all 0.2s ease;
  }

  .hamburger-line {
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .hamburger-line::before {
    content: '';
    top: -7px;
  }

  .hamburger-line::after {
    content: '';
    top: 7px;
  }

  :host([menu-open]) .hamburger-line {
    background: transparent;
  }

  :host([menu-open]) .hamburger-line::before {
    top: 0;
    transform: translateX(-50%) rotate(45deg);
  }

  :host([menu-open]) .hamburger-line::after {
    top: 0;
    transform: translateX(-50%) rotate(-45deg);
  }

  @media (max-width: 768px) {
    nav {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      flex-direction: column;
      padding: 1rem 2rem 2rem;
      background: var(--nav-mobile-bg, var(--nav-bg, white));
      border-bottom: var(--nav-border, 1px solid #e8e4df);
      gap: 1rem;
    }

    :host([menu-open]) nav {
      display: flex;
    }

    .nav-link[data-cta] {
      width: fit-content;
    }

    .hamburger-btn {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .nav-inner {
      height: var(--nav-height-mobile, 64px);
    }

    .logo {
      font-size: 1.1rem;
    }
  }
`;

const TEMPLATE = `
  <div class="nav-inner">
    <a class="logo" href="/"></a>
    <nav><slot name="toggle"></slot></nav>
    <button class="hamburger-btn" aria-label="Toggle menu" aria-expanded="false">
      <span class="hamburger-line"></span>
    </button>
  </div>
`;

export interface NavItem {
  label: string;
  href: string;
  cta?: boolean;
}

export class NavBar extends HTMLElement {
  static get observedAttributes() {
    return ['brand', 'logo'];
  }

  private _items: NavItem[] = [];

  get items(): NavItem[] {
    return this._items;
  }

  set items(value: NavItem[]) {
    this._items = value;
    if (this.isConnected) this.renderItems();
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const el = document.createElement('template');
    el.innerHTML = `<style>${STYLES}</style>${TEMPLATE}`;
    this.shadowRoot!.appendChild(el.content.cloneNode(true));
  }

  connectedCallback() {
    this.render();
    this.shadowRoot!.querySelector('.hamburger-btn')!.addEventListener('click', () => {
      this.toggleMenu();
    });
    // Close menu when a nav link is clicked
    this.shadowRoot!.querySelector('nav')!.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).classList.contains('nav-link')) {
        this.removeAttribute('menu-open');
        this.shadowRoot!.querySelector('.hamburger-btn')!.setAttribute('aria-expanded', 'false');
      }
    });
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  private toggleMenu() {
    const btn = this.shadowRoot!.querySelector('.hamburger-btn')!;
    const isOpen = this.hasAttribute('menu-open');
    if (isOpen) {
      this.removeAttribute('menu-open');
      btn.setAttribute('aria-expanded', 'false');
    } else {
      this.setAttribute('menu-open', '');
      btn.setAttribute('aria-expanded', 'true');
    }
  }

  private render() {
    const logoEl = this.shadowRoot!.querySelector('.logo')!;
    const logoIcon = this.getAttribute('logo') || '';
    const brand = this.getAttribute('brand') || '';
    logoEl.innerHTML = (logoIcon ? `<alleato-icon name="${logoIcon}"></alleato-icon>` : '')
      + `<span>${brand}</span>`;
    logoEl.setAttribute('aria-label', brand);
    this.renderItems();
  }

  private renderItems() {
    const nav = this.shadowRoot!.querySelector('nav')!;
    // Preserve the existing toggle slot
    const slot = nav.querySelector('slot[name="toggle"]');
    const links = this._items.map(item =>
      `<a class="nav-link" href="${item.href}"${item.cta ? ' data-cta' : ''}>${item.label}</a>`
    ).join('');
    // Build: links first, then the toggle slot
    nav.innerHTML = links;
    if (slot) {
      nav.appendChild(slot);
    } else {
      nav.insertAdjacentHTML('beforeend', '<slot name="toggle"></slot>');
    }
  }
}

export function register() {
  if (!customElements.get('alleato-nav-bar')) {
    customElements.define('alleato-nav-bar', NavBar);
  }
}
