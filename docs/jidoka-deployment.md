# JIDOKA Website — Go-Live / Deployment Guide

Goal: get the site public **fast and safely**. The app is production-ready; launch is three things: **RFQ delivery**, **contact details**, **hosting**.

---

## ★ YOUR PATH — self-hosted + company SMTP (chosen)

**On your server (Node 20+):**
```bash
# 1. get the code + catalogues:
#    git clone https://github.com/ss-ubiq/Jidoka.git
#    Download ALL 52 PDF assets from the release
#    https://github.com/ss-ubiq/Jidoka/releases/tag/catalogues-v1
#    into public/catalogues/  (file names already match what the site expects).
#    (Or copy the project + public/catalogues/ directly from the office PC.)
# 2. create .env  (see the block below), then:
pnpm install
pnpm build
pnpm start                 # serves on http://<server>:3100
# 3. keep it running:
pnpm add -g pm2 && pm2 start "pnpm start" --name jidoka-web && pm2 save
# 4. put nginx/Caddy in front for HTTPS on your domain (reverse-proxy → 127.0.0.1:3100)
```

**`.env` you must fill (company SMTP):**
```bash
NEXT_PUBLIC_JIDOKA_EMAIL=sales@jidoka.in
NEXT_PUBLIC_JIDOKA_PHONE=+91XXXXXXXXXX
NEXT_PUBLIC_JIDOKA_WHATSAPP=91XXXXXXXXXX          # digits only, incl. country code, no +

SMTP_HOST=mail.yourcompany.com                     # your company mail server
SMTP_PORT=465                                       # 465 (SSL) or 587 (STARTTLS)
SMTP_USER=website@jidoka.in
SMTP_PASS=**********
RFQ_TO=sales@jidoka.in                              # where enquiries land
EMAIL_FROM="JIDOKA Website <website@jidoka.in>"
```

**Before announcing:** submit a test RFQ and confirm the email + attachment arrive at `RFQ_TO`. That's the one thing that must work on day one.

---

## 0. Launch checklist (in priority order)

1. **RFQ delivery works** (email) — ✅ code ready; set `SMTP_*` + `RFQ_TO` in `.env`. Without this, enquiries only log. **Do this first.**
2. **Real contact details** — set `NEXT_PUBLIC_JIDOKA_EMAIL`, `NEXT_PUBLIC_JIDOKA_PHONE`, `NEXT_PUBLIC_JIDOKA_WHATSAPP` (and confirm office address wording for footer/contact).
3. **Deploy** the app + `public/catalogues/` (1.86 GB) — see options below.
4. Point a domain/subdomain at it (recommend a **staging subdomain first**, e.g. `new.jidoka.in`).
5. (Post-launch) Populate `data/redirects.ts` from the old jidoka.in URL list; add certifications wording once confirmed.

## 1. Environment (`.env`)

```bash
NEXT_PUBLIC_JIDOKA_EMAIL=sales@jidoka.in
NEXT_PUBLIC_JIDOKA_PHONE=+91XXXXXXXXXX
NEXT_PUBLIC_JIDOKA_WHATSAPP=91XXXXXXXXXX      # digits only, country code, no +

# RFQ email (Gmail example — use a Google App Password, not the account password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=sales@yourdomain.com
SMTP_PASS=xxxxxxxxxxxxxxxx
RFQ_TO=sales@jidoka.in
EMAIL_FROM="JIDOKA Website <sales@yourdomain.com>"

# Optional later:
# RFQ_FORWARD_URL=   ANALYTICS_FORWARD_URL=
```

## 2. Build

```bash
pnpm install
pnpm build
pnpm start          # serves on :3100
```

## 3. Hosting options (pick one)

### A. Self-host on a VPS / own server — RECOMMENDED (fits the 1.86 GB PDFs + self-host ethos)
- Node 20+ box (e.g. a small VPS). `pnpm install && pnpm build`.
- Run with a process manager: `pm2 start "pnpm start" --name jidoka-web` (keeps it alive/restarts).
- Put **nginx/Caddy** in front for TLS + gzip. The `public/catalogues/` PDFs are served by Next (already long-cached, `immutable`).
- DNS: point the domain/subdomain A record at the server.

### B. Node platform (Render / Railway / Fly / self-hosted Coolify)
- Same build; the platform runs `pnpm start`. Ensure the 1.86 GB `public/catalogues/` is included in the deploy (git-ignored today — either un-ignore for this host, or use option C).

### C. Serverless (Vercel/Netlify) — only if PDFs move to object storage
- Serverless bundles can't carry 1.86 GB. Move `public/catalogues/*` to S3/R2/Backblaze (all have free/cheap tiers) and change `catalogueFile` to the bucket URL in `data/products.ts` (one field). Then deploy the app serverless.

## 4. PDFs

- They live in `public/catalogues/<CODE>.pdf` (git-ignored). For options A/B, copy that folder to the server (`scp`/`rsync`). For option C, upload to a bucket.
- Regenerate anytime from `jidoka-pdfs-unique.zip` with the extraction step (see implementation notes).

## 5. Safe cutover

1. Deploy to a **staging subdomain** and click through: homepage, a few product pages + PDF downloads, submit a **test RFQ** and confirm the email arrives with the attachment.
2. Populate `data/redirects.ts` with the old→new URL map (keeps SEO).
3. Switch the main domain (or keep the subdomain and link from the current site) once verified.

## 6. Pre-launch smoke test

```
GET  /                                  200
GET  /products/springs-and-force-components/springs   200
GET  /catalogues/JID-SPRINGS.pdf        200 (application/pdf)
POST /api/enquiry (test)                → email received with attachment + reference
```
