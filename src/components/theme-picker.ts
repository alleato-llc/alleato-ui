export interface ThemeDef {
  id: string;
  label: string;
  icon?: string;
}

const STYLES = `
  :host {
    display: inline-block;
    position: relative;
  }

  .trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.4rem;
    color: var(--picker-trigger-color, var(--color-muted, #999));
    opacity: 0.5;
    transition: opacity 0.2s ease, color 0.2s ease;
  }

  .trigger:hover,
  .trigger[aria-expanded="true"] {
    opacity: 1;
  }

  .trigger svg {
    width: 20px;
    height: 20px;
  }

  .menu {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    min-width: 180px;
    background: var(--picker-menu-bg, var(--color-white, #fff));
    border: var(--picker-menu-border, 1px solid var(--color-medium, #e8e4df));
    border-radius: var(--picker-menu-radius, 8px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    z-index: 10000;
    overflow: hidden;
    padding: 0.25rem 0;
  }

  .menu[data-open] {
    display: block;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.6rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.85rem;
    font-family: inherit;
    color: inherit;
    text-align: left;
    transition: background 0.15s ease;
  }

  .option:hover,
  .option:focus-visible {
    background: var(--picker-option-hover-bg, var(--color-light, #f5f5f5));
    outline: none;
  }

  .option[aria-selected="true"] {
    font-weight: 600;
  }

  .option[aria-selected="true"]::after {
    content: '✓';
    margin-left: auto;
    font-size: 0.75rem;
  }

  .option-icon {
    display: inline-flex;
    width: 18px;
    height: 18px;
    align-items: center;
    justify-content: center;
  }

  .option-icon svg {
    width: 100%;
    height: 100%;
  }
`;

const GEAR_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="3"/>
  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
</svg>`;

export class ThemePicker extends HTMLElement {
  private _themes: ThemeDef[] = [];
  private _open = false;
  private _boundClose: (e: MouseEvent) => void;

  static get observedAttributes() {
    return ['current', 'storage-key'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._boundClose = (e: MouseEvent) => {
      if (!this.contains(e.target as Node)) this._closeMenu();
    };
  }

  get themes(): ThemeDef[] {
    return this._themes;
  }

  set themes(val: ThemeDef[]) {
    this._themes = val;
    this._renderMenu();
  }

  get current(): string {
    return this.getAttribute('current') || '';
  }

  set current(val: string) {
    if (val) {
      this.setAttribute('current', val);
    } else {
      this.removeAttribute('current');
    }
  }

  get storageKey(): string {
    return this.getAttribute('storage-key') || '';
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `<style>${STYLES}</style>
      <button class="trigger" aria-label="Change theme" aria-haspopup="listbox" aria-expanded="false">
        ${GEAR_SVG}
      </button>
      <div class="menu" role="listbox" aria-label="Theme"></div>`;

    this.shadowRoot!.querySelector('.trigger')!.addEventListener('click', () => {
      this._open ? this._closeMenu() : this._openMenu();
    });

    this.shadowRoot!.addEventListener('keydown', (e) => this._handleKeydown(e as KeyboardEvent));

    // Restore saved theme (updates UI only — consumer applies the theme)
    if (this.storageKey) {
      const saved = localStorage.getItem(this.storageKey);
      if (saved && saved !== this.current) {
        this.current = saved;
      }
    }

    this._renderMenu();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._boundClose);
  }

  attributeChangedCallback(name: string) {
    if (name === 'current') {
      this._renderMenu();
    }
  }

  private _renderMenu() {
    const menu = this.shadowRoot?.querySelector('.menu');
    if (!menu) return;

    menu.innerHTML = this._themes.map(t => `
      <button class="option" role="option"
        data-theme="${t.id}"
        aria-selected="${t.id === this.current}"
        title="${t.label}">
        ${t.icon ? `<span class="option-icon">${this._getIconSvg(t.icon)}</span>` : ''}
        ${t.label}
      </button>
    `).join('');

    menu.querySelectorAll('.option').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = (btn as HTMLElement).dataset.theme!;
        this._selectTheme(id);
      });
    });
  }

  private _getIconSvg(name: string): string {
    const iconMap: Record<string, string> = {
      sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
      terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M7 8l3 2-3 2"/><path d="M13 12h4"/></svg>`,
      newspaper: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><rect x="10" y="6" width="8" height="4"/></svg>`,
    };
    return iconMap[name] || '';
  }

  private _selectTheme(id: string) {
    const previous = this.current;
    if (id === previous) {
      this._closeMenu();
      return;
    }

    this.current = id;
    this._closeMenu();

    if (this.storageKey) {
      localStorage.setItem(this.storageKey, id);
    }

    this.dispatchEvent(new CustomEvent('theme-change', {
      bubbles: true,
      detail: { theme: id, previous },
    }));
  }

  private _openMenu() {
    this._open = true;
    const menu = this.shadowRoot!.querySelector('.menu')!;
    const trigger = this.shadowRoot!.querySelector('.trigger')!;
    menu.setAttribute('data-open', '');
    trigger.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', this._boundClose);

    // Focus first option
    const first = menu.querySelector('.option') as HTMLElement;
    first?.focus();
  }

  private _closeMenu() {
    this._open = false;
    const menu = this.shadowRoot?.querySelector('.menu');
    const trigger = this.shadowRoot?.querySelector('.trigger');
    menu?.removeAttribute('data-open');
    trigger?.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', this._boundClose);
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (!this._open) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      this._closeMenu();
      (this.shadowRoot!.querySelector('.trigger') as HTMLElement)?.focus();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const options = Array.from(this.shadowRoot!.querySelectorAll('.option')) as HTMLElement[];
      const current = this.shadowRoot!.activeElement as HTMLElement;
      const idx = options.indexOf(current);
      const next = e.key === 'ArrowDown'
        ? options[(idx + 1) % options.length]
        : options[(idx - 1 + options.length) % options.length];
      next?.focus();
    }

    if (e.key === 'Enter') {
      const focused = this.shadowRoot!.activeElement as HTMLElement;
      if (focused?.dataset.theme != null) {
        this._selectTheme(focused.dataset.theme);
      }
    }
  }
}

export function register() {
  if (!customElements.get('alleato-theme-picker')) {
    customElements.define('alleato-theme-picker', ThemePicker);
  }
}
