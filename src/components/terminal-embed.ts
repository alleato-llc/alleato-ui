const STYLES = `
  :host {
    display: block;
    position: absolute;
    top: 36px;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--te-bg, #0d1117);
    padding: var(--te-padding, 0.75rem);
    overflow: hidden;
  }

  .container {
    width: 100%;
    height: 100%;
  }

  /* xterm.js renders into the container in light DOM via slotting,
     but these rules target the shadow-internal wrapper */
  ::slotted(.xterm) {
    height: 100%;
  }

  ::slotted(.xterm-viewport) {
    overflow-y: auto !important;
  }
`;

const TEMPLATE = `
  <div class="container" part="container">
    <slot></slot>
  </div>
`;

export class TerminalEmbed extends HTMLElement {
  private _resizeObserver: ResizeObserver | null = null;
  private _containerEl!: HTMLDivElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const el = document.createElement('template');
    el.innerHTML = `<style>${STYLES}</style>${TEMPLATE}`;
    this.shadowRoot!.appendChild(el.content.cloneNode(true));
    this._containerEl = this.shadowRoot!.querySelector('.container')!;
  }

  get container(): HTMLDivElement {
    return this._containerEl;
  }

  connectedCallback() {
    this._resizeObserver = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = this._containerEl;
      if (!clientWidth || !clientHeight) return;
      const cols = Math.floor(clientWidth / 8.4);
      const rows = Math.floor(clientHeight / 17);
      if (cols > 0 && rows > 0) {
        this.dispatchEvent(new CustomEvent('terminal-resize', {
          bubbles: true,
          detail: { cols, rows },
        }));
      }
    });
    this._resizeObserver.observe(this._containerEl);
  }

  disconnectedCallback() {
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
  }
}

export function register() {
  if (!customElements.get('alleato-terminal-embed')) {
    customElements.define('alleato-terminal-embed', TerminalEmbed);
  }
}
