import { existsSync } from 'node:fs';
import { mkdir, readdir, watch as watchDir } from 'node:fs/promises';
import { parseHtmlComponent } from './parseHtmlComponent';

const [bun, script, ...args] = Bun.argv;
const watch = args.includes('--watch') || args.includes('-w');
const [input, output] = args
  .filter((arg) => !arg.startsWith('-'))
  .map((arg) => toAbsolute(arg));

try {
  if (!input || !output) {
    throw `Usage: bun ${Bun.argv[1]} <input> <output>`;
  }

  if (!existsSync(input)) {
    throw `Input directory ${input} does not exist`;
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}

await convertAll(input, output);

if (watch) {
  const watcher = watchDir(input);

  console.log('Waiting for changes... (Ctrl+C to exit)');

  for await (const event of watcher) {
    if (event.eventType === 'change' && event.filename) {
      convertOne(input, output, event.filename);
    }
  }
}

async function convertAll(input: string, output: string) {
  await mkdir(output, { recursive: true });
  const files = await readdir(input);
  await Promise.all(files.map((file) => convertOne(input, output, file)));
}

async function convertOne(input: string, output: string, filename: string) {
  const basename = filename.replace(/\.html$/, '');
  const start = Date.now();

  try {
    const source = toAbsolute(filename, `${input}/`)!;
    const dest = toAbsolute(`${basename}.js`, `${output}/`)!;

    const src = await Bun.file(source).text();
    const { component, docs } = await parseHtmlComponent(basename, src);

    await Bun.write(dest, component);

    const size = Bun.file(dest).size;
    console.log(`- ${basename} (${size} bytes in ${Date.now() - start}ms)`);

    await Bun.write(`${output}/${basename}.html`, docs);
  } catch (error) {
    console.error(`Error processing ${input}:`);
    console.error(error);
  }
}

function toAbsolute(path: string, base = Bun.cwd) {
  if (!path) return null;
  return new URL(path, `file://${base}`).pathname;
}
