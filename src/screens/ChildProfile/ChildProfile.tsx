import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PillIcon, SunIcon } from "lucide-react";
import { DesktopNudge } from "../../components/DesktopNudge";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { useProfileVariant } from "../../hooks/useProfileVariant";
import { useChildProfileSubpageActive } from "../../hooks/useChildProfileSubpage";
import { BottomNav } from "../../components/BottomNav/BottomNav";
import { ChildProfileHeader } from "./components/ChildProfileHeader/ChildProfileHeader";
import { ChildProfileTabs, TabConfig } from "./components/ChildProfileTabs/ChildProfileTabs";
import { OverviewContent } from "./components/OverviewContent/OverviewContent";
import { HealthAndSafetyContent } from "./components/HealthAndSafetyContent/HealthAndSafetyContent";
import { DocumentsContent } from "./components/DocumentsContent/DocumentsContent";
import { BookingsContent } from "./components/BookingsContent/BookingsContent";
import { PaperworkContent } from "./components/PaperworkContent/PaperworkContent";

const PRIORITY_ITEMS: {
  id: string;
  label: string;
  sublabel: string;
  Icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}[] = [
  { id: "med", label: "Active medication", sublabel: "Zyrtec", Icon: PillIcon, iconBg: "#ebf5fe", iconColor: "#067aef" },
  { id: "holiday", label: "Upcoming holiday", sublabel: "Jun 21", Icon: SunIcon, iconBg: "#fef0cd", iconColor: "#c08700" },
];

const PrioritySection = (): JSX.Element => (
  <div className="px-4 pt-3 pb-1 flex flex-col gap-2">
    {PRIORITY_ITEMS.map(({ id, label, sublabel, Icon, iconBg, iconColor }) => (
      <div
        key={id}
        className="flex items-center gap-3 px-3 py-3 rounded-xl border border-[#f1f1f4] bg-white"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg }}
        >
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-mfneutralsn-500 leading-tight">{label}</p>
          <p className="text-[13px] text-mfneutralsn-300 mt-0.5 leading-tight">{sublabel}</p>
        </div>
      </div>
    ))}
  </div>
);

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
    <div className={`relative flex flex-col bg-white ${shouldShowFrame ? "h-full" : "min-h-screen"} ${!shouldShowFrame ? "touch:h-screen" : ""}`}>
      <ChildProfileHeader />
      <div className={`flex-1 overflow-y-auto ${!shouldShowFrame ? "touch:pb-20" : ""}`}>
        {!inSubpage && (
          <>
            <PrioritySection />
            <ChildProfileTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          </>
        )}
        {renderTabContent()}
      </div>

      <div className={!shouldShowFrame ? "sticky bottom-0 z-50" : ""}>
        <BottomNav />
      </div>
    </div>
  );

  const tipsEnabled = new URLSearchParams(window.location.search).get("tips") === "1";
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
