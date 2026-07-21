import fs from 'fs';

const path = new URL('../src/config/translations.ts', import.meta.url);
const src = fs.readFileSync(path, 'utf8');
const arStart = src.indexOf('  ar: {');
if (arStart < 0) throw new Error('ar not found');

let i = arStart + '  ar: '.length;
let depth = 0;
let end = -1;
for (; i < src.length; i++) {
  const c = src[i];
  if (c === '{') depth++;
  else if (c === '}') {
    depth--;
    if (depth === 0) {
      end = i;
      break;
    }
  }
}

const arObj = src.slice(arStart + '  ar: '.length, end + 1);
const result = `// src/config/translations.ts

export type Locale = 'ar';

export type Translations = typeof translations;

export const translations = ${arObj};

export default translations;
`;

fs.writeFileSync(path, result);
console.log('Wrote Arabic-only translations:', result.length, 'chars');
