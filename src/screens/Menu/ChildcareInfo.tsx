import React from "react";
import { ChevronLeftIcon, SearchIcon, MessageSquareIcon, HomeIcon, PhoneIcon, InfoIcon, CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_PATH } from "../../constants";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { BottomNav } from "../../components/BottomNav/BottomNav";

const KEY_PERSON_NAME = "Olivia Wilson";
const KEY_PERSON_INITIALS = "OW";
const KEY_PERSON_CHAT_ID = 1;
const KEY_PERSON_AVATAR =
  "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400";

const SubsectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="px-4 pt-5 pb-3 text-[16px] font-medium text-mfneutralsn-400">{children}</p>
);

const InfoIconRow = ({
  icon,
  label,
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
}) => (
  <div className="flex h-12 items-center justify-between gap-3 px-4 w-full border-b border-mfneutralsn-75">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-6 h-6 rounded-md bg-mfneutralsn-75 flex items-center justify-center flex-shrink-0 text-mfneutralsn-400">
        {icon}
      </div>
      <p className="text-[14px] text-mfneutralsn-400 truncate">{label}</p>
    </div>
    {trailing && <div className="flex-shrink-0">{trailing}</div>}
  </div>
);

const KeyPersonRow = ({ onMessage }: { onMessage: () => void }) => (
  <div className="flex h-12 items-center justify-between gap-3 px-4 w-full border-b border-mfneutralsn-75">
    <div className="flex items-center gap-3 min-w-0">
      <Avatar className="w-6 h-6 flex-shrink-0">
        <AvatarImage src={KEY_PERSON_AVATAR} alt={KEY_PERSON_NAME} />
        <AvatarFallback className="text-[10px]">{KEY_PERSON_INITIALS}</AvatarFallback>
      </Avatar>
      <p className="text-[14px] text-mfneutralsn-400 truncate">Key person: {KEY_PERSON_NAME}</p>
    </div>
    <button
      onClick={onMessage}
      aria-label={`Message ${KEY_PERSON_NAME}`}
      className="w-8 h-8 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0 active:bg-gray-50"
    >
      <MessageSquareIcon className="w-4 h-4 text-mfneutralsn-400" />
    </button>
  </div>
);

const ClosureRow = ({ label, sublabel }: { label: string; sublabel: string }) => (
  <div className="flex items-center justify-between gap-3 px-4 py-3 w-full border-b border-mfneutralsn-75">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-6 h-6 rounded-md bg-mfneutralsn-75 flex items-center justify-center flex-shrink-0 text-mfneutralsn-400">
        <CalendarIcon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[14px] text-mfneutralsn-400 truncate">{label}</p>
        <p className="text-[14px] text-mfneutralsn-300 mt-0.5 truncate">{sublabel}</p>
      </div>
    </div>
  </div>
);

interface ChildcareInfoProps {
  onClose: () => void;
}

export const ChildcareInfo: React.FC<ChildcareInfoProps> = ({ onClose }): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();

  return (
    <div
      className={`flex flex-col bg-white ${
        shouldShowFrame ? "h-full" : "min-h-screen"
      } ${!shouldShowFrame ? "touch:h-screen" : ""}`}
    >
      {/* Header */}
      <header className={`flex flex-col w-full bg-white ${!shouldShowFrame ? "sticky top-0 z-50" : ""}`}>
        <div className={`flex items-center justify-between px-5 pt-2 pb-1 ${!shouldShowFrame ? "hidden" : ""}`}>
          <span className="font-semibold text-mfneutralsn-500 text-[15px] tracking-[-0.3px]">9:41</span>
          <img className="h-4" alt="Status icons" src={`${BASE_PATH}right-side.svg`} />
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onClose}
            aria-label="Back"
            className="w-7 h-7 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center"
          >
            <ChevronLeftIcon className="w-4 h-4 text-mfneutralsn-500" />
          </button>
          <h1 className="text-[20px] font-medium text-mfneutralsn-500">Childcare info</h1>
          <SearchIcon className="w-5 h-5 text-mfneutralsn-400" />
        </div>
      </header>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto bg-white ${!shouldShowFrame ? "touch:pb-20" : ""}`}>
        <SubsectionTitle>Centre</SubsectionTitle>
        <KeyPersonRow onMessage={() => navigate(`/messages/chat/${KEY_PERSON_CHAT_ID}`)} />
        <InfoIconRow icon={<HomeIcon className="w-4 h-4" />} label="11 NW Street NY" />
        <InfoIconRow icon={<PhoneIcon className="w-4 h-4" />} label="+1 (245) 464-6464" />
        <InfoIconRow icon={<InfoIcon className="w-4 h-4" />} label="Gate code: 1243" />

        <SubsectionTitle>Upcoming closure days</SubsectionTitle>
        <ClosureRow label="14 May 2026" sublabel="Ascension Day" />
        <ClosureRow label="25 May 2026" sublabel="Memorial Day" />
        <ClosureRow label="14 Jun - 14 Jul 2026" sublabel="Summer holidays" />
        <ClosureRow label="4 Jul 2026" sublabel="Independence Day" />
        <ClosureRow label="7 Sep 2026" sublabel="Labor Day" />

        <SubsectionTitle>Past closure days</SubsectionTitle>
        <ClosureRow label="25 Dec 2025 - 1 Jan 2026" sublabel="Winter holidays" />
        <ClosureRow label="27 Nov 2025" sublabel="Thanksgiving" />

        <div className="pb-24" />
      </div>

      <div className={!shouldShowFrame ? "sticky bottom-0 z-50" : ""}>
        <BottomNav />
      </div>
    </div>
  );
};
