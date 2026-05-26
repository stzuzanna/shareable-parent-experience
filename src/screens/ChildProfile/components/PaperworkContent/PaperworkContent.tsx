import React, { useMemo, useState } from "react";
import { ChevronRightIcon, FilterIcon, XIcon, SearchIcon, CheckIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FilterKey = "all" | "notes" | "forms" | "health";

interface Item {
  title: string;
  meta: string;
  badge?: { label: string; variant: "sign" | "complete" | "ack" | "accident" };
  type: Exclude<FilterKey, "all">;
}

const items: Item[] = [
  // Awaiting action — yellow pills, shown first
  { title: "Zyrtec", meta: "21 Feb 2026 · Medication form", badge: { label: "Acknowledge", variant: "ack" }, type: "health" },
  { title: "About me", meta: "21 Feb 2026 · Form", badge: { label: "Sign", variant: "sign" }, type: "forms" },
  { title: "Field trip consent", meta: "18 Feb 2026 · Form", badge: { label: "Sign", variant: "sign" }, type: "forms" },
  { title: "Photo release", meta: "12 Feb 2026 · Form", badge: { label: "Acknowledge", variant: "ack" }, type: "forms" },

  // Done / informational — green pills or no pill
  { title: "Enrollment form", meta: "21 Feb 2026 · Form", badge: { label: "Signed", variant: "complete" }, type: "forms" },
  { title: "Emergency contact form", meta: "10 Mar 2026 · Form", badge: { label: "Completed", variant: "complete" }, type: "forms" },
  { title: "Medical history form", meta: "15 Mar 2026 · Form", badge: { label: "Completed", variant: "complete" }, type: "health" },
  { title: "Permission slip", meta: "18 Mar 2026 · Form", badge: { label: "Signed", variant: "complete" }, type: "forms" },
  { title: "Allergy plan", meta: "4 Feb 2026 · Form", badge: { label: "Completed", variant: "complete" }, type: "health" },
  { title: "Updated care contract", meta: "21 Feb 2026 · Form", badge: { label: "Signed", variant: "complete" }, type: "forms" },

  // No pill
  { title: "Abby has been really active lately. We expect...", meta: "21 Feb 2026 · Note", type: "notes" },
  { title: "Settling in observations", meta: "8 Feb 2026 · Note", type: "notes" },
  { title: "Curriculum for new year", meta: "21 Feb 2026 · Document", type: "forms" },
  { title: "Summer programme overview", meta: "1 Feb 2026 · Document", type: "forms" },
  { title: "Accident report", meta: "21 Feb 2026 · Accident report", type: "health" },
  { title: "Accident report", meta: "9 Jan 2026 · Accident report", type: "health" },
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
    <span className={`text-[11px] px-2 h-[20px] inline-flex items-center rounded-full whitespace-nowrap leading-none ${styles[variant]}`}>
      {label}
    </span>
  );
};

const Pill = ({ label, selected, onClick }: { label: string; selected?: boolean; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 h-9 px-3.5 rounded-full text-[14px] leading-none border transition-colors ${
      selected
        ? "bg-mfprimaryp-400 text-white border-mfprimaryp-400"
        : "bg-white text-mfneutralsn-500 border-mfneutralsn-200"
    }`}
  >
    {label}
  </button>
);

type StatusKey = "Sign" | "Acknowledge" | "Signed" | "Completed";
const ALL_STATUSES: StatusKey[] = ["Sign", "Acknowledge", "Signed", "Completed"];

const MONTH_INDEX: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

const parseMetaDate = (meta: string): Date | null => {
  const m = meta.match(/^(\d{1,2})\s+(\w{3})\s+(\d{4})/);
  if (!m) return null;
  const month = MONTH_INDEX[m[2]];
  if (month === undefined) return null;
  return new Date(parseInt(m[3], 10), month, parseInt(m[1], 10));
};

export const PaperworkContent = (): JSX.Element => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statuses, setStatuses] = useState<Set<StatusKey>>(new Set());

  const isFiltered = activeFilter !== "all";
  const advancedActive =
    query.trim() !== "" || dateFrom !== "" || dateTo !== "" || statuses.size > 0;

  const visible = useMemo(() => {
    return items.filter((it) => {
      if (activeFilter !== "all" && it.type !== activeFilter) return false;
      if (query.trim() && !it.title.toLowerCase().includes(query.trim().toLowerCase()) && !it.meta.toLowerCase().includes(query.trim().toLowerCase())) {
        return false;
      }
      if (statuses.size > 0) {
        if (!it.badge) return false;
        if (!statuses.has(it.badge.label as StatusKey)) return false;
      }
      if (dateFrom || dateTo) {
        const d = parseMetaDate(it.meta);
        if (!d) return false;
        if (dateFrom && d < new Date(dateFrom)) return false;
        if (dateTo && d > new Date(dateTo)) return false;
      }
      return true;
    });
  }, [activeFilter, query, dateFrom, dateTo, statuses]);

  const activeLabel = filters.find((f) => f.id === activeFilter)?.label ?? "All";

  const clearAdvanced = () => {
    setQuery("");
    setDateFrom("");
    setDateTo("");
    setStatuses(new Set());
  };

  const toggleStatus = (s: StatusKey) => {
    setStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  return (
    <div className="flex flex-col bg-white pb-24 pt-4">
      {/* Filter pills */}
      <div className="flex items-center gap-2 px-4 pb-6 bg-white">
        {isFiltered ? (
          <>
            <button
              onClick={() => setActiveFilter("all")}
              aria-label="Clear filter"
              className="flex-shrink-0 w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center"
            >
              <XIcon className="w-4 h-4 text-mfneutralsn-500" />
            </button>
            <Pill label={activeLabel} selected />
            <button
              aria-label="More filters"
              onClick={() => setShowFilterSheet(true)}
              className={`relative flex-shrink-0 w-9 h-9 ml-auto rounded-full border bg-white flex items-center justify-center ${
                advancedActive ? "border-mfprimaryp-400" : "border-mfneutralsn-200"
              }`}
            >
              <FilterIcon className={`w-4 h-4 ${advancedActive ? "text-mfprimaryp-400" : "text-mfneutralsn-400"}`} />
              {advancedActive && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-mfprimaryp-400" />
              )}
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar">
              {filters.map((f) => (
                <Pill
                  key={f.id}
                  label={f.label}
                  selected={activeFilter === f.id}
                  onClick={() => setActiveFilter(f.id)}
                />
              ))}
            </div>
            <button
              aria-label="More filters"
              onClick={() => setShowFilterSheet(true)}
              className={`relative flex-shrink-0 w-9 h-9 rounded-full border bg-white flex items-center justify-center ${
                advancedActive ? "border-mfprimaryp-400" : "border-mfneutralsn-200"
              }`}
            >
              <FilterIcon className={`w-4 h-4 ${advancedActive ? "text-mfprimaryp-400" : "text-mfneutralsn-400"}`} />
              {advancedActive && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-mfprimaryp-400" />
              )}
            </button>
          </>
        )}
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2 px-[8.5px]">
        {visible.map((it, idx) => (
          <button
            key={`${it.title}-${idx}`}
            className="flex items-center justify-between gap-3 px-4 py-3 bg-white border border-mfneutralsn-75 rounded-xl text-left active:bg-gray-50"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-mfneutralsn-500 truncate leading-tight">{it.title}</p>
              <p className="text-[12px] text-mfneutralsn-300 mt-1 truncate leading-tight">{it.meta}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {it.badge && <Badge label={it.badge.label} variant={it.badge.variant} />}
              <ChevronRightIcon className="w-5 h-5 text-mfneutralsn-300" />
            </div>
          </button>
        ))}
        {visible.length === 0 && (
          <div className="py-12 px-8 text-center text-sm text-mfneutralsn-300">
            No items match this filter.
          </div>
        )}
      </div>

      <AnimatePresence>
        {showFilterSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40 z-[70]"
              onClick={() => setShowFilterSheet(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[80] max-h-[85%] overflow-y-auto"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-2 pb-4">
                <h2 className="text-[16px] font-medium text-mfneutralsn-500">Filters</h2>
                <button
                  onClick={() => setShowFilterSheet(false)}
                  aria-label="Close"
                  className="w-7 h-7 flex items-center justify-center text-mfneutralsn-400 active:bg-gray-50 rounded-full"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-5 px-5 pb-6">
                {/* Search */}
                <div>
                  <label className="text-[12px] text-mfneutralsn-300">Search</label>
                  <div className="mt-1.5 flex items-center gap-2 h-10 px-3 rounded-lg border border-mfneutralsn-200 bg-white">
                    <SearchIcon className="w-4 h-4 text-mfneutralsn-300" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by name or text"
                      className="flex-1 text-[14px] text-mfneutralsn-500 bg-transparent focus:outline-none placeholder:text-mfneutralsn-300"
                    />
                    {query && (
                      <button onClick={() => setQuery("")} aria-label="Clear search">
                        <XIcon className="w-4 h-4 text-mfneutralsn-300" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Date range */}
                <div>
                  <label className="text-[12px] text-mfneutralsn-300">Date range</label>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="h-10 px-3 rounded-lg border border-mfneutralsn-200 bg-white text-[14px] text-mfneutralsn-500 focus:outline-none"
                    />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="h-10 px-3 rounded-lg border border-mfneutralsn-200 bg-white text-[14px] text-mfneutralsn-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="text-[12px] text-mfneutralsn-300">Status</label>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {ALL_STATUSES.map((s) => {
                      const selected = statuses.has(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleStatus(s)}
                          className={`h-9 px-3 rounded-full border text-[13px] flex items-center gap-1.5 ${
                            selected
                              ? "bg-mfprimaryp-400 border-mfprimaryp-400 text-white"
                              : "bg-white border-mfneutralsn-200 text-mfneutralsn-500"
                          }`}
                        >
                          {selected && <CheckIcon className="w-3.5 h-3.5" />}
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={clearAdvanced}
                    className="flex-1 h-11 rounded-lg border border-mfneutralsn-200 bg-white text-[14px] text-mfneutralsn-500"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowFilterSheet(false)}
                    className="flex-1 h-11 rounded-lg bg-mfprimaryp-400 text-white text-[14px] font-medium"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
