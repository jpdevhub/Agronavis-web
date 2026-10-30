# Certificates

Agronavis issues internship and completion certificates. Each carries an identifier, and
`agronavis.in/verify/<id>` shows the record behind it.

## Issuing one

```bash
npm run cert:new -- --name "Asha Patel" \
  --programme "Geospatial Engineering Internship" \
  --from 2026-09-01 --to 2026-10-25
```

That mints an unused identifier, appends the record to `data/certificates.ts`, and prints the
verification URL. Commit and deploy, and the page exists. Add `--pdf` if you are also placing a
document at `public/certificates/<id>.pdf`.

## Why the register is a file

Verification is the one page that must work when everything else is broken, and it is printed on
paper that outlives any particular deployment. Keeping the register in the repository means it
has no database to be down, no API to time out, and no cold start. Pages are generated at build
time and served from the edge.

It also makes the history honest: every issuance and every revocation is a commit, with an author
and a date, which is a stronger audit trail than a mutable row.

The cost is a deploy per certificate. At the volume this is built for, that is the right trade.

## Identifiers

`AGN-YYYY-XXXXXX`, where the suffix is six characters from an alphabet with no `O`, `I`, `Z`, `0`
or `1`, because people read these off paper and type them back in. Lookup is forgiving: lowercase,
missing dashes and stray spaces all resolve.

Identifiers are never reused and never edited once published.

## Revoking

Add a `revoked` block to the record rather than deleting it:

```ts
revoked: { on: '2026-11-04', reason: 'Issued in error.' },
```

The page then says the certificate was withdrawn, with the date and reason. Deleting the record
instead would leave anyone holding the certificate with a page claiming no such record ever
existed, which is a worse answer than the truth.

## What a visitor sees

| Situation | Result |
| --- | --- |
| Identifier matches a record | The record, marked verified |
| Identifier matches a revoked record | The record, marked withdrawn, with the reason |
| Well-formed but unknown | A plain "no record found" page, not an error |
| Malformed | 404 |
