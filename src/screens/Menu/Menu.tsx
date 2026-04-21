import { BASE_PATH } from '../../constants';
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeviceFrame } from "../../components/DeviceFrame/DeviceFrame";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { AccountSettings } from "../../components/AccountSettings/AccountSettings";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { 
  CalendarIcon, 
  SearchIcon, 
  CreditCardIcon,
  UsersIcon,
  HelpCircleIcon,
  FileTextIcon,
  LogOutIcon,
  ChevronRightIcon
} from "lucide-react";

export const Menu = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();
  const [showAccountSettings, setShowAccountSettings] = useState(false);

  if (showAccountSettings) {
    return (
      <DeviceFrame showFrame={shouldShowFrame}>
        <AccountSettings onClose={() => setShowAccountSettings(false)} />
      </DeviceFrame>
    );
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
    <div className={`flex flex-col bg-white ${shouldShowFrame ? 'h-full' : 'min-h-screen'} ${!shouldShowFrame ? 'touch:h-screen' : ''}`}>
      {/* Header */}
      <header className={`flex flex-col w-full items-start relative ${!shouldShowFrame ? 'sticky top-0 z-50' : ''}`}>
        <div className={`flex items-end justify-center px-0 py-2 relative w-full bg-mfprimaryp-400 ${!shouldShowFrame ? 'hidden' : ''}`}>
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
          <h1 className="font-MF-headings-h6-emphasis font-[number:var(--MF-headings-h6-emphasis-font-weight)] text-mfneutralsn-0 text-[length:var(--MF-headings-h6-emphasis-font-size)] leading-[var(--MF-headings-h6-emphasis-line-height)] tracking-[var(--MF-headings-h6-emphasis-letter-spacing)] [font-style:var(--MF-headings-h6-emphasis-font-style)]">
            Menu
          </h1>

          <div className="w-6 h-6" />
        </nav>
      </header>

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

      <div className={`bottom-nav flex flex-col max-w-screen-md items-center justify-end px-[9px] py-0 w-full bg-mfneutralsn-0 rounded-[0px_0px_16px_16px] ${!shouldShowFrame ? 'sticky bottom-0 z-50 shadow-lg' : ''}`}>
        <div className="flex items-center gap-[46px] pl-2 pr-4 pt-3 pb-[21px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center justify-between relative flex-1 grow">
            {/* Newsfeed */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl"
            >
              <img
                className="relative w-7 h-7 ml-[-2.00px] mr-[-2.00px]"
                alt="Newsfeed"
                src={`${BASE_PATH}navigation.svg`}
              />
            </Button>

            {/* Child Profile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/child-profile')}
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={`${BASE_PATH}infant--girl--profile-picture--caucasian--dark-hair.png`}
                  alt="Child profile"
                  className="border border-solid border-white object-cover"
                />
                <AvatarFallback>CP</AvatarFallback>
              </Avatar>
            </Button>

            {/* Messages */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/messages')}
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl"
            >
              <img
                className="relative w-7 h-7 ml-[-2.00px] mr-[-2.00px]"
                alt="Messages"
                src={`${BASE_PATH}navigation-2.svg`}
              />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/notifications')}
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl"
            >
              <img
                className="relative w-7 h-7 ml-[-2.00px] mr-[-2.00px]"
                alt="Notifications"
                src={`${BASE_PATH}navigation-1.svg`}
              />
            </Button>

            {/* Account - Active */}
            <Button
              variant="ghost"
              size="icon"
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl bg-mfprimaryp-100"
            >
              <Avatar className="w-12 h-12 border-0">
                <AvatarImage
                  src={`${BASE_PATH}avatar-2.png`}
                  alt="Account"
                  className="border border-solid border-white object-cover"
                />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DeviceFrame showFrame={shouldShowFrame}>
      {appContent}
    </DeviceFrame>
  );
};