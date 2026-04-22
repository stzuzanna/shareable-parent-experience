import { BASE_PATH } from '../../../../constants';
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { SearchIcon, SlidersHorizontalIcon, XIcon, ChevronDownIcon } from "lucide-react";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";

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
  { id: 'saved', label: 'Saved' },
];

const ActivityControls = ({
  typeFilter,
  onTypeFilterChange,
}: {
  typeFilter: string;
  onTypeFilterChange: (f: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const current = allActivityTypes.find((t) => t.id === typeFilter) ?? allActivityTypes[0];

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 6,
        left: rect.left,
        minWidth: 160,
        zIndex: 9999,
      });
    }
  }, [open]);

  // Close only when clicking outside both the trigger button and the dropdown panel
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const outsideBtn = btnRef.current && !btnRef.current.contains(target);
      const outsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
      if (outsideBtn && outsideDropdown) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-mfneutralsn-200 text-mfneutralsn-400 bg-transparent flex-shrink-0"
      >
        {current.label}
        <ChevronDownIcon className="w-3.5 h-3.5" />
      </button>

      {open && createPortal(
        <div ref={dropdownRef} style={dropdownStyle} className="bg-white rounded-xl shadow-lg border border-gray-100">
          {allActivityTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => { onTypeFilterChange(t.id); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl ${
                typeFilter === t.id ? 'text-mfprimaryp-400 font-medium' : 'text-mfneutralsn-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>,
        document.body
      )}

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

export const PostFeedSection = ({
  activeTab,
  onTabChange,
  activityTypeFilter = 'all',
  onActivityTypeFilterChange = () => {},
}: PostFeedSectionProps): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const isFiltered = activeTab !== 'home';
  const activeTabLabel = tabs.find(t => t.id === activeTab)?.label;

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
    return null;
  };

  return (
    <header className={`flex flex-col w-full bg-mfneutralsn-50 ${!shouldShowFrame ? 'sticky top-0 z-50' : ''}`}>
      {/* Status bar */}
      <div className={`flex items-center justify-between px-5 pt-2 pb-1 ${!shouldShowFrame ? 'hidden' : ''}`}>
        <span className="[font-family:'Inter',Helvetica] font-semibold text-mfneutralsn-500 text-[15px] tracking-[-0.3px]">
          9:41
        </span>
        <img className="h-4" alt="Status icons" src={`${BASE_PATH}right-side.svg`} />
      </div>

      {/* Title row */}
      <div className="flex items-center justify-between px-5 pt-3 pb-6">
        <h1 className="text-[20px] font-bold text-mfneutralsn-500 tracking-tight leading-tight">
          Home
        </h1>
        <SearchIcon className="w-5 h-5 text-mfneutralsn-400" />
      </div>

      {/* Default pill row */}
      {!isFiltered && (
        <div className="flex items-center gap-2 px-4 pb-3 w-full overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border border-mfneutralsn-200 text-mfneutralsn-400 bg-transparent transition-all duration-150"
            >
              {tab.label}
            </button>
          ))}
          <button className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-mfneutralsn-200 ml-auto">
            <SlidersHorizontalIcon className="w-4 h-4 text-mfneutralsn-400" />
          </button>
        </div>
      )}

      {/* Active pill row: ✕ | active pill | tab-specific controls */}
      {isFiltered && (
        <div className="flex items-center gap-2 px-4 pb-3 w-full overflow-x-auto">
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
    </header>
  );
};
