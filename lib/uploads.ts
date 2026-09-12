/**
 * One upload contract, enforced in the browser and again on the server.
 *
 * The numbers are set by where this actually runs. Netlify's synchronous functions
 * accept a 6 MB buffered request, and binary payloads are Base64-encoded on the way in,
 * which costs about 30% — an effective ~4.5 MB for a request carrying files
 * (https://docs.netlify.com/build/functions/configuration/). The site previously
 * advertised 25 MB per file with no total and no count limit, which could not work in
 * production: the platform rejects the request before our code sees it, with an error
 * page that isn't even JSON.
 *
 * So the budget below is deliberately conservative, and the form tells visitors how to
 * send anything larger instead of failing them at submit time. Raising it means moving
 * uploads off the function body entirely (direct-to-storage with short-lived scoped
 * credentials) — a real piece of provisioning, not a bigger constant here.
 */

/** Room for the text fields, multipart boundaries and Base64 overhead inside ~4.5 MB. */
export const UPLOAD_MAX_TOTAL_BYTES = 3_500_000;
export const UPLOAD_MAX_FILE_BYTES = 3_000_000;
export const UPLOAD_MAX_FILES = 5;

/** Whole request budget the server refuses to exceed, files plus fields. */
export const REQUEST_MAX_BYTES = 4_000_000;

export const ALLOWED_EXTENSIONS = [
  "pdf", "dwg", "dxf", "step", "stp", "igs", "iges",
  "png", "jpg", "jpeg", "xlsx", "xls", "csv", "zip",
] as const;

const ALLOWED = new Set<string>(ALLOWED_EXTENSIONS);

export function extensionOf(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

export function isAllowedFile(name: string): boolean {
  return ALLOWED.has(extensionOf(name));
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000) {
    const mb = bytes / 1_000_000;
    return `${mb % 1 === 0 ? mb : mb.toFixed(1)} MB`;
  }
  return `${Math.round(bytes / 1000)} KB`;
}

export type UploadCheck = { ok: true } | { ok: false; error: string };

/**
 * The single source of truth for whether a set of files may be submitted. The browser
 * calls it to fail early and kindly; the route calls it again because a browser check is
 * a courtesy, not a control.
 */
export function checkUploads(files: { name: string; size: number }[]): UploadCheck {
  if (files.length > UPLOAD_MAX_FILES) {
    return { ok: false, error: `Please attach at most ${UPLOAD_MAX_FILES} files. You selected ${files.length}.` };
  }
  for (const f of files) {
    if (!isAllowedFile(f.name)) {
      return { ok: false, error: `"${f.name}" is not a file type we can accept.` };
    }
    if (f.size > UPLOAD_MAX_FILE_BYTES) {
      return {
        ok: false,
        error: `"${f.name}" is ${formatBytes(f.size)}. The limit is ${formatBytes(UPLOAD_MAX_FILE_BYTES)} per file — please email larger files to us instead.`,
      };
    }
  }
  const total = files.reduce((n, f) => n + f.size, 0);
  if (total > UPLOAD_MAX_TOTAL_BYTES) {
    return {
      ok: false,
      error: `Those files total ${formatBytes(total)}. The limit is ${formatBytes(UPLOAD_MAX_TOTAL_BYTES)} for one enquiry — please send the rest by email.`,
    };
  }
  return { ok: true };
}
