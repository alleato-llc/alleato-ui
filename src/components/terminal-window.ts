const STYLES = `
  :host {
    display: block;
    position: relative;
  }

  :host(:not([active])) .titlebar {
    display: none;
  }

  :host([active]) {
    background: var(--tw-bg, #0d1117);
    border: var(--tw-border, 1px solid #1a3a1a);
    border-radius: var(--tw-border-radius, 8px 8px 0 0);
    margin: var(--tw-margin, 1.5rem 1rem);
    padding-top: 40px;
    overflow: visible;
  }

  :host([closed]) {
    display: none !important;
  }

  :host([minimized]) {
    padding-top: 0;
    min-height: 0;
    max-height: 36px;
    overflow: hidden;
  }

  :host([minimized]) .content {
    display: none;
  }

  :host([maximized]) {
    display: flex;
    flex-direction: column;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    margin: 0 !important;
    padding-top: 0 !important;
    z-index: 1000;
    border-radius: 0 !important;
    border: none !important;
    max-height: none !important;
    min-height: 100vh !important;
  }

  .titlebar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 36px;
    background: var(--tw-titlebar-bg, #161b22);
    border-bottom: var(--tw-titlebar-border, 1px solid #1a3a1a);
    border-radius: var(--tw-border-radius, 8px 8px 0 0);
    display: flex;
    align-items: center;
    z-index: 1;
  }

  :host([maximized]) .titlebar {
    position: relative;
    border-radius: 0;
    flex-shrink: 0;
  }

  :host([maximized]) .content {
    flex: 1;
    overflow-y: auto;
  }

  .dots {
    display: flex;
    align-items: center;
    gap: 6px;
    padding-left: 12px;
    z-index: 3;
    flex-shrink: 0;
  }

  .dot {
    width: var(--tw-dot-size, 12px);
    height: var(--tw-dot-size, 12px);
    border-radius: 50%;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: opacity 150ms ease, transform 150ms ease;
  }

  .dot:hover {
    opacity: 0.8;
    transform: scale(1.2);
  }

  .dot-red { background: #ff5f57; }
  .dot-yellow { background: #febc2e; }
  .dot-green { background: #28c840; }

  .dot-disabled {
    opacity: 0.3;
    cursor: default;
    pointer-events: none;
  }

  .dot[hidden] { display: none; }

  .title-text {
    margin-left: 8px;
    font-family: var(--tw-title-font, 'JetBrains Mono', monospace);
    font-size: 0.75rem;
    color: var(--tw-title-color, #8b949e);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    z-index: 2;
  }

  .content {
    position: relative;
  }

  @media (max-width: 768px) {
    :host([active]) {
      margin: var(--tw-margin-mobile, 0.75rem 0.5rem);
    }

    .title-text {
      font-size: 0.65rem;
    }
  }
`;

const TEMPLATE = `
  <div class="titlebar" part="titlebar">
    <div class="dots" part="dots">
      <button class="dot dot-red" aria-label="Close section"></button>
      <button class="dot dot-yellow" aria-label="Minimize section"></button>
      <button class="dot dot-green" aria-label="Maximize section"></button>
    </div>
    <span class="title-text" part="title"></span>
  </div>
  <div class="content" part="content">
    <slot></slot>
  </div>
`;

export class TerminalWindow extends HTMLElement {
  private _redDot!: HTMLButtonElement;
  private _yellowDot!: HTMLButtonElement;
  private _greenDot!: HTMLButtonElement;
  private _titleText!: HTMLSpanElement;
  private _escapeHandler: ((e: KeyboardEvent) => void) | null = null;

  static get observedAttributes() {
    return ['title', 'active', 'closable', 'minimizable', 'maximizable', 'closed', 'minimized', 'maximized'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const el = document.createElement('template');
    el.innerHTML = `<style>${STYLES}</style>${TEMPLATE}`;
    this.shadowRoot!.appendChild(el.content.cloneNode(true));

    this._redDot = this.shadowRoot!.querySelector('.dot-red')!;
    this._yellowDot = this.shadowRoot!.querySelector('.dot-yellow')!;
    this._greenDot = this.shadowRoot!.querySelector('.dot-green')!;
    this._titleText = this.shadowRoot!.querySelector('.title-text')!;
  }

  connectedCallback() {
    this._redDot.addEventListener('click', this._onClose);
    this._yellowDot.addEventListener('click', this._onMinimize);
    this._greenDot.addEventListener('click', this._onMaximize);
    this._updateDotVisibility();
    this._updateTitle();
    this._bindEscape();
  }

  disconnectedCallback() {
    this._redDot.removeEventListener('click', this._onClose);
    this._yellowDot.removeEventListener('click', this._onMinimize);
    this._greenDot.removeEventListener('click', this._onMaximize);
    this._unbindEscape();
  }

  attributeChangedCallback(name: string) {
    if (!this.isConnected) return;
    if (name === 'title') this._updateTitle();
    if (name === 'closable' || name === 'minimizable' || name === 'maximizable') this._updateDotVisibility();
    if (name === 'maximized') this._bindEscape();
  }

  // --- Public API ---

  close() {
    this.setAttribute('closed', '');
    this.dispatchEvent(new CustomEvent('terminal-close', { bubbles: true }));
  }

  minimize() {
    if (this.hasAttribute('maximized')) return;
    this.setAttribute('minimized', '');
    this.dispatchEvent(new CustomEvent('terminal-minimize', { bubbles: true }));
  }

  maximize() {
    this.removeAttribute('minimized');
    this.setAttribute('maximized', '');
    this._yellowDot.classList.add('dot-disabled');
    this.dispatchEvent(new CustomEvent('terminal-maximize', { bubbles: true }));
  }

  restore() {
    const wasMaximized = this.hasAttribute('maximized');
    const wasMinimized = this.hasAttribute('minimized');
    this.removeAttribute('maximized');
    this.removeAttribute('minimized');
    this.removeAttribute('closed');
    this._yellowDot.classList.remove('dot-disabled');
    if (wasMaximized || wasMinimized) {
      this.dispatchEvent(new CustomEvent('terminal-restore', { bubbles: true }));
    }
  }

  // --- Private ---

  private _onClose = (e: Event) => {
    e.stopPropagation();
    if (this.hasAttribute('maximized')) {
      this.restore();
      this.dispatchEvent(new CustomEvent('terminal-restore', { bubbles: true }));
    } else {
      this.close();
    }
  };

  private _onMinimize = (e: Event) => {
    e.stopPropagation();
    if (this.hasAttribute('maximized')) return;
    if (this.hasAttribute('minimized')) {
      this.restore();
    } else {
      this.minimize();
    }
  };

  private _onMaximize = (e: Event) => {
    e.stopPropagation();
    if (this.hasAttribute('maximized')) {
      this.restore();
    } else {
      this.maximize();
    }
  };

  private _updateTitle() {
    this._titleText.textContent = this.getAttribute('title') || '';
  }

  private _updateDotVisibility() {
    this._redDot.hidden = this.getAttribute('closable') === 'false';
    this._yellowDot.hidden = this.getAttribute('minimizable') === 'false';
    this._greenDot.hidden = this.getAttribute('maximizable') === 'false';
  }

  private _bindEscape() {
    this._unbindEscape();
    if (this.hasAttribute('maximized')) {
      this._escapeHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') this.restore();
      };
      document.addEventListener('keydown', this._escapeHandler);
    }
  }

  private _unbindEscape() {
    if (this._escapeHandler) {
      document.removeEventListener('keydown', this._escapeHandler);
      this._escapeHandler = null;
    }
  }
}

export function register() {
  if (!customElements.get('alleato-terminal-window')) {
    customElements.define('alleato-terminal-window', TerminalWindow);
  }
}
