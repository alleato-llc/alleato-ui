const STYLES = `
  :host {
    display: block;
    text-align: center;
    max-width: var(--section-header-max-width, 700px);
    margin: 0 auto var(--section-header-margin-bottom, 4rem);
  }

  h2 {
    font-size: var(--section-header-title-size, clamp(2rem, 4vw, 3rem));
    font-family: var(--font-heading, inherit);
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 1rem;
    color: var(--section-header-title-color, inherit);
  }

  p {
    font-size: var(--section-header-subtitle-size, 1.1rem);
    color: var(--section-header-subtitle-color, inherit);
    line-height: 1.7;
    margin: 0;
  }

  p:empty {
    display: none;
  }
`;

const TEMPLATE = `
  <h2></h2>
  <p></p>
`;

export class SectionHeader extends HTMLElement {
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
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  private render() {
    this.shadowRoot!.querySelector('h2')!.textContent = this.getAttribute('heading') || '';
    this.shadowRoot!.querySelector('p')!.textContent = this.getAttribute('subtitle') || '';
  }
}

export function register() {
  if (!customElements.get('alleato-section-header')) {
    customElements.define('alleato-section-header', SectionHeader);
  }
}
