import { useId, useRef, useState, type DragEvent } from "react";
import { FileText, Paperclip, X } from "lucide-react";
import OPTIONS from "../config/enquiry-options.json";

const { maxFiles, maxFileMB, maxTotalMB, accept } = OPTIONS.uploads;
const MB = 1024 * 1024;

const sizeLabel = (bytes: number) => (bytes >= MB ? `${(bytes / MB).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

/**
 * Checks a new set of files against the shared limits (the Worker checks again,
 * including the file contents). Returns an error for the visitor, or "".
 */
function uploadError(files: File[]): string {
  if (files.length > maxFiles) return `Attach up to ${maxFiles} files.`;
  for (const file of files) {
    const ext = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
    if (!accept.includes(ext)) return `"${file.name}" isn't a PDF, Excel, Word, CSV, JPG or PNG file.`;
    if (file.size > maxFileMB * MB) return `"${file.name}" is over ${maxFileMB} MB.`;
  }
  if (files.reduce((sum, f) => sum + f.size, 0) > maxTotalMB * MB) return `Attachments must add up to ${maxTotalMB} MB or less.`;
  return "";
}

/** Drag-and-drop or tap-to-choose upload for a list, BOQ or RFQ. */
export function FileDrop({
  files,
  onChange,
  error,
  tone = "light",
}: {
  files: File[];
  onChange: (files: File[], error: string) => void;
  error?: string;
  tone?: "light" | "dark";
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const dark = tone === "dark";

  const add = (incoming: FileList | null) => {
    if (!incoming?.length) return;
    // Ignore a file already in the list (same name and size).
    const fresh = [...incoming].filter((f) => !files.some((x) => x.name === f.name && x.size === f.size));
    const next = [...files, ...fresh];
    const problem = uploadError(next);
    onChange(problem ? files : next, problem);
    if (input.current) input.current.value = "";
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setOver(false);
    add(e.dataTransfer.files);
  };

  return (
    <div>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed px-4 py-6 text-center transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
          over
            ? "border-emerald bg-emerald/5"
            : dark
              ? "border-pearl/25 hover:border-gold/70"
              : "border-line bg-white hover:border-emerald/60"
        }`}
      >
        <Paperclip size={22} className={dark ? "text-gold-light" : "text-emerald-deep"} aria-hidden="true" />
        <span className={`font-medium ${dark ? "text-pearl" : "text-ink"}`}>
          Drop your list here, or <span className={`underline ${dark ? "text-gold-light" : "text-emerald-deep"}`}>choose a file</span>
        </span>
        <span className={`text-sm ${dark ? "text-sage" : "text-muted"}`}>
          PDF, Excel, Word, CSV, JPG or PNG · up to {maxFiles} files, {maxFileMB} MB each
        </span>
        <input
          ref={input}
          id={id}
          type="file"
          multiple
          accept={accept.join(",")}
          onChange={(e) => add(e.target.files)}
          className="sr-only"
        />
      </label>

      {files.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {files.map((file) => (
            <li
              key={`${file.name}-${file.size}`}
              className={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm ${dark ? "border-pearl/20 text-pearl" : "border-line bg-white text-ink"}`}
            >
              <FileText size={18} className={dark ? "text-gold-light" : "text-emerald-deep"} aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
              <span className={dark ? "text-sage" : "text-muted"}>{sizeLabel(file.size)}</span>
              <button
                type="button"
                onClick={() => onChange(files.filter((f) => f !== file), "")}
                aria-label={`Remove ${file.name}`}
                className={`flex size-7 items-center justify-center rounded-md ${dark ? "hover:bg-pearl/10" : "hover:bg-pearl"}`}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className={`mt-2 text-sm ${dark ? "text-gold-light" : "text-red-700"}`}>{error}</p>}
    </div>
  );
}
