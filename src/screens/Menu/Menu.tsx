import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRightIcon,
  SettingsIcon,
  CalendarIcon,
  VideoIcon,
  LogOutIcon,
  FileTextIcon,
} from "lucide-react";
import { BASE_PATH } from "../../constants";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { useToast } from "../../hooks/useToast";
import { usePaymentState, setPaid } from "../../hooks/usePaymentState";
import { AccountSettings } from "../../components/AccountSettings/AccountSettings";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { AppHeader } from "../../components/AppHeader/AppHeader";
import { BottomNav } from "../../components/BottomNav/BottomNav";
import { Toast } from "../../components/Toast/Toast";
import { Invoice } from "../../components/Invoice/Invoice";

const OUTSTANDING_AMOUNT = "1024.88";

export const Menu = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();
  const isPaid = usePaymentState();
  const { toasts, showToast, removeToast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  if (showSettings) {
    return <AccountSettings onClose={() => setShowSettings(false)} />;
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
            <button
              onClick={() => setShowSettings(true)}
              aria-label="Settings"
              className="w-12 h-12 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0 hover:bg-gray-50"
            >
              <SettingsIcon className="w-5 h-5 text-mfneutralsn-400" />
            </button>
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
              <div className="flex items-center gap-1 w-full">
                <span className="text-[14px] text-mfneutralsn-500 flex-1 text-left">Calendar</span>
                <ChevronRightIcon className="w-3.5 h-3.5 text-mfneutralsn-300" />
              </div>
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
              <div className="flex items-center gap-1 w-full">
                <span className="text-[14px] text-mfneutralsn-500 flex-1 text-left">Learning plans</span>
                <ChevronRightIcon className="w-3.5 h-3.5 text-mfneutralsn-300" />
              </div>
            </button>

            <button
              onClick={comingSoon}
              className="flex flex-col items-start justify-between h-[76px] bg-white border border-mfneutralsn-75 rounded-2xl p-3 hover:bg-gray-50"
            >
              <VideoIcon className="w-6 h-6 text-brandblueb-400" />
              <div className="flex items-center gap-1 w-full">
                <span className="text-[14px] text-mfneutralsn-500 flex-1 text-left">WatchMeGrow</span>
                <ChevronRightIcon className="w-3.5 h-3.5 text-mfneutralsn-300" />
              </div>
            </button>
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
