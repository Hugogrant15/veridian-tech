import { CalendarDays } from "lucide-react";
import OPTIONS from "../config/enquiry-options.json";

export interface Delivery {
  /** One of OPTIONS.states, or "". */
  state: string;
  /** City or area, typed. */
  city: string;
  /** One of OPTIONS.neededBy ids, "date" for a picked date, or "". */
  neededBy: string;
  /** YYYY-MM-DD when neededBy is "date". */
  neededDate: string;
}

/** Today in Lagos as YYYY-MM-DD, the earliest date the calendar offers. */
const todayInLagos = () => new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });

const inputClass =
  "w-full rounded-md border border-line bg-white px-4 py-3 text-ink transition-colors placeholder:text-muted/70 focus:border-emerald focus:outline-none";
const labelClass = "mb-2 block text-sm font-medium text-ink";
const optional = <span className="font-normal text-muted">(optional)</span>;

/**
 * Delivery state (dropdown of the 36 states, FCT and "Several locations"), city or area,
 * and when it is needed: quick choices or a date from the device's own calendar.
 * Shared by the contact form and the order builder; the Worker checks the same lists.
 */
export function DeliveryFields({ value, onChange, idPrefix = "delivery" }: { value: Delivery; onChange: (next: Delivery) => void; idPrefix?: string }) {
  const set = (patch: Partial<Delivery>) => onChange({ ...value, ...patch });
  const chip = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-md border px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
      active ? "border-gold bg-[#FBF8F0] text-ink shadow-[0_0_0_1px_var(--color-gold)]" : "border-line bg-white text-ink hover:border-emerald/50"
    }`;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-state`} className={labelClass}>
            Delivery state {optional}
          </label>
          <select id={`${idPrefix}-state`} value={value.state} onChange={(e) => set({ state: e.target.value })} className={inputClass}>
            <option value="">Choose a state</option>
            {OPTIONS.states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${idPrefix}-city`} className={labelClass}>
            City or area {optional}
          </label>
          <input
            id={`${idPrefix}-city`}
            maxLength={80}
            placeholder="e.g. Ikeja, Lekki"
            value={value.city}
            onChange={(e) => set({ city: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Needed by {optional}</legend>
        <div className="flex flex-wrap gap-2.5">
          {OPTIONS.neededBy.map((o) => (
            <button
              key={o.id}
              type="button"
              aria-pressed={value.neededBy === o.id}
              onClick={() => set({ neededBy: value.neededBy === o.id ? "" : o.id, neededDate: "" })}
              className={chip(value.neededBy === o.id)}
            >
              {o.label}
            </button>
          ))}
          <button type="button" aria-pressed={value.neededBy === "date"} onClick={() => set({ neededBy: value.neededBy === "date" ? "" : "date" })} className={chip(value.neededBy === "date")}>
            <CalendarDays size={16} className="text-emerald-deep" aria-hidden="true" />
            Pick a date
          </button>
        </div>
        {value.neededBy === "date" && (
          <div className="mt-3 max-w-xs">
            <label htmlFor={`${idPrefix}-date`} className="sr-only">
              Date needed by
            </label>
            <input
              id={`${idPrefix}-date`}
              type="date"
              min={todayInLagos()}
              value={value.neededDate}
              onChange={(e) => set({ neededDate: e.target.value })}
              className={inputClass}
            />
          </div>
        )}
      </fieldset>
    </div>
  );
}
