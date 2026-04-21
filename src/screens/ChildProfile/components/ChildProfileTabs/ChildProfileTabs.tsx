import React from "react";
import { Button } from "../../../../components/ui/button";

interface ChildProfileTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'health', label: 'Health and safety' },
  { id: 'documents', label: 'Documents' },
];

export const ChildProfileTabs: React.FC<ChildProfileTabsProps> = ({ activeTab, onTabChange }): JSX.Element => {
  return (
    <div className="flex items-center bg-white border-b border-gray-100 sticky top-[96px] z-10">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 h-12 rounded-none border-b-2 transition-all duration-200 px-1 ${
            activeTab === tab.id
              ? 'border-mfprimaryp-400 text-mfprimaryp-400'
              : 'border-transparent text-mfneutralsn-300 hover:text-mfneutralsn-400'
          }`}
        >
          <span className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)] text-xs sm:text-sm">
            {tab.label}
          </span>
        </Button>
      ))}
    </div>
  );
};
