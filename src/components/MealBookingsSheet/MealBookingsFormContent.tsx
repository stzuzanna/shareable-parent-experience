import React, { useMemo, useRef, useState, useEffect } from "react";
import { XIcon, ChevronLeftIcon, ChevronDownIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useAppToast } from "../../contexts/ToastContext";

interface MealBookingsFormContentProps {
  onClose: () => void;
  onBack?: () => void;
}

const CHILDREN_OPTIONS = ["Abby Freedman", "Amanda Freedman"];

const MEAL_OPTIONS = [
  "Opt in to all meals",
  "Opt out of all meals",
  "Breakfast only",
  "Lunch only",
];

const formatDisplayDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[14px] font-medium text-mfneutralsn-500">
    {children}
    <span className="text-mfredr-400 ml-0.5">*</span>
  </span>
);

export const MealBookingsFormContent: React.FC<MealBookingsFormContentProps> = ({ onClose, onBack }) => {
  const defaultDate = "2026-01-06";
  const [selectedChildren, setSelectedChildren] = useState<string[]>(["Abby Freedman"]);
  const [dateFrom, setDateFrom] = useState(defaultDate);
  const [dateTo, setDateTo] = useState(defaultDate);
  const [mealOption, setMealOption] = useState("Opt out of all meals");
  const [childrenOpen, setChildrenOpen] = useState(false);
  const childrenRef = useRef<HTMLDivElement>(null);
  const { showToast } = useAppToast();

  const dateRangeLabel = useMemo(() => {
    const from = formatDisplayDate(dateFrom);
    const to = formatDisplayDate(dateTo);
    return from === to ? from : `${from} – ${to}`;
  }, [dateFrom, dateTo]);

  const canConfirm =
    selectedChildren.length > 0 && dateFrom.length > 0 && dateTo.length > 0 && mealOption.length > 0;

  useEffect(() => {
    if (!childrenOpen) return;
    const handler = (e: MouseEvent) => {
      if (childrenRef.current && !childrenRef.current.contains(e.target as Node)) {
        setChildrenOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [childrenOpen]);

  const toggleChild = (name: string) => {
    setSelectedChildren((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  };

  const removeChild = (name: string) => {
    setSelectedChildren((prev) => prev.filter((c) => c !== name));
  };

  const handleConfirm = () => {
    showToast("Meal preferences saved", "success");
    onClose();
  };

  return (
    <div className="flex flex-col max-h-[min(75vh,560px)] min-h-0">
      <div className="flex items-start gap-2 px-5 pt-2 pb-3 flex-shrink-0">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="w-8 h-8 mt-0.5 flex items-center justify-center rounded-full border border-mfneutralsn-200 text-mfneutralsn-500 active:bg-gray-50 flex-shrink-0"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
        ) : null}
        <div className="flex-1 min-w-0">
          <h2 className="text-[16px] font-semibold text-mfneutralsn-500">Meal bookings</h2>
          <p className="text-[14px] text-mfneutralsn-300 mt-1 leading-snug">
            Opt in or out of scheduled meals. You can edit meals by 5:00pm on the same day.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-mfneutralsn-400 flex-shrink-0"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-5 space-y-5">
        <div ref={childrenRef} className="relative">
          <div className="flex items-center justify-between mb-1.5">
            <RequiredLabel>Children</RequiredLabel>
            <button
              type="button"
              onClick={() => setSelectedChildren([])}
              className="text-[14px] font-medium text-mfprimaryp-400 active:opacity-70"
            >
              Clear
            </button>
          </div>
          <button
            type="button"
            onClick={() => setChildrenOpen((v) => !v)}
            className="w-full min-h-11 px-3 py-2 rounded-xl border border-mfneutralsn-200 bg-white flex items-center gap-2 text-left"
          >
            <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
              {selectedChildren.length === 0 ? (
                <span className="text-[14px] text-mfneutralsn-300">Select children</span>
              ) : (
                selectedChildren.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 rounded-full bg-mfneutralsn-75 text-[14px] text-mfneutralsn-500"
                  >
                    {name.split(" ")[0]}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeChild(name);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.stopPropagation();
                          removeChild(name);
                        }
                      }}
                      className="w-4 h-4 flex items-center justify-center rounded-full text-mfneutralsn-400 active:bg-mfneutralsn-200"
                      aria-label={`Remove ${name}`}
                    >
                      <XIcon className="w-3 h-3" />
                    </span>
                  </span>
                ))
              )}
            </div>
            <ChevronDownIcon className="w-4 h-4 text-mfneutralsn-300 flex-shrink-0" />
          </button>
          {childrenOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-lg border border-mfneutralsn-75 z-50 py-1">
              {CHILDREN_OPTIONS.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleChild(name)}
                  className={`w-full text-left px-4 py-2.5 text-[14px] hover:bg-gray-50 ${
                    selectedChildren.includes(name) ? "text-mfprimaryp-400 font-medium" : "text-mfneutralsn-500"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-1.5">
            <RequiredLabel>Choose a date or date range</RequiredLabel>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                if (e.target.value > dateTo) setDateTo(e.target.value);
              }}
              className="h-10 rounded-xl border-mfneutralsn-200 text-[14px]"
              aria-label="From date"
            />
            <Input
              type="date"
              value={dateTo}
              min={dateFrom}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-10 rounded-xl border-mfneutralsn-200 text-[14px]"
              aria-label="To date"
            />
          </div>
          <p className="text-[14px] text-mfneutralsn-500 px-1">{dateRangeLabel}</p>
        </div>

        <div>
          <div className="mb-1.5">
            <RequiredLabel>Select meals</RequiredLabel>
          </div>
          <div className="relative">
            <select
              value={mealOption}
              onChange={(e) => setMealOption(e.target.value)}
              className="w-full h-11 pl-3 pr-9 rounded-xl border border-mfneutralsn-200 bg-white text-[14px] text-mfneutralsn-500 appearance-none focus:outline-none focus:border-mfprimaryp-400"
            >
              {MEAL_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-4 h-4 text-mfneutralsn-300 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 px-5 pb-6 pt-3 border-t border-mfneutralsn-75 bg-white">
        <button
          type="button"
          disabled={!canConfirm}
          onClick={handleConfirm}
          className={`w-full h-11 rounded-xl text-[14px] font-medium ${
            canConfirm
              ? "bg-mfprimaryp-400 text-white active:opacity-90"
              : "bg-mfneutralsn-75 text-mfneutralsn-300 cursor-not-allowed"
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
