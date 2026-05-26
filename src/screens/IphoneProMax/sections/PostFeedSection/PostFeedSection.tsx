import { BASE_PATH } from '../../../../constants';
import React, { useState, useRef, useEffect } from "react";
import { SearchIcon, SlidersHorizontalIcon, XIcon, ChevronDownIcon, BookmarkIcon, CheckIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";

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

interface PostFeedSectionProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activityTypeFilter?: string;
  onActivityTypeFilterChange?: (filter: string) => void;
}

const tabs = [
  { id: 'activity', label: 'Activity' },
  { id: 'photos', label: 'Photos' },
  { id: 'learning', label: 'Learning' },
];

const ActivityControls = ({
  typeFilter,
  onTypeFilterChange,
}: {
  typeFilter: string;
  onTypeFilterChange: (f: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = allActivityTypes.find((t) => t.id === typeFilter) ?? allActivityTypes[0];

  // Close on outside click
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
    <>
      {/* Dropdown trigger — relative wrapper keeps dropdown inside the frame */}
      <div ref={containerRef} className="relative flex-shrink-0">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-mfneutralsn-200 text-mfneutralsn-400 bg-transparent"
        >
          {current.label}
          <ChevronDownIcon className="w-3.5 h-3.5" />
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-1.5 min-w-[160px] bg-white rounded-xl shadow-lg border border-gray-100 z-50">
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

      <button className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-mfneutralsn-200">
        <SlidersHorizontalIcon className="w-4 h-4 text-mfneutralsn-400" />
      </button>
    </>
  );
};

const PhotosControls = () => (
  <>
    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-mfneutralsn-200 text-mfneutralsn-400 bg-transparent flex-shrink-0">
      All dates
      <ChevronDownIcon className="w-3.5 h-3.5" />
    </button>
    <button className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-mfneutralsn-200">
      <SlidersHorizontalIcon className="w-4 h-4 text-mfneutralsn-400" />
    </button>
  </>
);

const SavedControls = () => (
  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-mfneutralsn-200 text-mfneutralsn-400 bg-transparent flex-shrink-0">
    All types
    <ChevronDownIcon className="w-3.5 h-3.5" />
  </button>
);

const LearningControls = ({ onOpenFilters }: { onOpenFilters: () => void }) => (
  <>
    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-mfneutralsn-200 text-mfneutralsn-400 bg-transparent flex-shrink-0">
      All areas
      <ChevronDownIcon className="w-3.5 h-3.5" />
    </button>
    <button
      onClick={onOpenFilters}
      aria-label="Filters"
      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-mfneutralsn-200"
    >
      <SlidersHorizontalIcon className="w-4 h-4 text-mfneutralsn-400" />
    </button>
  </>
);

export const PostFeedSection = ({
  activeTab,
  onTabChange,
  activityTypeFilter = 'all',
  onActivityTypeFilterChange = () => {},
}: PostFeedSectionProps): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const isFiltered = activeTab !== 'home';
  const activeTabLabel = tabs.find(t => t.id === activeTab)?.label ?? (activeTab === 'saved' ? 'Saved' : undefined);

  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [senders, setSenders] = useState<Set<string>>(new Set());
  const filtersActive = searchQuery.trim() !== '' || dateFrom !== '' || dateTo !== '' || senders.size > 0;

  const toggleSender = (s: string) => {
    setSenders((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
    setSenders(new Set());
  };

  const renderActiveControls = () => {
    if (activeTab === 'activity') {
      return (
        <ActivityControls
          typeFilter={activityTypeFilter}
          onTypeFilterChange={onActivityTypeFilterChange}
        />
      );
    }
    if (activeTab === 'photos') return <PhotosControls />;
    if (activeTab === 'saved') return <SavedControls />;
    if (activeTab === 'learning') return <LearningControls onOpenFilters={() => setShowFilterSheet(true)} />;
    return null;
  };

  return (
    <header className={`flex flex-col w-full ${activeTab === 'home' ? 'bg-white' : 'bg-mfneutralsn-50'} overflow-visible ${!shouldShowFrame ? 'sticky top-0 z-50' : ''}`}>
      {/* Status bar */}
      <div className={`flex items-center justify-between px-5 pt-2 pb-1 ${!shouldShowFrame ? 'hidden' : ''}`}>
        <span className="[font-family:'Inter',Helvetica] font-semibold text-mfneutralsn-500 text-[15px] tracking-[-0.3px]">
          9:41
        </span>
        <img className="h-4" alt="Status icons" src={`${BASE_PATH}right-side.svg`} />
      </div>

      {/* Title row */}
      <div className="flex items-center justify-between px-5 pt-3 pb-4">
        <h1 className="text-[20px] font-bold text-mfneutralsn-500 tracking-tight leading-tight">
          Home
        </h1>
        <SearchIcon className="w-5 h-5 text-mfneutralsn-400" />
      </div>

      {/* Default pill row */}
      {!isFiltered && (
        <div className="flex items-center gap-2 px-4 pb-3 w-full">
          <div className="flex items-center gap-2 flex-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border border-mfneutralsn-200 text-mfneutralsn-400 bg-transparent transition-all duration-150"
              >
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => onTabChange('saved')}
              aria-label="Saved"
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-mfneutralsn-200"
            >
              <BookmarkIcon className="w-4 h-4 text-mfneutralsn-400" />
            </button>
          </div>
          <button
            aria-label="Filters"
            onClick={() => setShowFilterSheet(true)}
            className={`relative flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border bg-white ${
              filtersActive ? 'border-mfprimaryp-400' : 'border-mfneutralsn-200'
            }`}
          >
            <SlidersHorizontalIcon className={`w-4 h-4 ${filtersActive ? 'text-mfprimaryp-400' : 'text-mfneutralsn-400'}`} />
            {filtersActive && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-mfprimaryp-400" />
            )}
          </button>
        </div>
      )}

      {/* Active pill row: ✕ | active pill | tab-specific controls */}
      {isFiltered && (
        <div className="flex items-center gap-2 px-4 pb-3 w-full">
          <button
            onClick={() => onTabChange('home')}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-mfneutralsn-200 bg-transparent"
            aria-label="Close filter"
          >
            <XIcon className="w-4 h-4 text-mfneutralsn-500" />
          </button>
          <button className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border bg-mfprimaryp-400 text-white border-mfprimaryp-400">
            {activeTabLabel}
          </button>
          {renderActiveControls()}
        </div>
      )}

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
                <h2 className="text-[16px] font-medium text-mfneutralsn-500">Filter newsfeed</h2>
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
                  <label className="text-[12px] text-mfneutralsn-300">Search</label>
                  <div className="mt-1.5 flex items-center gap-2 h-10 px-3 rounded-lg border border-mfneutralsn-200 bg-white">
                    <SearchIcon className="w-4 h-4 text-mfneutralsn-300" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search posts"
                      className="flex-1 text-[14px] text-mfneutralsn-500 bg-transparent focus:outline-none placeholder:text-mfneutralsn-300"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} aria-label="Clear search">
                        <XIcon className="w-4 h-4 text-mfneutralsn-300" />
                      </button>
                    )}
                  </div>
                </div>

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

                <div>
                  <label className="text-[12px] text-mfneutralsn-300">Sender</label>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {SENDER_OPTIONS.map((s) => {
                      const selected = senders.has(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleSender(s)}
                          className={`h-9 px-3 rounded-full border text-[13px] flex items-center gap-1.5 ${
                            selected
                              ? 'bg-mfprimaryp-400 border-mfprimaryp-400 text-white'
                              : 'bg-white border-mfneutralsn-200 text-mfneutralsn-500'
                          }`}
                        >
                          {selected && <CheckIcon className="w-3.5 h-3.5" />}
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

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
    </header>
  );
};
