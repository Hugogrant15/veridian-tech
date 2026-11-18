// Files a visitor attaches to an IT supply quote request (a BOQ, a spec sheet, an RFQ).
// They go ONLY to the office copy of the enquiry, never to the visitor's
// acknowledgement, so the form can never be used to send files to strangers.
//
// Each file is checked by its contents, not just its name: a renamed program fails.
// Limits come from src/config/enquiry-options.json, shared with the form.

import OPTIONS from "../src/config/enquiry-options.json" with { type: "json" };

const MB = 1024 * 1024;
export const UPLOAD_LIMITS = {
  maxFiles: OPTIONS.uploads.maxFiles,
  maxFileBytes: OPTIONS.uploads.maxFileMB * MB,
  maxTotalBytes: OPTIONS.uploads.maxTotalMB * MB,
};

const startsWith = (bytes, signature) => signature.every((b, i) => bytes[i] === b);
const ZIP = [0x50, 0x4b, 0x03, 0x04]; // .xlsx and .docx are zip files
const OLE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]; // legacy .xls

/** Allowed types: the extension decides what the contents must look like. */
const TYPES = {
  pdf: { mime: "application/pdf", ok: (b) => startsWith(b, [0x25, 0x50, 0x44, 0x46]) },
  png: { mime: "image/png", ok: (b) => startsWith(b, [0x89, 0x50, 0x4e, 0x47]) },
  jpg: { mime: "image/jpeg", ok: (b) => startsWith(b, [0xff, 0xd8, 0xff]) },
  jpeg: { mime: "image/jpeg", ok: (b) => startsWith(b, [0xff, 0xd8, 0xff]) },
  xlsx: { mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ok: (b) => startsWith(b, ZIP) },
  docx: { mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ok: (b) => startsWith(b, ZIP) },
  xls: { mime: "application/vnd.ms-excel", ok: (b) => startsWith(b, OLE) },
  // Plain text: no NUL bytes in the first 4 KB.
  csv: { mime: "text/csv", ok: (b) => !b.subarray(0, 4096).includes(0) },
};

/** A safe file name: letters, digits, spaces, dots, dashes and underscores; the real extension kept. */
export function cleanFileName(name, ext) {
  const base = String(name).replace(/\.[^.]*$/, "").replace(/[^\w .-]+/g, "_").replace(/\s+/g, " ").trim().slice(0, 80);
  return `${base || "attachment"}.${ext}`;
}

function toBase64(bytes) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(binary);
}

/**
 * Checks the uploaded files and turns them into Mailjet attachments.
 * @param files  File objects from the request's form data
 * @returns { attachments, names, error } where error is a message for the visitor, or ""
 */
export async function checkAttachments(files) {
  const list = files.filter((f) => f && typeof f === "object" && f.size > 0);
  if (list.length === 0) return { attachments: [], names: [], error: "" };
  if (list.length > UPLOAD_LIMITS.maxFiles) return { attachments: [], names: [], error: `Attach up to ${UPLOAD_LIMITS.maxFiles} files.` };

  let total = 0;
  const attachments = [];
  const names = [];
  for (const file of list) {
    const ext = String(file.name).split(".").pop().toLowerCase();
    const type = TYPES[ext];
    if (!type) return { attachments: [], names: [], error: "Attach PDF, Excel, Word, CSV, JPG or PNG files only." };
    if (file.size > UPLOAD_LIMITS.maxFileBytes) return { attachments: [], names: [], error: `Each file must be ${OPTIONS.uploads.maxFileMB} MB or smaller.` };
    total += file.size;
    if (total > UPLOAD_LIMITS.maxTotalBytes) return { attachments: [], names: [], error: `Attachments must add up to ${OPTIONS.uploads.maxTotalMB} MB or less.` };
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!type.ok(bytes)) return { attachments: [], names: [], error: `"${cleanFileName(file.name, ext)}" is not a real ${ext.toUpperCase()} file.` };
    const filename = cleanFileName(file.name, ext);
    names.push(filename);
    attachments.push({ ContentType: type.mime, Filename: filename, Base64Content: toBase64(bytes) });
  }
  return { attachments, names, error: "" };
}
