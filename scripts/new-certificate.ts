/**
 * Mints a certificate identifier and appends the record to the register.
 *
 *   npm run cert:new -- --name "Asha Patel" \
 *     --programme "Geospatial Engineering Internship" \
 *     --from 2026-09-01 --to 2026-10-25
 *
 * Writing the record is the whole issuance step. Commit and deploy, and the
 * verification page exists.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { randomInt } from 'node:crypto';
import path from 'node:path';

// No O, I, Z, 0 or 1: these are read off paper and typed back in.
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXY';
const REGISTER = path.resolve('data/certificates.ts');

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(`--${flag}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

function mintId(year: number, taken: Set<string>): string {
  for (let attempt = 0; attempt < 500; attempt++) {
    let suffix = '';
    for (let i = 0; i < 6; i++) suffix += ALPHABET[randomInt(ALPHABET.length)];
    const id = `AGN-${year}-${suffix}`;
    if (!taken.has(id)) return id;
  }
  throw new Error('could not mint an unused identifier');
}

const name = arg('name');
const programme = arg('programme') ?? 'Internship';
const kind = arg('kind') ?? 'Internship';
const from = arg('from');
const to = arg('to');
const hasPdf = process.argv.includes('--pdf');

if (!name) {
  console.error('Usage: npm run cert:new -- --name "Full Name" [--programme "..."] [--from YYYY-MM-DD] [--to YYYY-MM-DD] [--pdf]');
  process.exit(1);
}

const source = readFileSync(REGISTER, 'utf-8');
const taken = new Set([...source.matchAll(/id: '(AGN-[^']+)'/g)].map((m) => m[1]!));

const today = new Date().toISOString().slice(0, 10);
const id = mintId(Number(today.slice(0, 4)), taken);

const record = [
  '  {',
  `    id: '${id}',`,
  `    name: ${JSON.stringify(name)},`,
  `    programme: ${JSON.stringify(programme)},`,
  `    kind: ${JSON.stringify(kind)},`,
  `    issuedOn: '${today}',`,
  from ? `    startedOn: '${from}',` : null,
  to ? `    endedOn: '${to}',` : null,
  hasPdf ? '    hasPdf: true,' : null,
  '  },',
].filter(Boolean).join('\n');

const marker = '];';
const at = source.lastIndexOf(marker);
if (at === -1) throw new Error('could not find the end of the register');

writeFileSync(REGISTER, `${source.slice(0, at)}${record}\n${source.slice(at)}`, 'utf-8');

console.log(`\n  Issued  ${id}`);
console.log(`  To      ${name}`);
console.log(`  Verify  https://agronavis.in/verify/${id}`);
if (hasPdf) console.log(`  Place the PDF at  public/certificates/${id}.pdf`);
console.log('\n  Commit data/certificates.ts and deploy.\n');
