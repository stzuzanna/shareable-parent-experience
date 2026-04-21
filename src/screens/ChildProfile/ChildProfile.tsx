import { BASE_PATH } from '../../constants';
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeviceFrame } from "../../components/DeviceFrame/DeviceFrame";
import { DesktopNudge } from "../../components/DesktopNudge";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { ChildProfileHeader } from "./components/ChildProfileHeader/ChildProfileHeader";
import { ChildProfileInfo } from "./components/ChildProfileInfo/ChildProfileInfo";
import { ChildProfileTabs } from "./components/ChildProfileTabs/ChildProfileTabs";
import { ActivityGrid } from "./components/ActivityGrid/ActivityGrid";
import { ActivityFeed } from "./components/ActivityFeed/ActivityFeed";
import { AboutPage } from "./components/AboutPage/AboutPage";
import { FamilyPage } from "./components/FamilyPage/FamilyPage";
import { PhotosPage } from "./components/PhotosPage/PhotosPage";

const navigationItems = [
  {
  icon: `${BASE_PATH}navigation.svg`,
    isActive: false,
    hasNotification: false,
  },
  {
  icon: `${BASE_PATH}navigation-2.svg`,
    isActive: false,
    hasNotification: true,
  },
  {
  icon: `${BASE_PATH}navigation-1.svg`,
    isActive: false,
    hasNotification: true,
  },
];

export const ChildProfile = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('activity');

  // If About tab is active, show the About page instead
  if (activeTab === 'about') {
    return (
      <DeviceFrame showFrame={shouldShowFrame}>
        <AboutPage onClose={() => setActiveTab('activity')} />
      </DeviceFrame>
    );
  }

  // If Family tab is active, show the Family page instead
  if (activeTab === 'family') {
    return (
      <DeviceFrame showFrame={shouldShowFrame}>
        <FamilyPage onClose={() => setActiveTab('activity')} />
      </DeviceFrame>
    );
  }

  // If Photos tab is active, show the Photos page instead
  if (activeTab === 'photos') {
    return (
      <DeviceFrame showFrame={shouldShowFrame}>
        <PhotosPage onClose={() => setActiveTab('activity')} />
      </DeviceFrame>
    );
  }

  const appContent = (
    <div className={`flex flex-col bg-neutral-100 ${shouldShowFrame ? 'h-full' : 'min-h-screen'} ${!shouldShowFrame ? 'touch:h-screen' : ''}`}>
      <ChildProfileHeader />
      <div className={`flex-1 overflow-y-auto bg-white ${!shouldShowFrame ? 'touch:pb-20' : ''}`}>
        <ChildProfileInfo />
        <ChildProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <ActivityGrid />
        <ActivityFeed />
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

            {/* Child Profile - Active */}
            <Button
              variant="ghost"
              size="icon"
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl bg-mfprimaryp-100"
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

            {/* Account */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/menu')}
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl"
            >
              <Avatar className="w-12 h-12">
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

  const tipsEnabled = new URLSearchParams(window.location.search).get('tips') === '1';
  return (
    <DeviceFrame showFrame={shouldShowFrame}>
      {appContent}
      {tipsEnabled && (
        <DesktopNudge
          text="Here parents can see everything you’ve logged for their child"
          side="left"
          visible={true}
        />
      )}
    </DeviceFrame>
  );
};