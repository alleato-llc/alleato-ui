const STYLES = `
  :host {
    display: block;
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--form-label-color, #333);
    font-family: var(--form-label-font, inherit);
    margin-bottom: 0.5rem;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.875rem 1rem;
    font-size: 1rem;
    font-family: var(--form-input-font, inherit);
    border: var(--form-input-border, 1px solid #e8e4df);
    border-radius: var(--form-input-radius, 8px);
    background: var(--form-input-bg, #fffcf6);
    color: var(--form-input-color, #333);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    box-sizing: border-box;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: var(--form-focus-border-color, #6C3BAA);
    box-shadow: var(--form-focus-shadow, 0 0 0 3px rgba(108, 59, 170, 0.1));
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--form-placeholder-color, #999);
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }
`;

const TEMPLATE = `
  <label></label>
`;

export class FormField extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'name', 'type', 'placeholder', 'required', 'rows'];
  }

  private _label!: HTMLLabelElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const el = document.createElement('template');
    el.innerHTML = `<style>${STYLES}</style>${TEMPLATE}`;
    this.shadowRoot!.appendChild(el.content.cloneNode(true));
    this._label = this.shadowRoot!.querySelector('label')!;
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  private render() {
    const shadow = this.shadowRoot!;
    const name = this.getAttribute('name') || '';
    const type = this.getAttribute('type') || 'text';
    const placeholder = this.getAttribute('placeholder') || '';
    const required = this.hasAttribute('required');
    const rows = this.getAttribute('rows') || '5';

    this._label.textContent = this.getAttribute('label') || '';
    this._label.setAttribute('for', name);

    // Remove existing input/textarea if re-rendering
    const existing = shadow.querySelector('input, textarea');
    if (existing) existing.remove();

    let input: HTMLInputElement | HTMLTextAreaElement;
    if (type === 'textarea') {
      input = document.createElement('textarea');
      (input as HTMLTextAreaElement).rows = parseInt(rows, 10);
    } else {
      input = document.createElement('input');
      (input as HTMLInputElement).type = type;
    }

    input.id = name;
    input.name = name;
    input.placeholder = placeholder;
    if (required) input.required = true;

    shadow.appendChild(input);
  }

  get value(): string {
    const input = this.shadowRoot!.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
    return input?.value ?? '';
  }

  set value(val: string) {
    const input = this.shadowRoot!.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
    if (input) input.value = val;
  }

  get validity(): ValidityState | undefined {
    return this.shadowRoot!.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea')?.validity;
  }

  reportValidity(): boolean {
    return this.shadowRoot!.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea')?.reportValidity() ?? true;
  }
}

export function register() {
  if (!customElements.get('alleato-form-field')) {
    customElements.define('alleato-form-field', FormField);
  }
}
