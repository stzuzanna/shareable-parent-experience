import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";

interface ChildProfileTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs = [
  { id: 'activity', label: 'Activity', active: true },
  { id: 'about', label: 'About', active: false },
  { id: 'family', label: 'Family', active: false },
  { id: 'photos', label: 'Photos', active: false },
];

export const ChildProfileTabs: React.FC<ChildProfileTabsProps> = ({ activeTab, onTabChange }): JSX.Element => {

  return (
    <div className="flex items-center justify-between px-6 py-0 bg-white border-b border-gray-100">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 h-12 rounded-none border-b-2 transition-all duration-200 ${
            activeTab === tab.id
              ? 'border-mfprimaryp-400 text-mfprimaryp-400'
              : 'border-transparent text-mfneutralsn-300 hover:text-mfneutralsn-400'
          }`}
        >
          <span className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
            {tab.label}
          </span>
        </Button>
      ))}
    </div>
  );
};