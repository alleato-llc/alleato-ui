import { CardBase } from './card-base';

const STYLES = `
  .card-inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--card-gap, 1.25rem);
    height: 100%;
  }

  .icon-area {
    margin-bottom: 0;
  }

  .content {
    flex: 1;
    min-width: 0;
  }

  .card-type {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--card-type-color, inherit);
    margin-bottom: 0.25rem;
  }

  .card-title {
    margin-bottom: 0.25rem;
  }

  .card-description {
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .arrow {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--card-arrow-color, inherit);
    opacity: 0.5;
    transition: all 0.2s ease;
  }

  :host(:hover) .arrow {
    opacity: 1;
    transform: translate(2px, -2px);
  }
`;

const TEMPLATE = `
  <div class="card-inner">
    <div class="icon-area"></div>
    <div class="content">
      <span class="card-type"></span>
      <h3 class="card-title"></h3>
      <p class="card-description"></p>
    </div>
    <div class="arrow">
      <alleato-icon name="arrow"></alleato-icon>
    </div>
  </div>
`;

export class ShowcaseCard extends CardBase {
  static get observedAttributes() {
    return ['icon', 'heading', 'description', 'type'];
  }

  constructor() {
    super(STYLES, TEMPLATE);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  private render() {
    const shadow = this.shadowRoot!;
    const icon = this.getAttribute('icon') || '';
    shadow.querySelector('.icon-area')!.innerHTML = icon
      ? `<alleato-icon name="${icon}"></alleato-icon>` : '';
    shadow.querySelector('.card-title')!.textContent = this.getAttribute('heading') || '';
    shadow.querySelector('.card-description')!.textContent = this.getAttribute('description') || '';
    shadow.querySelector('.card-type')!.textContent = this.getAttribute('type') || '';
  }
}

export function register() {
  if (!customElements.get('alleato-showcase-card')) {
    customElements.define('alleato-showcase-card', ShowcaseCard);
  }
}
