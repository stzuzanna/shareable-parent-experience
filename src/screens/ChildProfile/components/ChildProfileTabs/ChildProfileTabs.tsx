import React from "react";

export interface TabConfig {
  id: string;
  label: string;
}

interface ChildProfileTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: TabConfig[];
}

export const ChildProfileTabs: React.FC<ChildProfileTabsProps> = ({ activeTab, onTabChange, tabs }): JSX.Element => {
  return (
    <div className="bg-white px-[8.5px] pt-2 pb-3 sticky top-0 z-20">
      <div className="flex items-center h-11 bg-mfneutralsn-50 rounded-xl p-1 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 h-9 px-2 rounded-lg text-[14px] leading-none transition-colors text-center whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-white shadow-sm font-medium text-mfneutralsn-500"
                : "font-normal text-mfneutralsn-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
