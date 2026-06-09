import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  PencilIcon,
  LockIcon,
  GlobeIcon,
  HelpCircleIcon,
  ScaleIcon,
} from "lucide-react";
import { BASE_PATH } from "../../constants";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { useToast } from "../../hooks/useToast";
import { Toast } from "../Toast/Toast";
import { BottomNav } from "../BottomNav/BottomNav";

interface AccountSettingsProps {
  onClose: () => void;
}

const settingsItems = [
  { id: "contact-info", label: "Contact information", Icon: PencilIcon },
  { id: "password", label: "Password and sign in", Icon: LockIcon },
  { id: "language-notifications", label: "Language and notifications", Icon: GlobeIcon },
  { id: "help", label: "Help and support", Icon: HelpCircleIcon },
  { id: "terms", label: "Terms and policies", Icon: ScaleIcon },
] as const;

export const AccountSettings: React.FC<AccountSettingsProps> = ({ onClose }): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const { toasts, showToast, removeToast } = useToast();

  const comingSoon = () => showToast("Coming soon", "info");

  return (
    <div className={`flex flex-col bg-white ${shouldShowFrame ? "h-full" : "min-h-screen"} ${!shouldShowFrame ? "touch:h-screen" : ""}`}>
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}

      {/* Header */}
      <header className={`flex flex-col w-full bg-white ${!shouldShowFrame ? "sticky top-0 z-50" : ""}`}>
        {/* Fake status bar — only inside the device frame so it clears the Dynamic Island */}
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
          <h1 className="text-[20px] font-medium text-mfneutralsn-500">Settings</h1>
          <SearchIcon className="w-5 h-5 text-mfneutralsn-400" />
        </div>
      </header>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto bg-white ${!shouldShowFrame ? "touch:pb-20" : ""}`}>
        <div className="px-4 pt-6">
          <div className="flex flex-col">
            {settingsItems.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={comingSoon}
                className="flex items-center justify-between h-12 rounded-xl hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-mfneutralsn-400" />
                  <span className="text-[16px] text-mfneutralsn-500">{label}</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={!shouldShowFrame ? "sticky bottom-0 z-[75]" : "relative z-[75]"}>
        <BottomNav />
      </div>
    </div>
  );
};
