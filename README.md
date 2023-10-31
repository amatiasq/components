# Web Components

This is where I store my web components.

- Hamburger button: three lines that become a cross when clicked
  - Documentation and demo: https://components.amatiasq.com/hamburger-button.html
  - Installation: `import 'https://components.amatiasq.com/hamburger-button.js'`
  - Usage: `<hamburger-button></hamburger-button>`

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
  <sample-component style="--my-color: blue"></sample-component>
  <h3>This is plain HTML</h3>
  <sample-component style="--my-color: red"></sample-component>
</test>
```

Which whill generate `out/sample-component.js` (below) and [`out/sample-component.html`](https://components.amatiasq.com/sample-component.html) for documentation and manual testing.

```js
export const template = `
  <div>Hello world!</div>

  <style>
    div {
      color: var(--my-color);
    }
  </style>
`;

export class SampleComponent extends HTMLElement {
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
customElements.define('sample-component', SampleComponent);
```

The `script`, `template`, `style`, `docs` and `test` elements are optional and can be defined in any order.

If the `script` tag is present it should contain a class called as the file (converted from `snake-case` to `PascalCase`) in order for the component to work.
It should declare a `#shadowRoot` property that will be used to save the shadow DOM and the call to `super()` is used to inject the shadow DOM instantiation.

## Future

The idea behind this is that someday, when `<template shadowrootmode="open">` is supported by browsers (or maybe today with a polyfill) a Server Side Rendering (SSR) or Static Site Generation (SSG) tool could import the `const template` export and serve pre-filled components' insides.

```html
<sample-component>
  <!-- this could be inserted by Vite, Astro, Next.js... -->
  <template shadowrootmode="open">
    <div>Hello world!</div>

    <style>
      div {
        color: var(--my-color);
      }
    </style>
  </template>
</sample-component>
```

That would make the component immediately visible, even for users with disabled Javascript.
If the user has Javascript enabled the component will just be hydrated as soon as it's code is executed.

To know more about this approach check [this video](https://www.youtube.com/watch?v=V2yjXFPYjVA) by Thomas Allmer.

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
