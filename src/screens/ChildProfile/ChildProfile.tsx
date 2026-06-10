import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon, PillIcon, SunIcon } from "lucide-react";
import { DesktopNudge } from "../../components/DesktopNudge";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { useProfileVariant } from "../../hooks/useProfileVariant";
import { useChildProfileSubpageActive } from "../../hooks/useChildProfileSubpage";
import { BottomNav } from "../../components/BottomNav/BottomNav";
import { ChildProfileHeader } from "./components/ChildProfileHeader/ChildProfileHeader";
import { ChildProfileInfo } from "./components/ChildProfileInfo/ChildProfileInfo";
import { ChildProfileTabs, TabConfig } from "./components/ChildProfileTabs/ChildProfileTabs";
import { OverviewContent } from "./components/OverviewContent/OverviewContent";
import { HealthAndSafetyContent } from "./components/HealthAndSafetyContent/HealthAndSafetyContent";
import { DocumentsContent } from "./components/DocumentsContent/DocumentsContent";
import { BookingsContent } from "./components/BookingsContent/BookingsContent";
import { PaperworkContent } from "./components/PaperworkContent/PaperworkContent";

const PRIORITY_ITEMS: { id: string; label: string; Icon: React.ElementType }[] = [
  { id: "med", label: "Active medication - Zyrtec", Icon: PillIcon },
  { id: "holiday", label: "Upcoming holiday - Jun 21", Icon: SunIcon },
];

const PrioritySection = (): JSX.Element => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mx-3 mt-2 mb-3 rounded-xl bg-[#fdf5f3] border border-[#f4e5e0] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left"
      >
        <ChevronDownIcon
          className={`w-4 h-4 text-mfneutralsn-500 transition-transform ${open ? "" : "-rotate-90"}`}
        />
        <span className="text-[14px] font-medium text-mfneutralsn-500">Priority</span>
      </button>
      {open && (
        <div className="px-4 pb-3 flex flex-col gap-2">
          {PRIORITY_ITEMS.map(({ id, label, Icon }) => (
            <div key={id} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-white border border-[#f4e5e0] flex items-center justify-center flex-shrink-0 text-mfneutralsn-400">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[14px] text-mfneutralsn-500">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const V1_TABS: TabConfig[] = [
  { id: "about", label: "About" },
  { id: "health", label: "Health and safety" },
  { id: "documents", label: "Documents" },
];

const V2_TABS: TabConfig[] = [
  { id: "about", label: "About" },
  { id: "bookings", label: "Bookings" },
  { id: "paperwork", label: "Documents" },
];

export const ChildProfile = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const variant = useProfileVariant();
  const inSubpage = useChildProfileSubpageActive();
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
        {!inSubpage && (
          <>
            <ChildProfileInfo />
            <PrioritySection />
            <ChildProfileTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          </>
        )}
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
