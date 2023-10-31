import * as htmlparser2 from 'htmlparser2';

export function splitComponentSource(src: string) {
  const { children } = htmlparser2.parseDocument(src, {
    withStartIndices: true,
    withEndIndices: true,
  });

  return {
    script: deindent(withoutTag(getTag('script'))),
    style: indent(getTag('style')),
    template: withoutTag(getTag('template')),
    docs: withoutTag(getTag('docs')),
    test: withoutTag(getTag('test')),
  };

  function getTag(tag: string) {
    const child = children.find((x: any) => x.name === tag);

    return child
      ? src.slice(child.startIndex!, child.endIndex! + 1)
      : undefined;
  }
}

function withoutTag(value: string | undefined) {
  return value?.replace(/(^<\w+>)|(<\/\w+>$)/g, '').trim();
}

function deindent(value: string | undefined) {
  return value?.replace(/\n  /g, '\n');
}

function indent(value: string | undefined) {
  return value?.replace(/\n/g, '\n  ');
}
