import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRightIcon,
  CalendarIcon,
  VideoIcon,
  LogOutIcon,
  FileTextIcon,
  PencilIcon,
  LockIcon,
  GlobeIcon,
  HelpCircleIcon,
  ScaleIcon,
  HomeIcon,
} from "lucide-react";
import { BASE_PATH } from "../../constants";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { useToast } from "../../hooks/useToast";
import { usePaymentState, setPaid } from "../../hooks/usePaymentState";
import { useAutopayState } from "../../hooks/useAutopayState";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { AppHeader } from "../../components/AppHeader/AppHeader";
import { BottomNav } from "../../components/BottomNav/BottomNav";
import { Toast } from "../../components/Toast/Toast";
import { Invoice } from "../../components/Invoice/Invoice";
import { ChildcareInfo } from "./ChildcareInfo";

const OUTSTANDING_AMOUNT = "1024.88";

const settingsItems = [
  { id: "contact-info", label: "Contact information", Icon: PencilIcon },
  { id: "password", label: "Password and sign in", Icon: LockIcon },
  { id: "language-notifications", label: "Language and notifications", Icon: GlobeIcon },
  { id: "help", label: "Help and support", Icon: HelpCircleIcon },
  { id: "terms", label: "Terms and policies", Icon: ScaleIcon },
] as const;

export const Menu = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();
  const isPaid = usePaymentState();
  const autopay = useAutopayState();
  const { toasts, showToast, removeToast } = useToast();
  const [showInvoice, setShowInvoice] = useState(false);
  const [showChildcareInfo, setShowChildcareInfo] = useState(false);

  if (showChildcareInfo) {
    return <ChildcareInfo onClose={() => setShowChildcareInfo(false)} />;
  }

  const comingSoon = () => showToast("Coming soon", "info");

  return (
    <div className={`flex flex-col bg-white ${shouldShowFrame ? "h-full" : "min-h-screen"} ${!shouldShowFrame ? "touch:h-screen" : ""}`}>
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}

      <AppHeader title="Your profile" />

      <div className={`flex-1 overflow-y-auto bg-white ${!shouldShowFrame ? "touch:pb-20" : ""}`}>
        <div className="px-4 pb-6 space-y-6">
          {/* Profile row */}
          <div className="flex items-center gap-3">
            <Avatar className="w-[71px] h-[71px] flex-shrink-0">
              <AvatarImage src={`${BASE_PATH}avatar-2.png`} alt="Matt Freedman" />
              <AvatarFallback>MF</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-[16px] font-medium text-mfneutralsn-500 leading-tight">Matt Freedman</div>
              <div className="text-[14px] text-mfneutralsn-300 leading-snug truncate">matt.freedman@email.com</div>
              <div className="text-[14px] text-mfneutralsn-300 leading-snug">+44 2324932948239</div>
            </div>
          </div>

          {/* Payments card */}
          <div className="bg-white border border-mfneutralsn-75 rounded-2xl p-4">
            <button
              onClick={() => navigate("/balance")}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] text-mfneutralsn-500">Payments</span>
                <ChevronRightIcon className="w-5 h-5 text-mfneutralsn-400" />
              </div>
              <div className={`text-[28px] leading-none font-normal mb-1 ${isPaid ? "text-mfneutralsn-500" : "text-mfredr-400"}`}>
                {isPaid ? "$0" : `$ -${OUTSTANDING_AMOUNT}`}
              </div>
              <div className="text-[14px] text-mfneutralsn-300">
                {isPaid ? "Everything's settled. You don't owe anything." : "You owe money to the centre."}
              </div>
            </button>

            {isPaid && autopay && (
              <div className="inline-flex items-center gap-2 px-3 h-7 mt-3 rounded-full bg-blue-50 border border-blue-500">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[13px] text-blue-700">You're set to pay invoices automatically</span>
              </div>
            )}

            {!isPaid && (
              <>
                <div className="flex items-center gap-2 bg-mfneutralsn-50 rounded-lg px-3 py-2 mt-3">
                  <div className="w-9 h-9 rounded-md bg-white border border-mfneutralsn-75 flex items-center justify-center flex-shrink-0">
                    <FileTextIcon className="w-4 h-4 text-mfneutralsn-400" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] text-mfneutralsn-300 leading-tight">
                      Latest invoice • Charged on Nov 24
                    </span>
                    <span className="text-[14px] text-mfneutralsn-500 leading-tight">Invoice for $1024.00</span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowInvoice(true)}
                  className="w-full h-12 bg-mfprimaryp-400 hover:bg-mfprimaryp-400/90 text-white rounded-lg font-medium mt-3"
                >
                  Pay now
                </Button>
              </>
            )}
          </div>

          {/* Navigation tiles */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={comingSoon}
              className="flex flex-col items-start justify-between h-[76px] bg-white border border-mfneutralsn-75 rounded-2xl p-3 hover:bg-gray-50"
            >
              <CalendarIcon className="w-6 h-6 text-mfprimaryp-400" />
              <span className="text-[14px] text-mfneutralsn-500 text-left">Calendar</span>
            </button>

            <button
              onClick={() => navigate("/activity-plans")}
              className="flex flex-col items-start justify-between h-[76px] bg-white border border-mfneutralsn-75 rounded-2xl p-3 hover:bg-gray-50"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-mfyellowy-400">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="text-[14px] text-mfneutralsn-500 text-left">Learning plans</span>
            </button>

            <button
              onClick={() => setShowChildcareInfo(true)}
              className="flex flex-col items-start justify-between h-[76px] bg-white border border-mfneutralsn-75 rounded-2xl p-3 hover:bg-gray-50"
            >
              <HomeIcon className="w-6 h-6 text-mfneutralsn-500" />
              <span className="text-[14px] text-mfneutralsn-500 text-left">Childcare info</span>
            </button>

            <button
              onClick={comingSoon}
              className="flex flex-col items-start justify-between h-[76px] bg-white border border-mfneutralsn-75 rounded-2xl p-3 hover:bg-gray-50"
            >
              <VideoIcon className="w-6 h-6 text-brandblueb-400" />
              <span className="text-[14px] text-mfneutralsn-500 text-left">WatchMeGrow</span>
            </button>
          </div>

          {/* Settings list */}
          <div className="flex flex-col">
            {settingsItems.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={comingSoon}
                className="flex items-center justify-between h-12 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-mfneutralsn-400" />
                  <span className="text-[14px] text-mfneutralsn-500">{label}</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-300" />
              </button>
            ))}
          </div>

          {/* Log out */}
          <Button
            variant="outline"
            onClick={comingSoon}
            className="w-full h-12 bg-white border-mfneutralsn-75 text-mfneutralsn-500 hover:bg-gray-50 rounded-lg"
          >
            <LogOutIcon className="w-5 h-5 mr-2" />
            <span className="text-[14px]">Log out</span>
          </Button>
        </div>
      </div>

      <div className={!shouldShowFrame ? "sticky bottom-0 z-50" : ""}>
        <BottomNav />
      </div>

      {showInvoice && (
        <Invoice
          onClose={() => setShowInvoice(false)}
          isPaid={isPaid}
          onPaymentSuccess={() => setPaid(true)}
        />
      )}
    </div>
  );
};
