const STYLES = `
  :host {
    display: block;
    position: relative;
    background: var(--footer-bg, #1a1a1a);
    color: var(--footer-color, white);
    padding: var(--footer-padding, 4rem 0 2rem);
  }

  .footer-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
    max-width: var(--container-width, 1200px);
    margin: 0 auto;
    padding: 0 2rem;
  }

  .footer-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: var(--footer-logo-font, var(--font-heading, inherit));
    font-weight: 600;
    font-size: var(--footer-logo-size, 1.25rem);
    color: var(--footer-logo-color, white);
    text-decoration: none;
  }

  .footer-logo alleato-icon {
    --icon-size: var(--footer-logo-icon-size, 32px);
    color: var(--footer-logo-icon-color, inherit);
  }

  .tagline {
    color: var(--footer-tagline-color, #999);
    font-size: 0.95rem;
  }

  .tagline:empty {
    display: none;
  }

  .location {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--footer-location-color, #999);
    font-size: 0.9rem;
  }

  .badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: var(--footer-badge-bg, rgba(108, 59, 170, 0.2));
    color: var(--footer-badge-color, inherit);
    font-size: 0.8rem;
    font-weight: 500;
    border-radius: var(--footer-badge-radius, 4px);
  }

  .badge:empty {
    display: none;
  }

  .bottom {
    margin-top: 1rem;
    padding-top: 1.5rem;
    border-top: var(--footer-divider, 1px solid rgba(255, 255, 255, 0.1));
    width: 100%;
  }

  .copyright {
    font-size: 0.85rem;
    color: var(--footer-copyright-color, #999);
  }

  .accent-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: var(--footer-accent-height, 4px);
    background: var(--footer-accent-bg, linear-gradient(135deg, #C4A8E0, #E8C4A0));
  }

  .accent-bar:empty {
    display: none;
  }
`;

const TEMPLATE = `
  <div class="footer-inner">
    <div class="brand">
      <a class="footer-logo" href="/"></a>
      <p class="tagline"></p>
    </div>
    <div class="info">
      <p class="location">
        <span class="location-text"></span>
        <span class="badge"></span>
      </p>
    </div>
    <div class="bottom">
      <p class="copyright"></p>
    </div>
  </div>
  <div class="accent-bar"></div>
`;

export class SiteFooter extends HTMLElement {
  static get observedAttributes() {
    return ['brand', 'logo', 'tagline', 'location', 'badge', 'copyright'];
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
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  private render() {
    const shadow = this.shadowRoot!;
    const brand = this.getAttribute('brand') || '';
    const logoIcon = this.getAttribute('logo') || '';

    const logoEl = shadow.querySelector('.footer-logo')!;
    logoEl.innerHTML = (logoIcon ? `<alleato-icon name="${logoIcon}"></alleato-icon>` : '')
      + `<span>${brand}</span>`;

    shadow.querySelector('.tagline')!.textContent = this.getAttribute('tagline') || '';
    shadow.querySelector('.location-text')!.textContent = this.getAttribute('location') || '';
    shadow.querySelector('.badge')!.textContent = this.getAttribute('badge') || '';
    shadow.querySelector('.copyright')!.textContent = this.getAttribute('copyright') || '';
  }
}

export function register() {
  if (!customElements.get('alleato-site-footer')) {
    customElements.define('alleato-site-footer', SiteFooter);
  }
}
