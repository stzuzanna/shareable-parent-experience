import React from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { ChevronLeftIcon, SearchIcon, ChevronRightIcon } from "lucide-react";
import { BASE_PATH } from "../../constants";

interface AccountSettingsProps {
  onClose: () => void;
}

const settingsItems = [
  {
    id: 'contact-info',
    label: 'Contact information',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  },
  {
    id: 'language-translations',
    label: 'Language and Translations',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500">
        <path d="M5 8l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 14l6-6 2-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 5h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 2h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 22l-5-10-5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 18h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 'notifications-messaging',
    label: 'Notifications and Messaging',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 'password',
    label: 'Password',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: 'payment-methods',
    label: 'Payment Methods',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
        <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )
  }
];

export const AccountSettings: React.FC<AccountSettingsProps> = ({ onClose }): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Header */}
      <header className={`flex flex-col w-full items-start relative ${!shouldShowFrame ? 'sticky top-0 z-50' : ''}`}>
        <div className="flex items-end justify-center px-0 py-2 relative w-full bg-mfprimaryp-400">
          <div className="flex flex-col w-[106px] items-start justify-center gap-2 pl-5 pr-0 pt-0 pb-[3px] relative">
            <div className="relative w-[54px] h-[21px] rounded-3xl">
              <div className="absolute top-px left-[11px] [font-family:'Inter',Helvetica] font-medium text-mfneutralsn-0 text-base text-center tracking-[-0.32px] leading-[21px] whitespace-nowrap">
                9:41
              </div>
            </div>
          </div>

          <div className="flex flex-col h-8 items-center justify-center relative flex-1">
            <div className="relative flex-1 w-[108px] bg-mfneutralsn-0 rounded-[100px] opacity-0" />
          </div>

          <img
            className="relative w-[106px] h-full"
            alt="Right side"
            src={`${BASE_PATH}right-side.svg`}
          />
        </div>

        <nav className="flex h-12 items-center justify-between px-4 py-2 relative w-full bg-mfprimaryp-400">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-6 h-6 p-0"
          >
            <ChevronLeftIcon className="w-5 h-5 text-white" />
          </Button>

          <h1 className="font-MF-headings-h6-emphasis font-[number:var(--MF-headings-h6-emphasis-font-weight)] text-mfneutralsn-0 text-[length:var(--MF-headings-h6-emphasis-font-size)] leading-[var(--MF-headings-h6-emphasis-line-height)] tracking-[var(--MF-headings-h6-emphasis-letter-spacing)] [font-style:var(--MF-headings-h6-emphasis-font-style)]">
            Account Settings
          </h1>

          <div className="w-6 h-6" />
        </nav>
      </header>

      {/* Content */}
      <div className="flex-1 bg-white">
        {/* User Profile Section */}
        <div className="px-6 py-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={`${BASE_PATH}avatar-2.png`} alt="Katie Smith" />
              <AvatarFallback>KS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h2 className="font-MF-headings-h6-emphasis font-[number:var(--MF-headings-h6-emphasis-font-weight)] text-mfneutralsn-500 text-[length:var(--MF-headings-h6-emphasis-font-size)] tracking-[var(--MF-headings-h6-emphasis-letter-spacing)] leading-[var(--MF-headings-h6-emphasis-line-height)] [font-style:var(--MF-headings-h6-emphasis-font-style)]">
                Katie Smith
              </h2>
            </div>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="flex flex-col">
          {settingsItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="flex items-center justify-between h-16 px-6 py-4 text-left rounded-none border-b border-gray-50 hover:bg-transparent cursor-default"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-6 h-6">
                  {item.icon}
                </div>
                <span className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-400 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
                  {item.label}
                </span>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};