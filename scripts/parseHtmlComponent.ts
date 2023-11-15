import { composeDocsPage } from './composeDocsPage';
import { splitComponentSource } from './splitComponentSource';

export async function parseHtmlComponent(customTag: string, src: string) {
  const {
    script = generateScript(customTag),
    style,
    template,
    docs = `# \`${customTag}\``,
    test = `<${customTag}></${customTag}>`,
  } = splitComponentSource(src);

  return {
    docs: await composeDocsPage(customTag, docs, test),

    component: composeComponent(
      customTag,
      script,
      buildTemplate(template, style)
    ),
  };
}

function composeComponent(tag: string, script: string, template: string) {
  return `
export const tagName = '${tag}';

export const template = \`${template}\`;

${script.replace(
  /(constructor\(\)\s*\{\s*super\(\));?/,
  `$1;

    this.#shadowRoot = this.attachShadow({ mode: 'open' });
    ${template ? 'this.#shadowRoot.innerHTML = template;' : ''}
  `
)}

customElements.define('${tag}', ${toClassName(tag)});
    `.trim();
}

function buildTemplate(template = '', style = '') {
  let html = '';
  if (template) html += `\n  ${template}\n`;
  if (style) html += `\n  ${style}\n`;
  return html;
}

function generateScript(tag: string) {
  return `
export class ${toClassName(tag)} extends HTMLElement {
  #shadowRoot;

  constructor() {
    super();
  }
}
  `.trim();
}

function toClassName(value: string) {
  return value
    .replace(/^(\w)/, (x) => x.toUpperCase())
    .replace(/-(\w)/g, (x) => x[1].toUpperCase());
}
