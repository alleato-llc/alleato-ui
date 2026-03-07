const STYLES = `
  :host {
    display: none;
  }

  :host([open]) {
    display: block;
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: var(--ti-overlay-bg, rgba(58, 53, 48, 0.5));
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 200ms ease;
    padding: 1rem;
  }

  .overlay.visible {
    opacity: 1;
  }

  .dialog {
    background: var(--ti-dialog-bg, #fffcf6);
    border: var(--ti-dialog-border, 1px solid #e8e4df);
    border-radius: var(--ti-dialog-radius, 12px);
    max-width: 520px;
    width: 100%;
    overflow: hidden;
    transform: scale(0.95);
    transition: transform 200ms ease;
    box-shadow: var(--ti-dialog-shadow, 0 8px 24px rgba(0, 0, 0, 0.15));
  }

  .overlay.visible .dialog {
    transform: scale(1);
  }

  .titlebar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px 16px;
    background: var(--ti-titlebar-bg, #f8f7f4);
    border-bottom: var(--ti-titlebar-border, 1px solid #e8e4df);
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    padding: 0;
    cursor: default;
  }

  .dot-red { background: #ff5f57; }
  .dot-yellow { background: #febc2e; }
  .dot-green { background: #28c840; }

  .titlebar-text {
    margin-left: 8px;
    font-size: 0.75rem;
    color: var(--ti-titlebar-color, #999);
    font-family: var(--ti-title-font, 'JetBrains Mono', monospace);
  }

  .body {
    padding: 1.75rem;
    font-size: 0.95rem;
    line-height: 1.7;
    font-family: var(--ti-body-font, inherit);
    color: var(--ti-body-color, #333);
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 1.25rem;
  }

  .btn-cancel {
    padding: 0.6rem 1.25rem;
    background: transparent;
    color: var(--ti-cancel-color, #999);
    border: var(--ti-cancel-border, 1px solid #e8e4df);
    border-radius: var(--ti-btn-radius, 8px);
    font-family: inherit;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 150ms ease;
  }

  .btn-cancel:hover {
    color: var(--ti-cancel-hover-color, #333);
    border-color: var(--ti-cancel-hover-border, #333);
  }

  .btn-confirm {
    padding: 0.6rem 1.25rem;
    background: var(--ti-confirm-bg, #6C3BAA);
    color: var(--ti-confirm-color, #fffcf6);
    border: none;
    border-radius: var(--ti-btn-radius, 8px);
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 150ms ease;
  }

  .btn-confirm:hover {
    background: var(--ti-confirm-hover-bg, #553090);
  }
`;

const TEMPLATE = `
  <div class="overlay" role="dialog" aria-modal="true">
    <div class="dialog">
      <div class="titlebar" part="titlebar">
        <span class="dot dot-red"></span>
        <span class="dot dot-yellow"></span>
        <span class="dot dot-green"></span>
        <span class="titlebar-text" part="title"></span>
      </div>
      <div class="body" part="body">
        <slot></slot>
        <div class="actions" part="actions">
          <button class="btn-cancel" part="cancel"></button>
          <button class="btn-confirm" part="confirm"></button>
        </div>
      </div>
    </div>
  </div>
`;

export class TerminalIntro extends HTMLElement {
  private _overlay!: HTMLElement;
  private _cancelBtn!: HTMLButtonElement;
  private _confirmBtn!: HTMLButtonElement;
  private _titleText!: HTMLSpanElement;
  private _keydownHandler: ((e: KeyboardEvent) => void) | null = null;

  static get observedAttributes() {
    return ['open', 'command', 'confirm-text', 'cancel-text', 'storage-key'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const el = document.createElement('template');
    el.innerHTML = `<style>${STYLES}</style>${TEMPLATE}`;
    this.shadowRoot!.appendChild(el.content.cloneNode(true));

    this._overlay = this.shadowRoot!.querySelector('.overlay')!;
    this._cancelBtn = this.shadowRoot!.querySelector('.btn-cancel')!;
    this._confirmBtn = this.shadowRoot!.querySelector('.btn-confirm')!;
    this._titleText = this.shadowRoot!.querySelector('.titlebar-text')!;
  }

  connectedCallback() {
    this._cancelBtn.addEventListener('click', this._onCancel);
    this._confirmBtn.addEventListener('click', this._onConfirm);
    this._overlay.addEventListener('click', this._onOverlayClick);
    this._updateTexts();
    if (this.hasAttribute('open')) this._show();
  }

  disconnectedCallback() {
    this._cancelBtn.removeEventListener('click', this._onCancel);
    this._confirmBtn.removeEventListener('click', this._onConfirm);
    this._overlay.removeEventListener('click', this._onOverlayClick);
    this._unbindKeydown();
  }

  attributeChangedCallback(name: string) {
    if (!this.isConnected) return;
    if (name === 'open') {
      if (this.hasAttribute('open')) {
        this._show();
      } else {
        this._hide();
      }
    }
    if (name === 'command' || name === 'confirm-text' || name === 'cancel-text') {
      this._updateTexts();
    }
  }

  /** Check if the intro has been seen (via storage-key). */
  get seen(): boolean {
    const key = this.getAttribute('storage-key');
    return key ? localStorage.getItem(key) === 'true' : false;
  }

  /**
   * Show the dialog. If storage-key is set and already seen,
   * auto-confirms immediately (dispatches 'confirm' and returns true).
   * Otherwise shows the dialog and returns a promise that resolves
   * to true (confirm) or false (cancel).
   */
  prompt(): Promise<boolean> {
    if (this.seen) {
      this.dispatchEvent(new CustomEvent('confirm', { bubbles: true }));
      return Promise.resolve(true);
    }
    this.setAttribute('open', '');
    return new Promise<boolean>((resolve) => {
      const onConfirm = () => { cleanup(); resolve(true); };
      const onCancel = () => { cleanup(); resolve(false); };
      const cleanup = () => {
        this.removeEventListener('confirm', onConfirm);
        this.removeEventListener('cancel', onCancel);
      };
      this.addEventListener('confirm', onConfirm, { once: true });
      this.addEventListener('cancel', onCancel, { once: true });
    });
  }

  // --- Private ---

  private _show() {
    requestAnimationFrame(() => {
      this._overlay.classList.add('visible');
      this._confirmBtn.focus();
      this._bindKeydown();
    });
  }

  private _hide() {
    this._overlay.classList.remove('visible');
    this._unbindKeydown();
  }

  private _confirm() {
    const key = this.getAttribute('storage-key');
    if (key) localStorage.setItem(key, 'true');
    this.removeAttribute('open');
    this.dispatchEvent(new CustomEvent('confirm', { bubbles: true }));
  }

  private _cancel() {
    this.removeAttribute('open');
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true }));
  }

  private _onConfirm = () => this._confirm();
  private _onCancel = () => this._cancel();

  private _onOverlayClick = (e: Event) => {
    if (e.target === this._overlay) this._cancel();
  };

  private _updateTexts() {
    this._titleText.textContent = this.getAttribute('command') || '';
    this._cancelBtn.textContent = this.getAttribute('cancel-text') || 'Cancel';
    this._confirmBtn.textContent = this.getAttribute('confirm-text') || 'Confirm';
  }

  private _bindKeydown() {
    this._unbindKeydown();
    const focusable = [this._cancelBtn, this._confirmBtn];
    this._keydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this._cancel();
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        const idx = focusable.indexOf(document.activeElement as HTMLButtonElement);
        const next = e.shiftKey
          ? (idx - 1 + focusable.length) % focusable.length
          : (idx + 1) % focusable.length;
        focusable[next]?.focus();
      }
    };
    document.addEventListener('keydown', this._keydownHandler);
  }

  private _unbindKeydown() {
    if (this._keydownHandler) {
      document.removeEventListener('keydown', this._keydownHandler);
      this._keydownHandler = null;
    }
  }
}

export function register() {
  if (!customElements.get('alleato-terminal-intro')) {
    customElements.define('alleato-terminal-intro', TerminalIntro);
  }
}
