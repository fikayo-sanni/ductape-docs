import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const roots = ['docs', 'static', 'src'];
const failures = [];
function walk(path) {
  for (const name of readdirSync(path)) {
    const file = join(path, name);
    if (statSync(file).isDirectory()) walk(file);
    else if (/\.(md|mdx|tsx|ts|js|jsx)$/.test(name)) {
      readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, index) => {
        if (/\b(npm\s+(?:install|i|add)|pnpm\s+add|yarn\s+add)\b/.test(line)
          && /@ductape\/(sdk|nestjs|client|react|vue)(?!@latest)/.test(line)) {
          failures.push(`${relative('.', file)}:${index + 1}: ${line.trim()}`);
        }
      });
    }
  }
}
roots.forEach(walk);
if (failures.length) {
  console.error(`Ductape SDK install guidance must use @latest:\n${failures.join('\n')}`);
  process.exit(1);
}
console.log('Ductape SDK install guidance consistently uses @latest');
