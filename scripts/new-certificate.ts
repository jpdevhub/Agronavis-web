/**
 * Issues a certificate.
 *
 *   npm run cert:new -- --name "Aman Singh" --role "Backend Engineer" \
 *     --from 2026-08-12 --to 2026-09-25
 *
 * Mints an unused identifier, appends the record, prints the link. Commit and
 * deploy and the verification page exists.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { randomInt } from 'node:crypto';

// No 0, 1, i, l or o: these get read off paper.
const ALPHABET = '23456789abcdefghjkmnpqrstuvwxyz';
const FILE = 'data/certificates.ts';

const arg = (f: string) => {
  const i = process.argv.indexOf(`--${f}`);
  return i === -1 ? undefined : process.argv[i + 1];
};

const name = arg('name');
const role = arg('role');
const from = arg('from');
const to = arg('to');

if (!name || !role || !from || !to) {
  console.error('Usage: npm run cert:new -- --name "Full Name" --role "Role" --from YYYY-MM-DD --to YYYY-MM-DD');
  process.exit(1);
}

const source = readFileSync(FILE, 'utf-8');
const taken = new Set([...source.matchAll(/id: '([^']+)'/g)].map((m) => m[1]!));

let id = '';
for (let i = 0; i < 500 && !id; i++) {
  let s = '';
  for (let j = 0; j < 10; j++) s += ALPHABET[randomInt(ALPHABET.length)];
  if (!taken.has(`agn-${s}`)) id = `agn-${s}`;
}
if (!id) throw new Error('could not mint an unused identifier');

const record = `  {
    id: '${id}',
    name: ${JSON.stringify(name)},
    role: ${JSON.stringify(role)},
    startedOn: '${from}',
    endedOn: '${to}',
    issuedOn: '${new Date().toISOString().slice(0, 10)}',
  },
`;

const at = source.lastIndexOf('];');
writeFileSync(FILE, source.slice(0, at) + record + source.slice(at), 'utf-8');

console.log(`\n  ${name} — ${role}`);
console.log(`  Save the certificate image as  public/certificates/${id}.png`);
console.log(`  Verification link              https://agronavis.in/verify/${id}\n`);
