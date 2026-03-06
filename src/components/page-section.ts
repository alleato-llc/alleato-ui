const STYLES = `
  :host {
    display: block;
    position: relative;
    padding: var(--section-padding, var(--spacing-section, 6rem)) 0;
    background: var(--section-bg, transparent);
    color: var(--section-color, inherit);
  }

  .container {
    width: 100%;
    max-width: var(--container-width, 1200px);
    margin: 0 auto;
    padding: 0 2rem;
  }

  @media (max-width: 1024px) {
    :host {
      padding: var(--section-padding-mobile, var(--spacing-section-mobile, 4rem)) 0;
    }
  }
`;

const TEMPLATE = `
  <div class="container">
    <slot></slot>
  </div>
`;

export class PageSection extends HTMLElement {
  static get observedAttributes() {
    return ['heading', 'subtitle'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const el = document.createElement('template');
    el.innerHTML = `<style>${STYLES}</style>${TEMPLATE}`;
    this.shadowRoot!.appendChild(el.content.cloneNode(true));
  }

  connectedCallback() {
    this.setAttribute('data-animate', '');
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  private render() {
    const container = this.shadowRoot!.querySelector('.container')!;
    const existing = container.querySelector('alleato-section-header');
    const heading = this.getAttribute('heading');

    if (heading) {
      if (!existing) {
        const header = document.createElement('alleato-section-header');
        container.insertBefore(header, container.firstChild);
      }
      const headerEl = container.querySelector('alleato-section-header')!;
      headerEl.setAttribute('heading', heading);
      const subtitle = this.getAttribute('subtitle');
      if (subtitle) {
        headerEl.setAttribute('subtitle', subtitle);
      } else {
        headerEl.removeAttribute('subtitle');
      }
    } else if (existing) {
      existing.remove();
    }
  }
}

export function register() {
  if (!customElements.get('alleato-page-section')) {
    customElements.define('alleato-page-section', PageSection);
  }
}
