# JIDOKA website — deployment runbook

**Platform:** Netlify, building from GitHub `ss-ubiq/Jidoka`, branch `main`.
**Live:** https://jidoka.in · **Rebuilt:** 12 September 2026

> This replaces the earlier VPS plan, which was abandoned and described a deployment that
> never existed. Do not follow any older copy of this file.

---

## 1. How a release happens

```
merge to main → GitHub push → Netlify build (pnpm build) → live in ~2–4 minutes
```

Netlify builds automatically on every push to `main`. `netlify.toml` overrides the Netlify
dashboard's build settings, so it is the file to change — not the UI.

**GitHub Actions (`.github/workflows/ci.yml`) runs the same checks, but it does not
currently block the Netlify deploy.** Netlify starts building as soon as the push lands,
in parallel with CI. See §6 for how to close that gap — it is an owner action in the
GitHub and Netlify dashboards, not something this repository can configure by itself.

---

## 2. Before you release

Run locally and require all four to pass:

```bash
pnpm verify        # typecheck + lint + test + build
```

Then check the things automation cannot:

| Check | How |
|---|---|
| Enquiry delivery works | Submit a test enquiry against a preview deploy and confirm it arrives in the destination inbox **with its attachment**. |
| Catalogue downloads resolve | Open two or three catalogue PDFs. A 200 that returns an HTML error page is not a PDF. |
| Both configurators load | `/tools/shaft-configurator` and `/tools/component-configurator`, framed, on a phone-width viewport. |
| Legal pages | Confirm privacy and terms still describe what the code does, if either changed. |

---

## 3. Environment variables

Set in **Netlify → Site configuration → Environment variables**. Never in `netlify.toml`,
never in the repository.

### Required in production

| Variable | Why it is required |
|---|---|
| `SMTP_HOST`, `SMTP_PORT` | Without these the site has **no delivery destination** and `/api/enquiry` correctly refuses every enquiry with a 503. This is the single most important production setting. |
| `SMTP_USER`, `SMTP_PASS` | Authentication for the above. |
| `RFQ_TO` | Destination mailbox. Defaults to `info@jidoka.in`. |
| `EMAIL_FROM` | Envelope sender. Must be an address the SMTP account is allowed to send as, or the provider will reject the message. |
| `NEXT_PUBLIC_CATALOGUE_BASE` | Build-time. Rewrites `/catalogues/*.pdf` onto the GitHub release asset host, because the 52 PDFs (~2.0 GB) are not in the repository. Without it every catalogue link 404s. |

### Optional

| Variable | Effect if unset |
|---|---|
| `RFQ_FORWARD_URL`, `RFQ_FORWARD_TOKEN` | No Branch 1 lead forwarding. Email alone is then the delivery path. |
| `ANALYTICS_FORWARD_URL` | Events are logged rather than forwarded to a self-hosted sink. |
| `NEXT_PUBLIC_JIDOKA_EMAIL` / `_PHONE` / `_WHATSAPP`, `NEXT_PUBLIC_MAPS_QUERY` | Falls back to the confirmed contact details compiled into `lib/site.ts`. |
| `ENQUIRY_DEV_SINK` | Local development only. **Refused in production by design** — a developer sink that silently became the live delivery path is exactly the failure mode this codebase now guards against. |

**Build-time vs runtime:** anything prefixed `NEXT_PUBLIC_` is inlined at build time, so
changing it requires a redeploy, not just a restart. `SMTP_*` and `RFQ_*` are read per
request and take effect on the next invocation.

---

## 4. Platform limits that shape the code

| Limit | Value | Where it matters |
|---|---|---|
| Buffered request/response | 6 MB | `/api/enquiry` accepts multipart uploads. |
| Effective **binary** request | **~4.5 MB** (Base64 adds ~30%) | Why `lib/uploads.ts` caps uploads at 3 MB per file / 3.5 MB total / 5 files. |
| Synchronous execution | 60 s | SMTP and the Branch 1 forward are bounded well inside this. |

Source: [Netlify function configuration](https://docs.netlify.com/build/functions/configuration/).

Raising the upload limit is **not** a matter of changing the constant — the platform
rejects the request before the function runs, returning an HTML error page rather than our
JSON. Supporting larger files means uploading directly to private storage with short-lived
scoped credentials, which is provisioning work.

---

## 5. Smoke test after deploying

Against the deployed URL, not localhost:

1. `/` loads; header, search and the family carousel work.
2. `/products/linear-motion-and-bearings` → a product page → its catalogue PDF downloads
   and opens as a PDF.
3. `/tools/shaft-configurator` opens on **"choose a family"**, not a pre-built part number.
4. Build a part number, add two different ones, check the quotation list shows two rows.
5. Hand off to `/request-a-quote` — two separate rows, each with its own quantity.
6. Submit a test enquiry with a small attachment. Confirm:
   - a reference is shown;
   - the email arrives **with the attachment**;
   - each part code is its own row in that email.
7. `/privacy` and `/terms` render the real policies.
8. A deliberately bad URL returns a real 404, not a 200 error page.

If step 6 does not produce an email, the deployment is **not** ready for customers: the
site will correctly refuse enquiries, which is safe but useless.

---

## 6. Gating deploys on CI (owner action)

Today a push to `main` deploys regardless of whether CI passed. To close that:

1. **GitHub → Settings → Branches → add a rule for `main`:** require pull requests, and
   require the `verify` status check to pass.
2. **Netlify → Site configuration → Build & deploy → Continuous deployment:** either
   set the production branch to deploy only from merged PRs, or enable "Require approval"
   for production deploys.

Until both are in place, treat a green CI badge as information, not a gate.

---

## 7. Rollback

Netlify keeps every previous deploy.

1. **Netlify → Deploys**, find the last known-good deploy.
2. **Publish deploy** — takes effect within seconds, no rebuild.
3. Then fix forward in the repository; a published rollback is undone by the next push to
   `main`, so land the fix or re-lock the deploy.

Record the good revision before releasing so the rollback target is not guesswork.

---

## 8. Catalogue PDFs

The 52 catalogue PDFs (~2.0 GB) are release assets on tag `catalogues-v1`, not repository
files. `catalogueHref()` in `lib/utils.ts` rewrites `/catalogues/<CODE>.pdf` onto
`NEXT_PUBLIC_CATALOGUE_BASE`. To publish a new or corrected catalogue: upload it to the
release under the same filename, then redeploy so the rewrite picks it up.

---

## 9. Owner actions still outstanding

- Configure `SMTP_*` in Netlify and confirm one test enquiry arrives with its attachment.
- Set branch protection and deploy gating (§6).
- Google Search Console verification and sitemap submission.
- Decide whether to add `ec.jidoka.in` as a domain alias so the legacy 301 map catches the
  old shop's indexed URLs.
- Approve the privacy and terms drafts, which currently carry a "pending approval" banner.
