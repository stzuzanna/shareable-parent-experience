import { BASE_PATH } from '../../../../constants';
import React from "react";
import { SearchIcon } from "lucide-react";
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
    <header className={`flex flex-col w-full items-start relative ${!shouldShowFrame ? 'sticky top-0 z-50' : ''}`}>
      {/* Status bar */}
      <div className={`flex items-end justify-center px-0 py-2 relative w-full bg-white border-b border-gray-100 ${!shouldShowFrame ? 'hidden' : ''}`}>
        <div className="flex flex-col w-[106px] items-start justify-center gap-2 pl-5 pr-0 pt-0 pb-[3px] relative">
          <div className="relative w-[54px] h-[21px] rounded-3xl">
            <div className="absolute top-px left-[11px] [font-family:'Inter',Helvetica] font-medium text-mfneutralsn-500 text-base text-center tracking-[-0.32px] leading-[21px] whitespace-nowrap">
              9:41
            </div>
          </div>
        </div>
        <div className="flex flex-col h-8 items-center justify-center relative flex-1" />
        <img
          className="relative w-[106px] h-full opacity-60"
          alt="Right side"
          src={`${BASE_PATH}right-side.svg`}
        />
      </div>

      {/* Nursery header */}
      <nav className="flex h-14 items-center justify-between px-4 py-2 relative w-full bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-mfprimaryp-400 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9,22 9,12 15,12 15,22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="font-MF-headings-h6-emphasis font-[number:var(--MF-headings-h6-emphasis-font-weight)] text-mfneutralsn-500 text-[length:var(--MF-headings-h6-emphasis-font-size)] leading-[var(--MF-headings-h6-emphasis-line-height)] tracking-[var(--MF-headings-h6-emphasis-letter-spacing)] [font-style:var(--MF-headings-h6-emphasis-font-style)]">
            Bright Beginnings
          </h1>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <SearchIcon className="w-5 h-5 text-mfneutralsn-400" />
        </button>
      </nav>

      {/* Tab strip */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-100 w-full overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(activeTab === tab.id ? 'home' : tab.id)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-mfprimaryp-400 text-white'
                : 'bg-gray-100 text-mfneutralsn-400 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
        {/* Filter icon */}
        <button className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ml-auto">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-mfneutralsn-400"/>
            <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-mfneutralsn-400"/>
            <line x1="10" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-mfneutralsn-400"/>
          </svg>
        </button>
      </div>
    </header>
  );
};
