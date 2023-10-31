export const template = `
  <div>Hello world!</div>

  <style>
    div {
      color: var(--my-color);
    }
  </style>
`;

export class MyComponent extends HTMLElement {
  // this property declaration...
  #shadowRoot;

  // ... and the constructor calling super()
  // are required for this to work
  constructor() {
    super();

    // Automatically inserted
    // if this fails ensure #shadowRoot is defined in the class
    this.#shadowRoot = this.attachShadow({ mode: 'open' });
    this.#shadowRoot.innerHTML = template;
    // end of automatic insertion
  
  }
}

customElements.define('sample-my-component', SampleMyComponent);