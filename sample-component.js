export const template = `
  <div>Hello world!</div>

  <style>
    div {
      color: var(--my-color);
    }
  </style>
`;

export class SampleComponent extends HTMLElement {
  // this property declaration...
  #shadowRoot;

  // ... and the constructor calling super()
  // are required for this to work
  constructor() {
    super();

    this.#shadowRoot = this.attachShadow({ mode: 'open' });
    this.#shadowRoot.innerHTML = template;
  
  }
}

customElements.define('sample-component', SampleComponent);