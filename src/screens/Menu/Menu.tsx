import { BASE_PATH } from '../../constants';
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { AccountSettings } from "../../components/AccountSettings/AccountSettings";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { AppHeader } from "../../components/AppHeader/AppHeader";
import { BottomNav } from "../../components/BottomNav/BottomNav";
import { 
  CreditCardIcon,
  UsersIcon,
  HelpCircleIcon,
  FileTextIcon,
  LogOutIcon,
} from "lucide-react";

export const Menu = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  if (showAccountSettings) {
    return <AccountSettings onClose={() => setShowAccountSettings(false)} />;
  }

  const menuItems = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-mforangeo-400">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "Activity plans",
      onClick: () => navigate('/activity-plans'),
    },
    {
      icon: <CreditCardIcon className="w-6 h-6 text-gray-600" />,
      title: "Balance - $1,050.00",
      onClick: () => navigate('/balance'),
    },
  ];

  const settingsItems = [
    {
      icon: <UsersIcon className="w-5 h-5 text-gray-600" />,
      title: "Account preferences",
      onClick: () => setShowAccountSettings(true),
    },
    {
      icon: <HelpCircleIcon className="w-5 h-5 text-gray-600" />,
      title: "Help and support",
      onClick: () => {},
    },
    {
      icon: <FileTextIcon className="w-5 h-5 text-gray-600" />,
      title: "Terms and policies",
      onClick: () => {},
    },
  ];

  const appContent = (
    <div className={`flex flex-col bg-mfneutralsn-50 ${shouldShowFrame ? 'h-full' : 'min-h-screen'} ${!shouldShowFrame ? 'touch:h-screen' : ''}`}>
      <AppHeader title="Menu" showSearch={false} />

      {/* Content */}
      <div className={`flex-1 overflow-y-auto bg-white ${!shouldShowFrame ? 'touch:pb-20' : ''}`}>
        {/* User Profile Section */}
        <div className="px-6 py-6 border-b border-gray-100">
          <Button
            variant="ghost"
            className="flex items-center gap-4 h-auto p-0 text-left rounded-none hover:bg-transparent w-full"
          >
            <Avatar className="w-16 h-16">
              <AvatarImage src={`${BASE_PATH}avatar-2.png`} alt="Katie Smith" />
              <AvatarFallback>KS</AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start flex-1">
              <div className="font-MF-headings-h6-emphasis font-[number:var(--MF-headings-h6-emphasis-font-weight)] text-mfneutralsn-500 text-[length:var(--MF-headings-h6-emphasis-font-size)] tracking-[var(--MF-headings-h6-emphasis-letter-spacing)] leading-[var(--MF-headings-h6-emphasis-line-height)] [font-style:var(--MF-headings-h6-emphasis-font-style)]">
                Katie Smith
              </div>
              <div className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-300 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
                katie.smith@email.com
              </div>
            </div>
          </Button>
        </div>

        {/* Menu Section */}
        <div className="px-6 py-6">
          {/* Removed secondary "Menu" heading above items */}

          <div className="grid grid-cols-1 gap-4 mb-8">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={item.onClick}
                className="flex flex-col items-center gap-3 h-auto p-6 bg-white hover:bg-gray-50 rounded-lg border border-gray-100"
              >
                {item.icon}
                <span className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-400 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
                  {item.title}
                </span>
              </Button>
            ))}
          </div>

          {/* Settings Section */}
          <h3 className="font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-mfneutralsn-300 text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] [font-style:var(--MF-body-text-body-emphasis-font-style)] mb-4">
            Settings and preferences
          </h3>

          <div className="flex flex-col gap-2 mb-8">
            {settingsItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={item.onClick}
                className={`flex items-center gap-3 h-12 px-0 py-3 text-left rounded-none justify-start hover:bg-transparent ${
                  item.title === 'Help and support' || item.title === 'Terms and policies' ? 'cursor-default' : ''
                }`}
              >
                {item.icon}
                <span className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-400 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
                  {item.title}
                </span>
              </Button>
            ))}
          </div>

          {/* Log Out Button */}
          <Button
            variant="outline"
            className="w-full h-12 bg-white border-gray-200 text-mfneutralsn-400 hover:bg-gray-50 rounded-lg"
          >
            <LogOutIcon className="w-5 h-5 mr-2" />
            <span className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
              Log out
            </span>
          </Button>
        </div>
      </div>

      <div className={!shouldShowFrame ? 'sticky bottom-0 z-50' : ''}>
        <BottomNav />
      </div>
    </div>
  );

  return appContent;
};