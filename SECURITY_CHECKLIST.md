# Pre-launch Security Checklist

Use this checklist before every production launch or domain change. Do not commit real credentials or private values.

## Required Vercel Environment Variables

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `SESSION_SECRET`

## Secrets

- Generate `ADMIN_PASSWORD_HASH` with bcrypt and store only the hash in Vercel.
- Use a unique `SESSION_SECRET` with at least 32 random characters.
- Keep all production values out of Git, build logs, screenshots, and client-side code.
- Rotate `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, and `DATABASE_URL` if any real value was shared or committed.
- Use separate credentials for production and preview deployments unless preview access to production data is intentional.

## Domain And HTTPS

- Set `NEXT_PUBLIC_SITE_URL` to the final canonical HTTPS `.mk` domain.
- Confirm HTTP redirects to HTTPS.
- Confirm `www` and non-`www` resolve consistently to the intended canonical domain.
- Confirm Vercel has issued a valid TLS certificate for the domain.
- Confirm security headers are present in production, including CSP, HSTS, `nosniff`, referrer policy, permissions policy, and frame blocking.

## Database And Migrations

- Confirm the production database is not publicly accessible except through the required managed connection endpoint.
- Run migrations through the approved deployment process before switching traffic.
- Do not run destructive migration or reset commands against production.
- Take a database backup before launch and before future schema changes.
- Confirm `prisma/migrations` is committed and matches the production migration history.

## Admin Authentication

- Confirm `/admin/login` loads but is marked `noindex,nofollow`.
- Confirm `/admin/dashboard` redirects unauthenticated visitors to `/admin/login`.
- Confirm `/admin/submissions/[id]` redirects unauthenticated visitors to `/admin/login`.
- Confirm a valid administrator can log in with the configured email and password.
- Confirm logout clears the admin session and prevents returning to admin pages without logging in again.
- Confirm repeated failed login attempts are rate limited.

## Authorization

- Confirm all admin Server Actions require an authenticated admin session.
- Confirm unauthenticated requests cannot edit, delete, or view submissions.
- Confirm invalid submission IDs are rejected or return not found.
- Confirm deleting a submission requires opening the confirmation dialog and submitting the form.

## Public Forms

- Submit one valid question and confirm it appears only in the admin dashboard.
- Submit one valid problem report and confirm it appears only in the admin dashboard.
- Confirm malformed email addresses, invalid Macedonian phone numbers, empty required fields, and oversized text are rejected.
- Confirm submitted HTML such as `<script>alert(1)</script>` displays only as text in admin views.
- Confirm the honeypot field blocks automated submissions without affecting normal users.
- Confirm the public form rate limit does not block normal manual use.

## Personal Data

- Confirm names, emails, phone numbers, and message bodies are not rendered on public pages.
- Confirm personal data is not included in metadata, JSON-LD, sitemap, robots, client bundles, analytics, or public API responses.
- Confirm production logs do not contain full submission bodies, credentials, or database URLs.
- Confirm admin pages are excluded from sitemap and blocked from indexing.

## Final Verification

- Run `npm run build`.
- Run `npm test`.
- Run the TypeScript check.
- Run `npm audit` and review unresolved issues.
- Verify `/robots.txt`, `/sitemap.xml`, `/icon.png`, and `/apple-icon.png`.
- Verify the SMS reply button still opens an `sms:` link with an encoded message on a mobile device.
- Review Vercel deployment logs for missing environment variables or leaked secrets.
