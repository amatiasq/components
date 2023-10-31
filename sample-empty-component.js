export const template = ``;

export class SampleEmptyComponent extends HTMLElement {
  #shadowRoot;

  constructor() {
    super();

    // Automatically inserted
    // if this fails ensure #shadowRoot is defined in the class
    this.#shadowRoot = this.attachShadow({ mode: 'open' });
    
    // end of automatic insertion
  
  }
}

customElements.define('sample-empty-component', SampleEmptyComponent);