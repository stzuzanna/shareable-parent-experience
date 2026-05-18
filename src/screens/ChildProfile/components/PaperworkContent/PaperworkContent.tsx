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

const Badge = ({ label, variant }: { label: string; variant: NonNullable<Item["badge"]>["variant"] }) => {
  const styles: Record<string, string> = {
    sign: "bg-mfyellowy-100 border border-mfyellowy-400 text-mfneutralsn-500",
    complete: "bg-green-50 border border-green-500 text-green-700",
    ack: "bg-mfyellowy-100 border border-mfyellowy-400 text-mfneutralsn-500",
    accident: "bg-orange-50 border border-orange-400 text-orange-600",
  };
  return (
    <span className={`text-[11px] px-2 h-[18px] inline-flex items-center rounded-full whitespace-nowrap leading-none ${styles[variant]}`}>
      {label}
    </span>
  );
};

export const PaperworkContent = (): JSX.Element => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const visible = items.filter((it) => activeFilter === "all" || it.type === activeFilter);

  return (
    <div className="flex flex-col bg-white pb-24">
      {/* Filter chips */}
      <div className="flex items-center gap-2 px-[8.5px] pb-3 bg-white">
        <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex-shrink-0 h-9 px-3 rounded-full text-[14px] leading-none border transition-colors ${
                activeFilter === f.id
                  ? "bg-mfprimaryp-100 text-mfprimaryp-400 border-mfprimaryp-400"
                  : "bg-white text-mfneutralsn-500 border-mfneutralsn-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          aria-label="More filters"
          className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0"
        >
          <FilterIcon className="w-4 h-4 text-mfneutralsn-400" />
        </button>
      </div>

      {/* Items */}
      <div className="flex flex-col px-[8.5px]">
        {visible.map((it, idx) => (
          <div
            key={`${it.title}-${idx}`}
            className="flex items-center justify-between gap-3 px-4 py-3 border-t border-mfneutralsn-75 first:border-t-0"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-mfneutralsn-500 truncate leading-tight">{it.title}</p>
              <p className="text-[12px] text-mfneutralsn-300 mt-1 truncate leading-tight">{it.meta}</p>
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
