import { BASE_PATH } from '../../../../constants';
import React, { useEffect, useRef, useState } from "react";
import { SearchIcon, SlidersHorizontalIcon, XIcon, ChevronDownIcon, CheckIcon, BellIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import { useHomeTabsVariant } from "../../../../hooks/useHomeTabsVariant";
import { PhotosCalendarPicker } from "../PhotosCalendarPicker";
import { DateRangeCalendar, DateRangePickerFields } from "../DateRangeCalendar";
import { LEARNING_FILTER_AREAS } from "../LearningPostSection/LearningPostSection";

const SENDER_OPTIONS = [
  "Little Explorers",
  "Olivia Wilson",
  "Sarah Freedman",
  "Sandbox Childcare",
];

const allActivityTypes = [
  { id: "all", label: "All types" },
  { id: "sign-out", label: "Sign in/out" },
  { id: "nappy", label: "Nappy" },
  { id: "food", label: "Food" },
  { id: "sleep", label: "Sleep" },
  { id: "medication", label: "Medication" },
];

export const postSourceOptions = [
  { id: "all", label: "All posts" },
  { id: "little-explorers", label: "Little Explorers" },
  { id: "sandbox", label: "Sandbox Childcare" },
  { id: "polls", label: "Polls" },
] as const;

export type PostSourceFilter = (typeof postSourceOptions)[number]["id"];

export const learningTypeOptions = [
  { id: "all", label: "All" },
  { id: "observations", label: "Observations" },
  { id: "assessments", label: "Assessments" },
  { id: "resources", label: "Resources" },
] as const;

export type LearningTypeFilter = (typeof learningTypeOptions)[number]["id"];

interface PostFeedSectionProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activityTypeFilter?: string;
  onActivityTypeFilterChange?: (filter: string) => void;
  postSourceFilter?: PostSourceFilter;
  onPostSourceFilterChange?: (filter: PostSourceFilter) => void;
  learningTypeFilter?: LearningTypeFilter;
  onLearningTypeFilterChange?: (filter: LearningTypeFilter) => void;
  learningAreasFilter?: Set<string>;
  onLearningAreasFilterChange?: (areas: Set<string>) => void;
  photoFilterDate?: string | null;
  onPhotoFilterDateChange?: (date: string | null) => void;
  photoDatesWithContent?: string[];
}

const tabs = [
  { id: 'home', label: 'Posts' },
  { id: 'activity', label: 'Activities' },
  { id: 'learning', label: 'Learning' },
  { id: 'photos', label: 'Photos' },
  { id: 'saved', label: 'Saved' },
];

// Pills variant only exposes Activity and Photos — newsfeed (with learning merged)
// is the implicit default when no pill is selected.
const pillsTabs = [
  { id: 'activity', label: 'Activity' },
  { id: 'photos', label: 'Photos' },
];

const DROPDOWN_LABEL: Record<string, string> = {
  saved: 'All types',
};

const ActivityDropdown = ({
  typeFilter,
  onTypeFilterChange,
}: {
  typeFilter: string;
  onTypeFilterChange: (f: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = allActivityTypes.find((t) => t.id === typeFilter) ?? allActivityTypes[0];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={containerRef} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-mfneutralsn-200 text-mfneutralsn-400 bg-white"
      >
        {current.label}
        <ChevronDownIcon className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 min-w-[160px] bg-white rounded-xl shadow-lg border border-gray-100 z-[55]">
          {allActivityTypes.map((t) => (
            <button
              key={t.id}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => { onTypeFilterChange(t.id); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl ${
                typeFilter === t.id ? 'text-mfprimaryp-400 font-medium' : 'text-mfneutralsn-500'
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

const FilterDropdown = ({
  options,
  value,
  onChange,
}: {
  options: readonly { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.id === value) ?? options[0];

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

  return (
    <div ref={containerRef} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-mfneutralsn-200 text-mfneutralsn-400 bg-white"
      >
        {current.label}
        <ChevronDownIcon className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 min-w-[180px] bg-white rounded-xl shadow-lg border border-gray-100 z-[55]">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => {
                onChange(option.id);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl ${
                value === option.id ? "text-mfprimaryp-400 font-medium" : "text-mfneutralsn-500"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const StaticDropdown = ({ label }: { label: string }) => (
  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-mfneutralsn-200 text-mfneutralsn-400 bg-white flex-shrink-0">
    {label}
    <ChevronDownIcon className="w-3.5 h-3.5" />
  </button>
);

export const PostFeedSection = ({
  activeTab,
  onTabChange,
  activityTypeFilter = 'all',
  onActivityTypeFilterChange = () => {},
  postSourceFilter = 'all',
  onPostSourceFilterChange = () => {},
  learningTypeFilter = 'all',
  onLearningTypeFilterChange = () => {},
  learningAreasFilter = new Set<string>(),
  onLearningAreasFilterChange = () => {},
  photoFilterDate = null,
  onPhotoFilterDateChange = () => {},
  photoDatesWithContent = [],
}: PostFeedSectionProps): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const tabsVariant = useHomeTabsVariant();
  const navigate = useNavigate();
  const isPills = tabsVariant === "pills";

  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [senders, setSenders] = useState<Set<string>>(new Set());
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [activityDateFrom, setActivityDateFrom] = useState('');
  const [activityDateTo, setActivityDateTo] = useState('');
  const [activitySenders, setActivitySenders] = useState<Set<string>>(new Set());
  const [learningSearchQuery, setLearningSearchQuery] = useState('');
  const [learningDateFrom, setLearningDateFrom] = useState('');
  const [learningDateTo, setLearningDateTo] = useState('');

  const filtersActive =
    activeTab === 'activity'
      ? activitySearchQuery.trim() !== '' ||
        activityDateFrom !== '' ||
        activityDateTo !== '' ||
        activitySenders.size > 0
      : activeTab === 'learning'
        ? learningSearchQuery.trim() !== '' ||
          learningDateFrom !== '' ||
          learningDateTo !== '' ||
          learningAreasFilter.size > 0
        : searchQuery.trim() !== '' || dateFrom !== '' || dateTo !== '' || senders.size > 0;

  const toggleSender = (s: string) => {
    setSenders((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const toggleActivitySender = (s: string) => {
    setActivitySenders((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const toggleLearningArea = (area: string) => {
    const next = new Set(learningAreasFilter);
    if (next.has(area)) next.delete(area);
    else next.add(area);
    onLearningAreasFilterChange(next);
  };

  const clearFilters = () => {
    if (activeTab === 'activity') {
      setActivitySearchQuery('');
      setActivityDateFrom('');
      setActivityDateTo('');
      setActivitySenders(new Set());
      return;
    }
    if (activeTab === 'learning') {
      setLearningSearchQuery('');
      setLearningDateFrom('');
      setLearningDateTo('');
      onLearningAreasFilterChange(new Set());
      return;
    }
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
    setSenders(new Set());
  };

  const filterSheetTitle =
    activeTab === "activity"
      ? "Filter activities"
      : activeTab === "learning"
        ? "Filter learning"
        : "Filter newsfeed";

  const searchPlaceholder =
    activeTab === "activity"
      ? "Search activities"
      : activeTab === "learning"
        ? "Search learning"
        : "Search posts";

  const showSenderFilters = activeTab === "home" || activeTab === "activity";
  const currentSenders = activeTab === "activity" ? activitySenders : senders;
  const onToggleCurrentSender = activeTab === "activity" ? toggleActivitySender : toggleSender;

  return (
    <>
    <header className={`flex flex-col w-full bg-white overflow-visible relative z-[55] ${!shouldShowFrame ? 'sticky top-0' : ''}`}>
      {/* Status bar */}
      <div className={`flex items-center justify-between px-5 pt-2 pb-1 ${!shouldShowFrame ? 'hidden' : ''}`}>
        <span className="[font-family:'Inter',Helvetica] font-semibold text-mfneutralsn-500 text-[15px] tracking-[-0.3px]">
          9:41
        </span>
        <img className="h-4" alt="Status icons" src={`${BASE_PATH}right-side.svg`} />
      </div>

      {/* Title row */}
      <div className={`flex items-center justify-between px-5 pt-3 ${isPills ? 'pb-8' : 'pb-12'}`}>
        <h1 className="text-[20px] font-bold text-mfneutralsn-500 tracking-tight leading-tight">
          Home
        </h1>
        <div className="flex items-center gap-4">
          {isPills && (
            <button
              onClick={() => navigate('/notifications')}
              aria-label="Notifications"
              className="relative"
            >
              <BellIcon className="w-5 h-5 text-mfneutralsn-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          )}
          <SearchIcon className="w-5 h-5 text-mfneutralsn-400" />
        </div>
      </div>

      {/* Tabs — underline or pills variant */}
      {isPills ? (
        <div className="bg-white px-4 pb-3">
          <div className="flex items-center gap-2 w-full">
            <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar">
              {activeTab === 'home' ? (
                pillsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border border-mfneutralsn-200 text-mfneutralsn-400 bg-transparent"
                  >
                    {tab.label}
                  </button>
                ))
              ) : (
                <>
                  <button
                    onClick={() => onTabChange('home')}
                    aria-label="Close filter"
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-mfneutralsn-200 bg-white"
                  >
                    <XIcon className="w-4 h-4 text-mfneutralsn-500" />
                  </button>
                  <button className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium bg-mfprimaryp-400 border border-mfprimaryp-400 text-white">
                    {pillsTabs.find((t) => t.id === activeTab)?.label ?? activeTab}
                  </button>
                  {activeTab === 'activity' && (
                    <ActivityDropdown typeFilter={activityTypeFilter} onTypeFilterChange={onActivityTypeFilterChange} />
                  )}
                  {activeTab === 'photos' && (
                    <PhotosCalendarPicker
                      selectedDate={photoFilterDate}
                      onSelectDate={onPhotoFilterDateChange}
                      datesWithPhotos={photoDatesWithContent}
                      popoverAlign="left"
                    />
                  )}
                </>
              )}
            </div>
            <button
              aria-label="Filters"
              onClick={() => setShowFilterSheet(true)}
              className={`relative flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full border bg-white ${
                filtersActive ? 'border-mfprimaryp-400' : 'border-mfneutralsn-200'
              }`}
            >
              <SlidersHorizontalIcon className={`w-4 h-4 ${filtersActive ? 'text-mfprimaryp-400' : 'text-mfneutralsn-400'}`} />
              {filtersActive && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-mfprimaryp-400" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white border-b border-[#e2e2e9] px-4">
            <div className="flex items-center justify-start overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex h-12 items-center justify-center pr-4 first:pl-0 pl-4 -mb-px border-b-2 text-[16px] leading-tight whitespace-nowrap transition-colors flex-shrink-0 ${
                      isActive
                        ? "border-mfprimaryp-400 text-mfprimaryp-400 font-medium"
                        : "border-transparent text-mfneutralsn-400 opacity-80 font-normal"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter row (underline variant only) */}
          <div
            className={`flex items-center px-4 py-3 w-full bg-white ${
              activeTab === 'photos' ? 'justify-end' : 'justify-between'
            }`}
          >
            {activeTab === 'activity' ? (
              <ActivityDropdown typeFilter={activityTypeFilter} onTypeFilterChange={onActivityTypeFilterChange} />
            ) : activeTab === 'home' ? (
              <FilterDropdown
                options={postSourceOptions}
                value={postSourceFilter}
                onChange={(id) => onPostSourceFilterChange(id as PostSourceFilter)}
              />
            ) : activeTab === 'learning' ? (
              <FilterDropdown
                options={learningTypeOptions}
                value={learningTypeFilter}
                onChange={(id) => onLearningTypeFilterChange(id as LearningTypeFilter)}
              />
            ) : activeTab === 'photos' ? null : (
              <StaticDropdown label={DROPDOWN_LABEL[activeTab] ?? 'All'} />
            )}
            {activeTab === 'photos' ? (
              <PhotosCalendarPicker
                selectedDate={photoFilterDate}
                onSelectDate={onPhotoFilterDateChange}
                datesWithPhotos={photoDatesWithContent}
                popoverAlign="right"
              />
            ) : (
              <button
                aria-label="Filters"
                onClick={() => setShowFilterSheet(true)}
                className={`relative flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full border bg-white ${
                  filtersActive ? 'border-mfprimaryp-400' : 'border-mfneutralsn-200'
                }`}
              >
                <SlidersHorizontalIcon className={`w-4 h-4 ${filtersActive ? 'text-mfprimaryp-400' : 'text-mfneutralsn-400'}`} />
                {filtersActive && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-mfprimaryp-400" />
                )}
              </button>
            )}
          </div>
        </>
      )}
    </header>

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
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>

              <div className="flex items-center justify-between px-5 pt-2 pb-4">
                <h2 className="text-[16px] font-medium text-mfneutralsn-500">{filterSheetTitle}</h2>
                <button
                  onClick={() => setShowFilterSheet(false)}
                  aria-label="Close"
                  className="w-7 h-7 flex items-center justify-center text-mfneutralsn-400 active:bg-gray-50 rounded-full"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-5 px-5 pb-6">
                <div>
                  <label className="text-[14px] text-mfneutralsn-300">Search</label>
                  <div className="mt-1.5 flex items-center gap-2 h-10 px-3 rounded-lg border border-mfneutralsn-200 bg-white">
                    <SearchIcon className="w-4 h-4 text-mfneutralsn-300" />
                    <input
                      value={
                        activeTab === "activity"
                          ? activitySearchQuery
                          : activeTab === "learning"
                            ? learningSearchQuery
                            : searchQuery
                      }
                      onChange={(e) => {
                        if (activeTab === "activity") setActivitySearchQuery(e.target.value);
                        else if (activeTab === "learning") setLearningSearchQuery(e.target.value);
                        else setSearchQuery(e.target.value);
                      }}
                      placeholder={searchPlaceholder}
                      className="flex-1 text-[14px] text-mfneutralsn-500 bg-transparent focus:outline-none placeholder:text-mfneutralsn-300"
                    />
                    {(activeTab === "activity"
                      ? activitySearchQuery
                      : activeTab === "learning"
                        ? learningSearchQuery
                        : searchQuery) && (
                      <button
                        onClick={() => {
                          if (activeTab === "activity") setActivitySearchQuery("");
                          else if (activeTab === "learning") setLearningSearchQuery("");
                          else setSearchQuery("");
                        }}
                        aria-label="Clear search"
                      >
                        <XIcon className="w-4 h-4 text-mfneutralsn-300" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[14px] text-mfneutralsn-300">Date range</label>
                  {activeTab === "activity" ? (
                    <DateRangePickerFields
                      dateFrom={activityDateFrom}
                      dateTo={activityDateTo}
                      onChange={(from, to) => {
                        setActivityDateFrom(from);
                        setActivityDateTo(to);
                      }}
                    />
                  ) : activeTab === "learning" ? (
                    <div className="mt-1.5">
                      <DateRangeCalendar
                        dateFrom={learningDateFrom}
                        dateTo={learningDateTo}
                        onChange={(from, to) => {
                          setLearningDateFrom(from);
                          setLearningDateTo(to);
                        }}
                      />
                    </div>
                  ) : (
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
                  )}
                </div>

                {activeTab === "learning" && (
                  <div>
                    <label className="text-[14px] text-mfneutralsn-300">Areas</label>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {LEARNING_FILTER_AREAS.map((area) => {
                        const selected = learningAreasFilter.has(area.id);
                        return (
                          <button
                            key={area.id}
                            type="button"
                            onClick={() => toggleLearningArea(area.id)}
                            className={`h-9 px-3 rounded-full border text-[14px] flex items-center gap-1.5 ${
                              selected
                                ? "bg-mfprimaryp-400 border-mfprimaryp-400 text-white"
                                : "bg-white border-mfneutralsn-200 text-mfneutralsn-500"
                            }`}
                          >
                            {selected && <CheckIcon className="w-3.5 h-3.5" />}
                            {area.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {showSenderFilters && (
                  <div>
                    <label className="text-[14px] text-mfneutralsn-300">Sender</label>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {SENDER_OPTIONS.map((s) => {
                        const selected = currentSenders.has(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => onToggleCurrentSender(s)}
                            className={`h-9 px-3 rounded-full border text-[14px] flex items-center gap-1.5 ${
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
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={clearFilters}
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
    </>
  );
};
