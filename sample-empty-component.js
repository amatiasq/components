export const template = ``;

export class SampleEmptyComponent extends HTMLElement {
  #shadowRoot;

  constructor() {
    super();

    this.#shadowRoot = this.attachShadow({ mode: 'open' });
    
  
  }
}

customElements.define('sample-empty-component', SampleEmptyComponent);