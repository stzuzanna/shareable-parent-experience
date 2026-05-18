import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DesktopNudge } from "../../components/DesktopNudge";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { useProfileVariant } from "../../hooks/useProfileVariant";
import { BottomNav } from "../../components/BottomNav/BottomNav";
import { ChildProfileHeader } from "./components/ChildProfileHeader/ChildProfileHeader";
import { ChildProfileInfo } from "./components/ChildProfileInfo/ChildProfileInfo";
import { ChildProfileTabs, TabConfig } from "./components/ChildProfileTabs/ChildProfileTabs";
import { OverviewContent } from "./components/OverviewContent/OverviewContent";
import { HealthAndSafetyContent } from "./components/HealthAndSafetyContent/HealthAndSafetyContent";
import { DocumentsContent } from "./components/DocumentsContent/DocumentsContent";
import { BookingsContent } from "./components/BookingsContent/BookingsContent";
import { PaperworkContent } from "./components/PaperworkContent/PaperworkContent";

const V1_TABS: TabConfig[] = [
  { id: "about", label: "About" },
  { id: "health", label: "Health and safety" },
  { id: "documents", label: "Documents" },
];

const V2_TABS: TabConfig[] = [
  { id: "about", label: "About" },
  { id: "bookings", label: "Bookings" },
  { id: "paperwork", label: "Paperwork" },
];

export const ChildProfile = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const variant = useProfileVariant();
  const navigate = useNavigate();

  const tabs = variant === "v2" ? V2_TABS : V1_TABS;
  const [activeTab, setActiveTab] = useState<string>("about");

  // When variant changes, fall back to About if the current tab isn't in the new variant
  useEffect(() => {
    if (!tabs.some((t) => t.id === activeTab)) {
      setActiveTab("about");
    }
  }, [tabs, activeTab]);

  const renderTabContent = () => {
    if (activeTab === "about") return <OverviewContent />;
    if (variant === "v1") {
      if (activeTab === "health") return <HealthAndSafetyContent />;
      if (activeTab === "documents") return <DocumentsContent />;
    }
    if (variant === "v2") {
      if (activeTab === "bookings") return <BookingsContent />;
      if (activeTab === "paperwork") return <PaperworkContent />;
    }
    return <OverviewContent />;
  };

  const appContent = (
    <div className={`relative flex flex-col bg-white ${shouldShowFrame ? 'h-full' : 'min-h-screen'} ${!shouldShowFrame ? 'touch:h-screen' : ''}`}>
      <ChildProfileHeader />
      <div className={`flex-1 overflow-y-auto ${!shouldShowFrame ? 'touch:pb-20' : ''}`}>
        <ChildProfileInfo />
        <ChildProfileTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
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
    <>
      {appContent}
      {tipsEnabled && (
        <DesktopNudge
          text="Here parents can see everything you've logged for their child"
          side="left"
          visible={true}
        />
      )}
    </>
  );
};
