import React from "react";

interface ChildProfileTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'health', label: 'Health and safety' },
  { id: 'documents', label: 'Paperwork' },
];

export const ChildProfileTabs: React.FC<ChildProfileTabsProps> = ({ activeTab, onTabChange }): JSX.Element => {
  return (
    <div className="bg-mfneutralsn-50 px-4 pb-6 sticky top-0 z-20">
      <div className="flex items-center h-[44px] bg-mfneutralsn-50 border border-gray-100 rounded-xl p-1 gap-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 h-full px-2 rounded-lg text-[13px] transition-all duration-200 text-center whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white shadow-sm font-medium text-mfneutralsn-500'
                : 'font-normal text-mfneutralsn-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
