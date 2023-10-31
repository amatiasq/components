import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const processor = await unified()
  // Remark parses Markdown to an AST (includes markdown transform)
  .use(remarkParse)
  // Remark then transforms the AST to a new rehype AST
  .use(remarkRehype)
  // rehype-stringify transforms the rehype AST to a string of HTML
  .use(rehypeStringify);

export async function composeDocsPage(tag: string, docs: string, test: string) {
  const html = await markdownToHtml(docs);
  return copmposeHtml(tag, html, test);
}

async function markdownToHtml(content: string): Promise<string> {
  const file = await processor.process(content);
  return (file?.value as string) ?? '';
}

function copmposeHtml(componentName: string, docs: string, test: string) {
  return `
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <title>${componentName} test</title>
  <script type="module" src="${componentName}.js"></script>
  <style>
    body {
      max-width: 60em;
      margin: 1em auto;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
    }
    .test {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      gap: 1rem;
    }
  </style>
</head>

<body>
  <section class="docs">
  ${docs}
  </section>

  <h2> Test </h2>
  <script>
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
  </script>
  <section class="test">
    ${test}
  </section>
</body>

</html>
  `.trim();
}
