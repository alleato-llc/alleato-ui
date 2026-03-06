export const BASE_STYLES = `
  :host {
    display: block;
    position: relative;
    padding: var(--card-padding, 1.5rem);
    background: var(--card-bg, #f8f7f4);
    border: var(--card-border, 1px solid #e8e4df);
    border-radius: var(--card-radius, 12px);
    transition: var(--card-transition, all 0.3s ease);
    overflow: hidden;
    box-sizing: border-box;
  }

  :host([hoverable]:hover),
  :host([hoverable]:focus-within) {
    transform: var(--card-hover-transform, translateY(-4px));
    box-shadow: var(--card-hover-shadow, 0 4px 12px rgba(0, 0, 0, 0.1));
    border-color: var(--card-hover-border-color, inherit);
    background: var(--card-hover-bg, var(--card-bg, #f8f7f4));
  }

  .icon-area {
    width: var(--card-icon-size, 48px);
    height: var(--card-icon-size, 48px);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--card-icon-bg, #6C3BAA);
    color: var(--card-icon-color, white);
    border-radius: var(--card-icon-radius, 8px);
    flex-shrink: 0;
    margin-bottom: var(--card-icon-margin, 1.25rem);
  }

  .icon-area alleato-icon {
    --icon-size: var(--card-icon-svg-size, 24px);
  }

  .icon-area:empty {
    display: none;
  }

  .card-title {
    font-size: var(--card-title-size, 1.25rem);
    font-family: var(--font-heading, inherit);
    font-weight: 600;
    color: var(--card-title-color, inherit);
    margin: 0 0 0.75rem;
  }

  .card-description {
    color: var(--card-description-color, inherit);
    line-height: 1.6;
    font-size: 0.95rem;
    margin: 0;
  }
`;

export class CardBase extends HTMLElement {
  constructor(styles: string, template: string) {
    super();
    this.attachShadow({ mode: 'open' });
    const el = document.createElement('template');
    el.innerHTML = `<style>${BASE_STYLES}${styles}</style>${template}`;
    this.shadowRoot!.appendChild(el.content.cloneNode(true));
  }
}
