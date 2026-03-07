import { CardBase } from './card-base';

const STYLES = `
  .icon-area {
    display: var(--card-icon-display, flex);
    background: var(--card-icon-bg, transparent);
  }

  .badge {
    display: var(--card-badge-display, inline);
    position: absolute;
    top: var(--card-padding, 1.5rem);
    right: var(--card-padding, 1.5rem);
    font-family: var(--font-mono, monospace);
    font-size: 0.85rem;
    color: var(--card-badge-color, inherit);
    opacity: var(--card-badge-opacity, 0.7);
  }
`;

const TEMPLATE = `
  <span class="badge"></span>
  <div class="icon-area"></div>
  <h3 class="card-title"></h3>
  <p class="card-description"></p>
`;

export class ApproachCard extends CardBase {
  static get observedAttributes() {
    return ['icon', 'heading', 'description', 'badge'];
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
    shadow.querySelector('.badge')!.textContent = this.getAttribute('badge') || '';
  }
}

export function register() {
  if (!customElements.get('alleato-approach-card')) {
    customElements.define('alleato-approach-card', ApproachCard);
  }
}
