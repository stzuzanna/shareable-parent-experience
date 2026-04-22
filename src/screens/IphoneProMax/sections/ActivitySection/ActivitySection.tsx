import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

// ── Icons ─────────────────────────────────────────────────────────────────────

const SignOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SignInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="10 17 15 12 10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const NappyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const FoodIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M18 8h1a4 4 0 010 8h-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="1" x2="6" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="10" y1="1" x2="10" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="14" y1="1" x2="14" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SleepIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M10.5 20.5L3.5 13.5a5 5 0 017-7l7 7a5 5 0 01-7 7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────

type ActivityType = "sign-out" | "sign-in" | "nappy" | "food" | "sleep" | "medication";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  detail?: string;
  time: string;
  by: string;
}

const todayActivities: Activity[] = [
  { id: "t1", type: "sign-out", title: "Tobin was signed out", time: "3:20 PM", by: "Anna Müller" },
  { id: "t2", type: "nappy", title: "Nappy change", detail: "Wet", time: "3:20 PM", by: "Anna Müller" },
  { id: "t3", type: "food", title: "Snack", detail: "Salad", time: "2:23 PM", by: "Anna Müller" },
  { id: "t4", type: "sleep", title: "Sleep", detail: "45 min", time: "2:25 PM", by: "Anna Müller" },
  { id: "t5", type: "medication", title: "Insulin", detail: "14 mg was administered", time: "1:26 PM", by: "Laura Becker" },
  { id: "t6", type: "nappy", title: "Nappy change", detail: "Dry", time: "9:02 AM", by: "Anna Müller" },
  { id: "t7", type: "food", title: "Breakfast", detail: "Porridge", time: "8:28 AM", by: "Anna Müller" },
  { id: "t8", type: "sign-in", title: "Tobin was signed in", time: "7:45 AM", by: "Anna Müller" },
];

const yesterdayActivities: Activity[] = [
  { id: "y1", type: "sign-out", title: "Tobin was signed out", time: "3:20 PM", by: "Anna Müller" },
  { id: "y2", type: "nappy", title: "Nappy change", detail: "Wet", time: "3:20 PM", by: "Anna Müller" },
  { id: "y3", type: "food", title: "Lunch", detail: "Pasta with vegetables", time: "12:30 PM", by: "Anna Müller" },
  { id: "y4", type: "sleep", title: "Sleep", detail: "30 min", time: "11:15 AM", by: "John Doe" },
  { id: "y5", type: "nappy", title: "Nappy change", detail: "Dry", time: "9:45 AM", by: "Anna Müller" },
  { id: "y6", type: "sign-in", title: "Tobin was signed in", time: "8:10 AM", by: "Anna Müller" },
];

const sleepHistory = [
  { duration: 45, date: "13 Feb at 1:10 PM", by: "Anna Müller" },
  { duration: 30, date: "12 Feb at 1:15 PM", by: "John Doe" },
  { duration: 60, date: "11 Feb at 12:30 PM", by: "Maria Sanchez" },
  { duration: 90, date: "13 Feb at 1:10 PM", by: "David Kim" },
  { duration: 15, date: "13 Feb at 1:10 PM", by: "Emily Johnson" },
  { duration: 120, date: "13 Feb at 1:10 PM", by: "Michael Chen" },
  { duration: 25, date: "13 Feb at 1:10 PM", by: "Sarah Lee" },
  { duration: 35, date: "13 Feb at 1:10 PM", by: "Tom Brown" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const typeConfig: Record<ActivityType, { icon: React.FC; bg: string; color: string }> = {
  "sign-out": { icon: SignOutIcon, bg: "bg-blue-100", color: "text-blue-500" },
  "sign-in": { icon: SignInIcon, bg: "bg-green-100", color: "text-green-600" },
  "nappy": { icon: NappyIcon, bg: "bg-purple-100", color: "text-purple-500" },
  "food": { icon: FoodIcon, bg: "bg-orange-100", color: "text-orange-500" },
  "sleep": { icon: SleepIcon, bg: "bg-indigo-100", color: "text-indigo-500" },
  "medication": { icon: MedIcon, bg: "bg-red-100", color: "text-red-500" },
};

const allActivityTypes = [
  { id: "all", label: "All types" },
  { id: "sleep", label: "Sleep" },
  { id: "food", label: "Food" },
  { id: "nappy", label: "Nappy" },
  { id: "sign-out", label: "Sign in/out" },
  { id: "medication", label: "Medication" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const ActivityRow = ({ activity }: { activity: Activity }) => {
  const cfg = typeConfig[activity.type];
  const Icon = cfg.icon;
  return (
    <div className="flex items-center gap-3 py-3 px-4 border-b border-gray-50 last:border-0">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
        <Icon />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-semibold text-mfneutralsn-500">{activity.title}</span>
          {activity.detail && (
            <span className="text-sm text-mfneutralsn-400">{activity.detail}</span>
          )}
        </div>
        <p className="text-xs text-mfneutralsn-300">by {activity.by}</p>
      </div>
      <span className="text-xs text-mfneutralsn-300 flex-shrink-0">{activity.time}</span>
    </div>
  );
};

const DateGroup = ({ label, activities, defaultOpen = true }: { label: string; activities: Activity[]; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-4 py-2 w-full text-left"
      >
        <span className="text-sm font-semibold text-mfneutralsn-500">{label}</span>
        <ChevronDownIcon
          className={`w-4 h-4 text-mfneutralsn-300 transition-transform duration-200 ${open ? '' : '-rotate-90'}`}
        />
      </button>
      {open && (
        <div className="bg-white rounded-xl mx-4 mb-3 overflow-hidden shadow-sm border border-gray-100">
          {activities.map((a) => (
            <ActivityRow key={a.id} activity={a} />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Sleep bar chart data ──────────────────────────────────────────────────────

const sleepByDay = [
  { label: "Mon", minutes: 90 },
  { label: "Tue", minutes: 45 },
  { label: "Wed", minutes: 120 },
  { label: "Thu", minutes: 30 },
  { label: "Fri", minutes: 60 },
  { label: "Sat", minutes: 75 },
  { label: "Today", minutes: 45 },
];

// ── Summary card (shown at top when a type filter is active) ──────────────────

const SleepSummaryCard = () => {
  const max = Math.max(...sleepByDay.map((d) => d.minutes));
  const todayMinutes = sleepByDay[sleepByDay.length - 1].minutes;
  const avg = Math.round(sleepByDay.reduce((s, d) => s + d.minutes, 0) / sleepByDay.length);

  return (
    <div className="bg-white rounded-2xl mx-4 mb-4 p-4 border border-gray-100 shadow-sm">
      {/* Header row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 flex-shrink-0">
          <SleepIcon />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-mfneutralsn-500">Sleep</p>
          <div className="flex gap-3 mt-0.5">
            <span className="text-xs text-mfneutralsn-300">{todayMinutes} min today</span>
            <span className="text-xs text-mfneutralsn-300">avg {avg} min / day</span>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-1.5 h-20">
        {sleepByDay.map((entry, i) => {
          const isToday = i === sleepByDay.length - 1;
          const heightPct = max > 0 ? (entry.minutes / max) * 100 : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
              <div
                className={`w-full rounded-t-md transition-all ${isToday ? 'bg-indigo-500' : 'bg-indigo-200'}`}
                style={{ height: `${heightPct}%`, minHeight: entry.minutes > 0 ? 4 : 0 }}
              />
              <span className={`text-[9px] leading-none ${isToday ? 'text-indigo-500 font-semibold' : 'text-mfneutralsn-300'}`}>
                {entry.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const GenericSummaryCard = ({ typeFilter }: { typeFilter: string }) => {
  const cfg = typeConfig[typeFilter as ActivityType];
  if (!cfg) return null;
  const Icon = cfg.icon;
  const label = allActivityTypes.find((t) => t.id === typeFilter)?.label ?? typeFilter;

  const allActivities = [...todayActivities, ...yesterdayActivities];
  const todayCount = todayActivities.filter((a) =>
    typeFilter === "sign-out" ? a.type === "sign-out" || a.type === "sign-in" : a.type === typeFilter
  ).length;
  const totalCount = allActivities.filter((a) =>
    typeFilter === "sign-out" ? a.type === "sign-out" || a.type === "sign-in" : a.type === typeFilter
  ).length;

  return (
    <div className="bg-white rounded-2xl mx-4 mb-4 p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
          <Icon />
        </div>
        <div>
          <p className="text-sm font-semibold text-mfneutralsn-500">{label}</p>
          <div className="flex gap-3 mt-0.5">
            <span className="text-xs text-mfneutralsn-300">{todayCount} today</span>
            <span className="text-xs text-mfneutralsn-300">{totalCount} this week</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Type filter dropdown ──────────────────────────────────────────────────────

const TypeFilter = ({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) => {
  const [open, setOpen] = useState(false);
  const current = allActivityTypes.find((t) => t.id === selected) ?? allActivityTypes[0];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-mfneutralsn-500 font-medium"
      >
        {current.label}
        <ChevronDownIcon className="w-4 h-4 text-mfneutralsn-300" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-50 min-w-[140px]">
          {allActivityTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => { onSelect(t.id); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl ${
                selected === t.id ? 'text-mfprimaryp-400 font-medium' : 'text-mfneutralsn-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

interface ActivitySectionProps {
  onClose: () => void;
  typeFilter?: string;
}

export const ActivitySection = ({ onClose, typeFilter = "all" }: ActivitySectionProps): JSX.Element => {

  const filterActivities = (activities: Activity[]) => {
    if (typeFilter === "all") return activities;
    if (typeFilter === "sign-out") return activities.filter((a) => a.type === "sign-out" || a.type === "sign-in");
    return activities.filter((a) => a.type === typeFilter);
  };

  const todayFiltered = filterActivities(todayActivities);
  const yesterdayFiltered = filterActivities(yesterdayActivities);
  const hasResults = todayFiltered.length > 0 || yesterdayFiltered.length > 0;

  return (
    <div className="flex flex-col bg-gray-50 h-full">
      <div className="flex-1 overflow-y-auto pt-3">
        {/* Summary card — shown whenever a specific type is selected */}
        {typeFilter !== "all" && (
          typeFilter === "sleep"
            ? <SleepSummaryCard />
            : <GenericSummaryCard typeFilter={typeFilter} />
        )}

        {/* Date-grouped activity list */}
        {todayFiltered.length > 0 && (
          <DateGroup label="Today" activities={todayFiltered} defaultOpen={true} />
        )}
        {yesterdayFiltered.length > 0 && (
          <DateGroup label="Yesterday" activities={yesterdayFiltered} defaultOpen={false} />
        )}
        {!hasResults && (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <p className="text-sm text-mfneutralsn-300 text-center">No activities found for the selected type.</p>
          </div>
        )}
        <div className="h-8" />
      </div>
    </div>
  );
};
