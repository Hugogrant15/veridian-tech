import { Plus } from "lucide-react";
import type { Faq } from "../config/serviceDetails";

/** Questions and answers as native <details>, so they open without JavaScript and in the prerendered page. */
export function Faqs({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="flex flex-col">
      {faqs.map(({ q, a }) => (
        <details key={q} className="group border-t border-line last:border-b">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium text-ink marker:hidden hover:text-emerald-deep [&::-webkit-details-marker]:hidden">
            {q}
            <Plus size={20} className="flex-shrink-0 text-emerald-deep transition-transform group-open:rotate-45" aria-hidden="true" />
          </summary>
          <p className="max-w-3xl pb-6 leading-relaxed text-body">{a}</p>
        </details>
      ))}
    </div>
  );
}
