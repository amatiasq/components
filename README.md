# Web Components

This is where I store my web components.

- Hamburger button: three lines that become a cross when clicked
  - Documentation and demo: https://components.amatiasq.com/hamburger-button.html
  - Installation: `import 'https://components.amatiasq.com/hamburger-button.js'`
  - Usage: `<hamburger-button />`

## How it works

In order to create them easily I created [a simple transpiler](./scripts/convert-to-js.ts) in Bun.

This is how a web component, in this example `src/sample-component.html`, is defined:

```html
<template>
  <div>Hello world!</div>
</template>

<script>
  export class SampleComponent extends HTMLElement {
    // this property declaration...
    #shadowRoot;

    // ... and the constructor calling super()
    // are required for this to work
    constructor() {
      super();
    }
  }
</script>

<style>
  div {
    color: var(--my-color);
  }
</style>

<docs>
  # Sample Component

  Some markdown documentation

  - Neat
  - Clean
  - Simple
</docs>

<test>
  <sample-component style="--my-color: blue" />
  <sample-component style="--my-color: red" />
</test>
```

Which whill generate `out/sample-component.js` (below) and `out/sample-component.html` for documentation and manual testing.

```js
export const template = `
  <div>Hello world!</div>

  <style>
    div {
      color: var(--my-color);
    }
  </style>
`;

export class MyComponent extends HTMLElement {
  #shadowRoot;

  constructor() {
    super();

    // Automatically inserted
    // if this fails ensure #shadowRoot is defined in the class
    this.#shadowRoot = this.attachShadow({ mode: 'open' });
    this.#shadowRoot.innerHTML = template;
  }
}

// Automatically generated from file name
customElements.define('my-component', MyComponent);
```

The `script`, `template`, `style`, `docs` and `test` elements are optional and can be defined in any order.

If the `script` tag is present it should contain a class called as the file (converted from `snake-case` to `PascalCase`) in order for the component to work.
It should declare a `#shadowRoot` property that will be used to save the shadow DOM and the call to `super()` is used to inject the shadow DOM instantiation.

## How to run

To install dependencies:

```bash
bun install
```

To transpile:

```bash
bun run build
```

To watch and develop source files

```bash
bun dev
```
