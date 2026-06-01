import React, { useEffect, useMemo, useRef, useState } from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

export const toDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const parseDateKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const formatDisplayDate = (key: string) => {
  const d = parseDateKey(key);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

interface DateRangeCalendarProps {
  dateFrom: string;
  dateTo: string;
  onChange: (from: string, to: string) => void;
}

export const DateRangeCalendar: React.FC<DateRangeCalendarProps> = ({ dateFrom, dateTo, onChange }) => {
  const [viewDate, setViewDate] = useState(() =>
    dateFrom ? parseDateKey(dateFrom) : new Date(2026, 5, 1),
  );

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

  const rangeLabel = useMemo(() => {
    if (dateFrom && dateTo) return `${formatDisplayDate(dateFrom)} – ${formatDisplayDate(dateTo)}`;
    if (dateFrom) return formatDisplayDate(dateFrom);
    return "Select start and end dates";
  }, [dateFrom, dateTo]);

  const isInRange = (dateKey: string) => {
    if (!dateFrom) return false;
    const d = parseDateKey(dateKey).getTime();
    const from = parseDateKey(dateFrom).getTime();
    if (!dateTo) return d === from;
    const to = parseDateKey(dateTo).getTime();
    const min = Math.min(from, to);
    const max = Math.max(from, to);
    return d >= min && d <= max;
  };

  const isRangeEnd = (dateKey: string) => dateKey === dateFrom || dateKey === dateTo;

  const handleDayClick = (dateKey: string) => {
    if (!dateFrom || (dateFrom && dateTo)) {
      onChange(dateKey, "");
      return;
    }
    const fromTime = parseDateKey(dateFrom).getTime();
    const clickTime = parseDateKey(dateKey).getTime();
    if (clickTime < fromTime) {
      onChange(dateKey, dateFrom);
    } else {
      onChange(dateFrom, dateKey);
    }
  };

  const shiftMonth = (delta: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  return (
    <div className="rounded-xl border border-mfneutralsn-200 bg-white p-3">
      <p className="text-[14px] text-mfneutralsn-500 mb-3 text-center">{rangeLabel}</p>

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
              onClick={() => handleDayClick(cell.dateKey)}
              className={`h-9 flex items-center justify-center rounded-lg text-[14px] ${
                isRangeEnd(cell.dateKey)
                  ? "bg-mfprimaryp-400 text-white font-medium"
                  : isInRange(cell.dateKey)
                    ? "bg-mfprimaryp-50 text-mfprimaryp-400"
                    : "text-mfneutralsn-500 active:bg-gray-50"
              }`}
            >
              {cell.day}
            </button>
          ),
        )}
      </div>

      {(dateFrom || dateTo) && (
        <button
          type="button"
          onClick={() => onChange("", "")}
          className="w-full mt-3 py-1.5 rounded-lg text-[14px] text-mfneutralsn-400 active:bg-gray-50"
        >
          Clear dates
        </button>
      )}
    </div>
  );
};

interface DateRangePickerFieldsProps {
  dateFrom: string;
  dateTo: string;
  onChange: (from: string, to: string) => void;
}

export const DateRangePickerFields: React.FC<DateRangePickerFieldsProps> = ({
  dateFrom,
  dateTo,
  onChange,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calendarOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [calendarOpen]);

  const handleRangeChange = (from: string, to: string) => {
    onChange(from, to);
    if (from && to) {
      setCalendarOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative mt-1.5">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setCalendarOpen((v) => !v)}
          className={`h-10 px-3 rounded-lg border bg-white text-left flex items-center gap-2 ${
            calendarOpen ? "border-mfprimaryp-400" : "border-mfneutralsn-200"
          }`}
        >
          <CalendarIcon className="w-4 h-4 text-mfneutralsn-300 flex-shrink-0" />
          <span
            className={`text-[14px] truncate ${
              dateFrom ? "text-mfneutralsn-500" : "text-mfneutralsn-300"
            }`}
          >
            {dateFrom ? formatDisplayDate(dateFrom) : "From"}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setCalendarOpen((v) => !v)}
          className={`h-10 px-3 rounded-lg border bg-white text-left flex items-center gap-2 ${
            calendarOpen ? "border-mfprimaryp-400" : "border-mfneutralsn-200"
          }`}
        >
          <CalendarIcon className="w-4 h-4 text-mfneutralsn-300 flex-shrink-0" />
          <span
            className={`text-[14px] truncate ${
              dateTo ? "text-mfneutralsn-500" : "text-mfneutralsn-300"
            }`}
          >
            {dateTo ? formatDisplayDate(dateTo) : "To"}
          </span>
        </button>
      </div>

      {calendarOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 shadow-lg rounded-xl">
          <DateRangeCalendar dateFrom={dateFrom} dateTo={dateTo} onChange={handleRangeChange} />
        </div>
      )}
    </div>
  );
};
