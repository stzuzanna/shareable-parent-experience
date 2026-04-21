import React from "react";

interface ActivityItemProps {
  icon: string;
  iconBg: string;
  title: string;
  subtitle: string;
  showConnector?: boolean;
  isLast?: boolean;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  icon,
  iconBg,
  title,
  subtitle,
  showConnector = false,
  isLast = false,
}) => {
  const renderIcon = () => {
    if (icon === "👥") {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    
    if (icon === "✓") {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
          <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    
    if (icon === "🌙") {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    
    if (icon === "👶") {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
          <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2"/>
          <path d="M20 21a8 8 0 1 0-16 0" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    }

    if (icon === "🍴") {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" stroke="currentColor" strokeWidth="2"/>
          <path d="M7 2v20" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    }

    if (icon === "🤒") {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
          <path d="M14 14.76V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v11.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17a4 4 0 1 1-8 0c0-1.8 1.2-3.4 2.9-3.9L11 13h2l.1.1c1.7.5 2.9 2.1 2.9 3.9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="6" x2="12" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    }
    
    return <span className="text-white text-lg">{icon}</span>;
  };

  return (
    <div className="flex items-start gap-3 w-full relative">
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${iconBg} flex-shrink-0 relative z-10`}>
        {renderIcon()}
      </div>
      
      <div className="flex flex-col gap-1 flex-1 min-w-0 pt-1">
        <div className="font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-mfneutralsn-500 text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] [font-style:var(--MF-body-text-body-emphasis-font-style)]">
          {title}
        </div>
        
        <div className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-300 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
          {subtitle}
        </div>
      </div>
    </div>
  );
};