# Agronavis Certificate Issuance & Verification System

This document outlines the architecture, issuance workflow, verification process, administrative security, persistence model, and deployment requirements for the Agronavis internship certificate issuance and public verification system.

---

## 1. System Architecture Overview

The certificate system is implemented natively within the Agronavis Next.js App Router application (`Agronavis-web`), preserving the existing brand identity, typography (Space Grotesk), Material Design 3 tokens, and colour palette (`#74d684` accent, `#080808` canvas, `#0e0e0e` surface).

```text
                                 ┌──────────────────────────────────────────┐
                                 │              Admin Dashboard             │
                                 │           /admin/certificates            │
                                 └────────────────────┬─────────────────────┘
                                                      │
                       ┌──────────────────────────────┼─────────────────────────────┐
                       ▼                              ▼                             ▼
              [ Issue Certificate ]         [ Upload & Stamp PDF ]         [ Revoke Certificate ]
              Creates draft record          pdf-lib stamps footer          Marks status = revoked
              Generates AGI-YYYY-XXXXXX     & QR code with clickable URL   Sets public reason
                       │                              │                             │
                       └──────────────────────────────┼─────────────────────────────┘
                                                      │
                                                      ▼
                                       ┌─────────────────────────────┐
                                       │   Persistent JSON Database  │
                                       │    & Stamped PDF Storage    │
                                       └──────────────┬──────────────┘
                                                      │
                                                      ▼
                                       ┌─────────────────────────────┐
                                       │  Public Verification Page   │
                                       │ /verify-certificate/[certId]│
                                       └─────────────────────────────┘
                                                      │
                                    ┌─────────────────┴─────────────────┐
                                    ▼                                   ▼
                         [ Active / Verified ]               [ Revoked / Invalid ]
                         - Live PDF Viewer                   - Clear warning banner
                         - Signatory: Karan Singh, CEO       - Public-safe reason
                         - Recipient & Role Details          - Original ID preserved
```

---

## 2. Routes & Endpoints

### Public Routes
- **Verification Portal**: [`/verify-certificate`](https://www.agronavis.in/verify-certificate) — Search landing page to enter any certificate ID.
- **Certificate Verification**: [`/verify-certificate/[certificateId]`](https://www.agronavis.in/verify-certificate/AGI-2026-A8F3K2) — Canonical verification page with side-by-side interactive PDF viewer and authoritative record details.
- **Verification API**: `GET /api/verify/[certificateId]` — Returns public certificate metadata (`verified`, `revoked`, or `not_found`).
- **Public PDF Stream**: `GET /api/verify/[certificateId]/pdf` — Streams the stamped PDF document inline.

### Administrative Routes
- **Admin Login**: `/admin` — Secure authentication screen (no public signups).
- **Admin Dashboard**: `/admin/certificates` — Certificate lifecycle management, metrics, issuance modal, PDF uploader/stamper, and revocation dialogs.
- **Admin APIs**:
  - `POST /api/admin/login` — Verifies bcrypt password and issues signed HMAC cookie.
  - `POST /api/admin/logout` — Destroys session and clears cookie.
  - `GET /api/admin/session` — Checks session validity.
  - `GET /api/admin/certificates` — Lists certificates with search, filtering, and stats.
  - `POST /api/admin/certificates` — Creates a new draft certificate.
  - `GET /api/admin/certificates/[id]` — Fetches details for a single certificate.
  - `PATCH /api/admin/certificates/[id]` — Updates editable metadata.
  - `DELETE /api/admin/certificates/[id]` — Deletes a draft certificate (published/revoked records are protected from deletion).
  - `POST /api/admin/certificates/[id]/upload` — Uploads an existing certificate PDF, stamps the verification footer + QR code, and stores it.
  - `POST /api/admin/certificates/[id]/publish` — Transitions draft certificate to `active`.
  - `POST /api/admin/certificates/[id]/revoke` — Transitions active certificate to `revoked` with public explanation.
  - `GET /api/admin/certificates/[id]/qr` — Generates and downloads the standalone high-res QR code PNG.
  - `GET /api/admin/certificates/[id]/pdf` — Downloads the stamped PDF.

---

## 3. Public Verification URL Format & QR Code

- **Canonical URL**: `https://www.agronavis.in/verify-certificate/{certificateId}`
- **Example**: `https://www.agronavis.in/verify-certificate/AGI-2026-A8F3K2`
- **QR Code**: Standard Model 2 QR code with Medium error correction, pointing directly to the canonical verification URL.
- **Clickable PDF Link**: The PDF footer includes both the scanned QR code and an interactive PDF URI link annotation (`Annot / Subtype / Link`) so clicking the URL in any modern PDF viewer opens the verification page directly.

---

## 4. Certificate ID Generation

- **Format**: `AGI-YYYY-XXXXXX`
  - `AGI`: Agronavis Issuer identifier
  - `YYYY`: Year of issuance (e.g. `2026`)
  - `XXXXXX`: 6-character cryptographically random alphanumeric string (excluding ambiguous characters like 0/O/1/I to prevent transcription errors)
- **Entropy**: Over 1 billion combinations per year with collision detection in the database layer.

---

## 5. Security & Authentication Model

1. **No Public Registration**: Admin accounts cannot be created via the website. Credentials exist exclusively via server-side environment variables.
2. **Password Security**: Passwords are verified using `bcrypt` (recommended cost factor 12).
3. **Session Cookies**: Session tokens are 32-byte cryptographically secure random values signed with HMAC-SHA256 and stored in `httpOnly`, `sameSite=lax`, `secure` cookies.
4. **Endpoint Protection**: Every admin mutation and data retrieval route invokes `requireAuth()`, which verifies session validity on the server before accessing database or storage.
5. **No Data Leakage**: Draft certificates are completely invisible on public endpoints. Revoked certificates display the revoked banner and public explanation, but cannot be modified or re-activated by public visitors.
6. **Deletion Invariant**: Published or revoked certificates can never be deleted from the database, guaranteeing a permanent audit trail.

---

## 6. Document Storage & Database Persistence

- **Database**: `data/certificates.json` (configurable via `CERT_DB_PATH`). Uses atomic async write locking (`withLock`) to prevent race conditions and concurrent write corruptions.
- **PDF Storage**: `data/certificates/` (configurable via `CERT_STORAGE_DIR`). Stored with SHA-256 integrity checksums.
- **Cloud/Object Storage Migration**: For multi-server or serverless cloud environments (e.g. Vercel without persistent disk or AWS/GCP), the storage provider interface in `lib/certificates/pdf.ts` and database interface in `lib/certificates/db.ts` can be backed by AWS S3 / Cloudflare R2 / Supabase Storage and PostgreSQL / MongoDB without changing any UI or API routes.

---

## 7. Certificate Issuance Workflow

1. **Log in**: Navigate to `/admin` and enter configured administrative credentials.
2. **Create Record**: Click **Issue Certificate** in `/admin/certificates`. Enter recipient name, internship role, department/project, start date, completion date, and issue date. Agronavis, Karan Singh, and CEO are automatically set as the official issuer and signatory.
3. **Upload & Stamp PDF**: Upload the existing recipient PDF certificate. The server validates that the file is a valid PDF (magic bytes `%PDF-`), renders a QR code encoding the production verification URL, stamps the formal verification footer with clickable URL, computes the SHA-256 hash, and saves the file.
4. **Preview & Verify**: Inspect the stamped PDF directly in the admin modal previewer, verify details, and check the QR code.
5. **Publish**: Click **Publish Certificate**. The certificate immediately becomes active and queryable via public verification and QR code scan.
6. **Revoke (if necessary)**: If a certificate must be invalidated, click **Revoke**, provide a public-safe explanation (e.g., "Internship terminated early"), and confirm. The verification page will permanently display a clear revoked status banner.

---

## 8. Environment Variables Configuration

Copy `.env.example` to `.env.local` for local development or configure in your deployment hosting dashboard (e.g. Vercel / Render / Docker):

```bash
# Production Domain
NEXT_PUBLIC_SITE_URL=https://www.agronavis.in

# Certificate Admin Authentication
CERT_ADMIN_USERNAME=admin
# Generate bcrypt hash: node -e "console.log(require('bcryptjs').hashSync('YourStrongPassword', 12))"
CERT_ADMIN_PASSWORD_HASH=$2a$12$EXAMPLE_BCRYPT_HASH_HERE

# Session Secret (min 32 characters)
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
CERT_SESSION_SECRET=YOUR_32_CHAR_RANDOM_HEX_SECRET

# Storage Paths (Optional, defaults to ./data/certificates and ./data/certificates.json)
CERT_STORAGE_DIR=./data/certificates
CERT_DB_PATH=./data/certificates.json
```

---

## 9. Running Tests Locally

Run the automated test suite covering authentication, session signing, ID collision resistance, PDF stamping, QR generation, and CRUD lifecycles:

```bash
npm test
```

Run linter:
```bash
npm run lint
```

Run production build:
```bash
npm run build
```
