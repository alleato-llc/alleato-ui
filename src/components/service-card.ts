import { CardBase } from './card-base';

const STYLES = `
  :host {
    flex-direction: var(--card-layout, column);
  }

  .icon-area {
    display: var(--card-icon-display, flex);
  }

  :host::before {
    content: '';
    position: absolute;
    top: 0;
    left: var(--card-padding, 1.5rem);
    right: var(--card-padding, 1.5rem);
    height: var(--card-accent-height, 3px);
    background: var(--card-accent-color, currentColor);
    border-radius: 0 0 2px 2px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  :host(:hover)::before,
  :host(:focus-within)::before {
    opacity: 1;
  }

  .highlights {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0;
    margin: 1.5rem 0 0;
  }

  .highlights li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    color: var(--card-highlight-color, inherit);
  }

  .highlights li::before {
    content: '';
    width: 6px;
    height: 6px;
    background: var(--card-highlight-dot, currentColor);
    border-radius: var(--card-highlight-dot-radius, 50%);
    flex-shrink: 0;
  }
`;

const TEMPLATE = `
  <div class="icon-area"></div>
  <h3 class="card-title"></h3>
  <p class="card-description"></p>
  <ul class="highlights"></ul>
`;

export class ServiceCard extends CardBase {
  static get observedAttributes() {
    return ['icon', 'heading', 'description'];
  }

  private _highlights: string[] = [];

  get highlights(): string[] {
    return this._highlights;
  }

  set highlights(value: string[]) {
    this._highlights = value;
    if (this.isConnected) this.renderHighlights();
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
    this.renderHighlights();
  }

  private renderHighlights() {
    const list = this.shadowRoot!.querySelector('.highlights')!;
    list.innerHTML = this._highlights.map(h => `<li>${h}</li>`).join('');
  }
}

export function register() {
  if (!customElements.get('alleato-service-card')) {
    customElements.define('alleato-service-card', ServiceCard);
  }
}
