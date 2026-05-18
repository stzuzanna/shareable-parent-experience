import React, { useState } from "react";
import { FilterIcon } from "lucide-react";

type FilterKey = "all" | "notes" | "forms" | "health";

interface Item {
  title: string;
  meta: string;
  badge?: { label: string; variant: "sign" | "complete" | "ack" | "accident" };
  type: Exclude<FilterKey, "all">;
}

const items: Item[] = [
  { title: "Zyrtec", meta: "21 Feb 2026 · Medication form", badge: { label: "Acknowledge", variant: "ack" }, type: "health" },
  { title: "About me", meta: "21 Feb 2026 · Form", badge: { label: "Sign", variant: "sign" }, type: "forms" },
  { title: "Tobin has been really active lately. We expect...", meta: "21 Feb 2026 · Note", type: "notes" },
  { title: "Curriculum for new year", meta: "21 Feb 2026 · Document", type: "forms" },
  { title: "Enrollment form", meta: "21 Feb 2026 · Form", badge: { label: "Signed", variant: "complete" }, type: "forms" },
  { title: "Emergency contact form", meta: "10 Mar 2026 · Form", badge: { label: "Completed", variant: "complete" }, type: "forms" },
  { title: "Medical history form", meta: "15 Mar 2026 · Form", badge: { label: "Completed", variant: "complete" }, type: "health" },
  { title: "Permission slip", meta: "18 Mar 2026 · Form", badge: { label: "Signed", variant: "complete" }, type: "forms" },
  { title: "Accident report", meta: "21 Feb 2026 · Accident report", badge: { label: "Accident report", variant: "accident" }, type: "health" },
  { title: "Accident report", meta: "21 Feb 2026 · Accident report", badge: { label: "Accident report", variant: "accident" }, type: "health" },
];

const filters: { id: FilterKey; label: string }[] = [
  { id: "all", label: "All" },
  { id: "notes", label: "Notes" },
  { id: "forms", label: "Forms" },
  { id: "health", label: "Health" },
];

const Badge = ({ label, variant }: { label: string; variant: Item["badge"] extends { variant: infer V } ? V : never }) => {
  const styles: Record<string, string> = {
    sign: "bg-mfyellowy-50 border border-mfyellowy-400 text-mfneutralsn-500",
    complete: "bg-green-50 border border-green-500 text-green-700",
    ack: "bg-mfyellowy-50 border border-mfyellowy-400 text-mfneutralsn-500",
    accident: "bg-orange-50 border border-orange-400 text-orange-600",
  };
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ${styles[variant]}`}>
      {label}
    </span>
  );
};

export const PaperworkContent = (): JSX.Element => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const visible = items.filter((it) => activeFilter === "all" || it.type === activeFilter);

  return (
    <div className="flex flex-col bg-mfneutralsn-50 pb-24">
      {/* Filter chips */}
      <div className="flex items-center gap-2 px-4 pb-3 sticky top-[44px] bg-mfneutralsn-50 z-10">
        <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex-shrink-0 h-9 px-3 rounded-full text-[13px] border transition-colors ${
                activeFilter === f.id
                  ? "bg-mfneutralsn-500 text-white border-mfneutralsn-500"
                  : "bg-white text-mfneutralsn-500 border-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center flex-shrink-0">
          <FilterIcon className="w-4 h-4 text-mfneutralsn-400" />
        </button>
      </div>

      {/* Items */}
      <div className="flex flex-col px-2 gap-2">
        {visible.map((it, idx) => (
          <div
            key={`${it.title}-${idx}`}
            className="flex items-center justify-between gap-3 px-4 py-3 bg-white border border-mfprimaryp-100 rounded-xl"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-mfneutralsn-500 truncate">{it.title}</p>
              <p className="text-xs text-mfneutralsn-300 mt-0.5 truncate">{it.meta}</p>
            </div>
            {it.badge && <Badge label={it.badge.label} variant={it.badge.variant} />}
          </div>
        ))}
        {visible.length === 0 && (
          <div className="py-12 px-8 text-center text-sm text-mfneutralsn-300">
            No items match this filter.
          </div>
        )}
      </div>
    </div>
  );
};
