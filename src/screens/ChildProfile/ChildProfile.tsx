import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeviceFrame } from "../../components/DeviceFrame/DeviceFrame";
import { DesktopNudge } from "../../components/DesktopNudge";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { BottomNav } from "../../components/BottomNav/BottomNav";
import { ChildProfileHeader } from "./components/ChildProfileHeader/ChildProfileHeader";
import { ChildProfileInfo } from "./components/ChildProfileInfo/ChildProfileInfo";
import { ChildProfileTabs } from "./components/ChildProfileTabs/ChildProfileTabs";
import { OverviewContent } from "./components/OverviewContent/OverviewContent";
import { HealthAndSafetyContent } from "./components/HealthAndSafetyContent/HealthAndSafetyContent";
import { DocumentsContent } from "./components/DocumentsContent/DocumentsContent";

export const ChildProfile = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'health':
        return <HealthAndSafetyContent />;
      case 'documents':
        return <DocumentsContent />;
      default:
        return <OverviewContent />;
    }
  };

  const appContent = (
    <div className={`relative flex flex-col bg-white ${shouldShowFrame ? 'h-full' : 'min-h-screen'} ${!shouldShowFrame ? 'touch:h-screen' : ''}`}>
      <ChildProfileHeader />
      <div className={`flex-1 overflow-y-auto ${!shouldShowFrame ? 'touch:pb-20' : ''}`}>
        <ChildProfileInfo />
        <ChildProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <div className={!shouldShowFrame ? 'sticky bottom-0 z-50' : ''}>
        <BottomNav />
      </div>

    </div>
  );

  const tipsEnabled = new URLSearchParams(window.location.search).get('tips') === '1';
  return (
    <DeviceFrame showFrame={shouldShowFrame}>
      {appContent}
      {tipsEnabled && (
        <DesktopNudge
          text="Here parents can see everything you've logged for their child"
          side="left"
          visible={true}
        />
      )}
    </DeviceFrame>
  );
};
