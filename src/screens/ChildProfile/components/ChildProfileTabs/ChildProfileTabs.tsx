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
    <div className="bg-white px-4 pt-4 sticky top-0 z-20">
      <div className="flex items-center justify-start">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex h-12 items-center justify-center px-4 -mb-px border-b-2 text-[16px] leading-tight whitespace-nowrap transition-colors ${
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
  );
};
