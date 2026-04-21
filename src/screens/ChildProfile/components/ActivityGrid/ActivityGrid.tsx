import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { AbsenceOverlay } from "../../../../components/AbsenceOverlay/AbsenceOverlay";

const activityItems = [
  {
    icon: "sick",
    label: "Sick",
    iconColor: "text-red-500",
  },
  {
    icon: "vacation",
    label: "Vacation",
    iconColor: "text-yellow-500",
  },
  {
    icon: "absent",
    label: "Absent",
    iconColor: "text-gray-500",
  },
  {
    icon: "request",
    label: "Request care",
    iconColor: "text-gray-400",
  },
  {
    icon: "meals",
    label: "Meals",
    iconColor: "text-gray-600",
  },
  {
    icon: "checkout",
    label: "Check out time",
    iconColor: "text-blue-500",
  },
];

const renderIcon = (iconType: string, iconColor: string) => {
  switch (iconType) {
    case "sick":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={iconColor}>
          <path d="M14 14.76V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v11.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17a4 4 0 1 1-8 0c0-1.8 1.2-3.4 2.9-3.9L11 13h2l.1.1c1.7.5 2.9 2.1 2.9 3.9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="6" x2="12" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case "vacation":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={iconColor}>
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
          <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
          <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2"/>
          <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2"/>
          <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case "absent":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={iconColor}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case "request":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={iconColor}>
          <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
          <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case "meals":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={iconColor}>
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" stroke="currentColor" strokeWidth="2"/>
          <path d="M7 2v20" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case "checkout":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={iconColor}>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    default:
      return null;
  }
};

export const ActivityGrid = (): JSX.Element => {
  const [overlay, setOverlay] = useState<null | "sick" | "vacation" | "absent">(null);
  const maybeOpenOverlay = (label: string) => {
    const key = label.toLowerCase();
    if (key === 'sick' || key === 'vacation' || key === 'absent') {
      setOverlay(key);
    }
  };

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="grid grid-cols-2 gap-0 mx-6 my-6 border border-gray-200 rounded-lg overflow-hidden">
        {activityItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`h-16 flex items-center justify-start gap-3 px-4 py-3 bg-white transition-colors rounded-none border-0 ${
              item.label === 'Request care' || item.label === 'Meals' || item.label === 'Check out time' ? 'hover:bg-transparent cursor-default' : 'hover:bg-gray-50'
            }`}
            onClick={() => maybeOpenOverlay(item.label)}
          >
            <div className="flex items-center justify-center w-6 h-6">
              {renderIcon(item.icon, item.iconColor)}
            </div>
            <span className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-sm tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-tight text-left text-mfneutralsn-400 [font-style:var(--modern-famly-body-text-body-font-style)]">
              {item.label}
            </span>
          </Button>
        ))}
      </div>
      {overlay && (
        <AbsenceOverlay type={overlay} onClose={() => setOverlay(null)} />
      )}
    </div>
  );
};