import { BASE_PATH } from '../../../../constants';
import React from "react";
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";

interface PostFeedSectionProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'activity', label: 'Activity' },
  { id: 'photos', label: 'Photos' },
  { id: 'saved', label: 'Saved' },
];

export const PostFeedSection = ({ activeTab, onTabChange }: PostFeedSectionProps): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();

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
      <div className="flex items-center justify-between px-5 pt-3 pb-3">
        <h1 className="text-[26px] font-bold text-mfneutralsn-500 tracking-tight leading-tight">
          Home
        </h1>
        <SearchIcon className="w-5 h-5 text-mfneutralsn-400" />
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 px-4 pb-3 w-full overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(activeTab === tab.id ? 'home' : tab.id)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
              activeTab === tab.id
                ? 'bg-mfneutralsn-500 text-white border-mfneutralsn-500'
                : 'border-mfneutralsn-200 text-mfneutralsn-400 bg-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-mfneutralsn-200 ml-auto">
          <SlidersHorizontalIcon className="w-4 h-4 text-mfneutralsn-400" />
        </button>
      </div>
    </header>
  );
};
