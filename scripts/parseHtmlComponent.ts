import * as htmlparser2 from 'htmlparser2';

export function parseHtmlComponent(customTag: string, src: string) {
  const { children } = htmlparser2.parseDocument(src, {
    withStartIndices: true,
    withEndIndices: true,
  });

  const script = getTag('script', { removeTag: true });
  const style = getTag('style').replace(/\n/g, '\n  ');
  const template = getTag('template', { removeTag: true });
  const test = getTag('test', { removeTag: true });

  let html = '';
  if (template) html += `\n  ${template}\n`;
  if (style) html += `\n  ${style}\n`;

  const component = `
export const template = \`${html}\`;

${script.replace(/\n  /g, '\n').replace(
  /super\(\);?/,
  `super();

    // Automatically inserted
    // if this fails ensure #shadowRoot is defined in the class
    this.#shadowRoot = this.attachShadow({ mode: 'open' });
    ${html ? 'this.#shadowRoot.innerHTML = template;' : ''}
    // end of automatic insertion
  `
)}

customElements.define('${customTag}', ${toClassName(customTag)});
  `.trim();

  return {
    component,
    test: test ?? `<${customTag}></${customTag}>`,
  };

  function getTag(tag: string, { removeTag = false } = {}) {
    const child = children.find((x: any) => x.name === tag);
    if (!child) return '';

    const content = src.slice(child.startIndex!, child.endIndex! + 1);

    return removeTag
      ? content.replace(/(^<\w+>)|(<\/\w+>$)/g, '').trim()
      : content;
  }
}

function toClassName(value: string) {
  return value
    .replace(/^(\w)/, (x) => x.toUpperCase())
    .replace(/-(\w)/g, (x) => x[1].toUpperCase());
}
