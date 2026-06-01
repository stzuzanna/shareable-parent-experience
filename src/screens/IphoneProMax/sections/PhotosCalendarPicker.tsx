import React, { useEffect, useMemo, useRef, useState } from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

const toDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const parseDateKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

interface PhotosCalendarPickerProps {
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  datesWithPhotos: string[];
  popoverAlign?: "left" | "right";
}

export const PhotosCalendarPicker: React.FC<PhotosCalendarPickerProps> = ({
  selectedDate,
  onSelectDate,
  datesWithPhotos,
  popoverAlign = "left",
}) => {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() =>
    selectedDate ? parseDateKey(selectedDate) : new Date(2026, 4, 20),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const photoDates = useMemo(() => new Set(datesWithPhotos), [datesWithPhotos]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (selectedDate) {
      setViewDate(parseDateKey(selectedDate));
    }
  }, [selectedDate]);

  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: ({ day: number; dateKey: string } | null)[] = [];

    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ day, dateKey: toDateKey(new Date(year, month, day)) });
    }
    return cells;
  }, [viewDate]);

  const shiftMonth = (delta: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  return (
    <div ref={containerRef} className="relative flex-shrink-0">
      <button
        type="button"
        aria-label="Filter photos by date"
        onClick={() => setOpen((v) => !v)}
        className={`relative w-9 h-9 flex items-center justify-center rounded-full border bg-white ${
          selectedDate ? "border-mfprimaryp-400" : "border-mfneutralsn-200"
        }`}
      >
        <CalendarIcon
          className={`w-4 h-4 ${selectedDate ? "text-mfprimaryp-400" : "text-mfneutralsn-400"}`}
        />
        {selectedDate && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-mfprimaryp-400" />
        )}
      </button>

      {open && (
        <div
          className={`absolute top-full mt-1.5 w-[280px] bg-white rounded-xl shadow-lg border border-mfneutralsn-75 z-50 p-3 ${
            popoverAlign === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => shiftMonth(-1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-mfneutralsn-400 active:bg-gray-50"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="text-[14px] font-medium text-mfneutralsn-500">{monthLabel}</span>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => shiftMonth(1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-mfneutralsn-400 active:bg-gray-50"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectDate(null);
              setOpen(false);
            }}
            className={`w-full mb-2 py-1.5 rounded-lg text-[14px] ${
              selectedDate === null
                ? "bg-mfprimaryp-50 text-mfprimaryp-400 font-medium"
                : "text-mfneutralsn-400 active:bg-gray-50"
            }`}
          >
            All dates
          </button>

          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {WEEKDAYS.map((label, i) => (
              <div
                key={`${label}-${i}`}
                className="h-7 flex items-center justify-center text-[14px] text-mfneutralsn-300 font-medium"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {calendarDays.map((cell, i) =>
              cell === null ? (
                <div key={`empty-${i}`} className="h-9" />
              ) : (
                <button
                  key={cell.dateKey}
                  type="button"
                  onClick={() => {
                    onSelectDate(cell.dateKey);
                    setOpen(false);
                  }}
                  className={`h-9 flex flex-col items-center justify-center rounded-lg text-[14px] ${
                    selectedDate === cell.dateKey
                      ? "bg-mfprimaryp-400 text-white font-medium"
                      : "text-mfneutralsn-500 active:bg-gray-50"
                  }`}
                >
                  <span>{cell.day}</span>
                  {photoDates.has(cell.dateKey) && (
                    <span
                      className={`w-1 h-1 rounded-full mt-0.5 ${
                        selectedDate === cell.dateKey ? "bg-white" : "bg-mfprimaryp-400"
                      }`}
                    />
                  )}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};
