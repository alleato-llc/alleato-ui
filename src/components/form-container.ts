const STYLES = `
  :host {
    display: block;
    max-width: var(--form-max-width, 600px);
    margin: 0 auto;
  }

  form {
    background: var(--form-bg, #fffcf6);
    padding: var(--form-padding, 2.5rem);
    border-radius: var(--form-radius, 12px);
    border: var(--form-border, 1px solid #e8e4df);
    box-shadow: var(--form-shadow, 0 1px 3px rgba(0, 0, 0, 0.05));
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(var(--form-row-columns, 2), 1fr);
    gap: 1.5rem;
  }

  ::slotted(alleato-form-field) {
    margin-bottom: 1.5rem;
  }

  .form-row ::slotted(alleato-form-field) {
    margin-bottom: 0;
  }

  .submit-area {
    margin-top: 0.5rem;
  }

  button[type="submit"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1rem 2rem;
    font-size: 1.05rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    background: var(--form-submit-bg, linear-gradient(135deg, #C4A8E0, #E8C4A0));
    color: var(--form-submit-color, #1a1a1a);
    border-radius: var(--form-submit-radius, var(--form-radius, 8px));
    font-family: var(--form-submit-font, inherit);
    box-shadow: var(--form-submit-shadow, none);
    transition: all 0.2s ease;
  }

  button[type="submit"]:hover {
    transform: var(--form-submit-hover-transform, translateY(-2px));
    box-shadow: var(--form-submit-hover-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));
  }

  .success-message {
    margin-top: 1rem;
    padding: 1rem;
    background: var(--form-success-bg, rgba(108, 59, 170, 0.1));
    color: var(--form-success-color, #553090);
    border-radius: var(--form-radius, 8px);
    text-align: center;
    font-weight: 500;
  }

  .success-message[hidden] {
    display: none;
  }

  @media (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
    }

    form {
      padding: 1.5rem;
    }
  }
`;

const TEMPLATE = `
  <form>
    <slot name="row"></slot>
    <slot></slot>
    <div class="submit-area">
      <button type="submit"></button>
    </div>
    <p class="success-message" hidden></p>
  </form>
`;

export class FormContainer extends HTMLElement {
  static get observedAttributes() {
    return ['action', 'method', 'submit-text', 'success-message'];
  }

  private _form!: HTMLFormElement;
  private _submitBtn!: HTMLButtonElement;
  private _successMsg!: HTMLParagraphElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const el = document.createElement('template');
    el.innerHTML = `<style>${STYLES}</style>${TEMPLATE}`;
    this.shadowRoot!.appendChild(el.content.cloneNode(true));

    this._form = this.shadowRoot!.querySelector('form')!;
    this._submitBtn = this.shadowRoot!.querySelector('button[type="submit"]')!;
    this._successMsg = this.shadowRoot!.querySelector('.success-message')!;
  }

  connectedCallback() {
    this.render();
    this._form.addEventListener('submit', this.handleSubmit.bind(this));

    // Wrap slotted row fields
    this.wrapRowSlot();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  private render() {
    const action = this.getAttribute('action');
    const method = this.getAttribute('method') || 'POST';

    if (action) this._form.action = action;
    this._form.method = method;
    this._submitBtn.textContent = this.getAttribute('submit-text') || 'Submit';
    this._successMsg.textContent = this.getAttribute('success-message') || 'Thank you!';
  }

  private wrapRowSlot() {
    const rowSlot = this.shadowRoot!.querySelector('slot[name="row"]') as HTMLSlotElement;
    if (!rowSlot) return;

    const wrap = () => {
      const assigned = rowSlot.assignedElements();
      if (assigned.length > 0) {
        // The slot is inside the form — wrap it in a .form-row div
        const existing = this.shadowRoot!.querySelector('.form-row');
        if (!existing) {
          const row = document.createElement('div');
          row.className = 'form-row';
          rowSlot.parentElement!.insertBefore(row, rowSlot);
          row.appendChild(rowSlot);
        }
      }
    };

    rowSlot.addEventListener('slotchange', wrap);
    wrap();
  }

  private handleSubmit(e: Event) {
    e.preventDefault();

    // Validate all fields
    const fields = [
      ...this.querySelectorAll('alleato-form-field'),
    ] as HTMLElement[];

    const allValid = fields.every((field: any) => {
      if (typeof field.reportValidity === 'function') {
        return field.reportValidity();
      }
      return true;
    });

    if (!allValid) return;

    // Collect form data
    const data: Record<string, string> = {};
    fields.forEach((field: any) => {
      const name = field.getAttribute('name');
      if (name) data[name] = field.value || '';
    });

    // Dispatch custom event with form data
    this.dispatchEvent(new CustomEvent('form-submit', {
      detail: data,
      bubbles: true,
      composed: true,
    }));

    // Show success message
    this._successMsg.hidden = false;
    this._form.reset();
    fields.forEach((field: any) => { field.value = ''; });

    setTimeout(() => {
      this._successMsg.hidden = true;
    }, 5000);
  }
}

export function register() {
  if (!customElements.get('alleato-form-container')) {
    customElements.define('alleato-form-container', FormContainer);
  }
}
