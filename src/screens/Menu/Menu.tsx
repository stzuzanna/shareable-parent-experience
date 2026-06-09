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
  CreditCardIcon,
  BellIcon,
  SearchIcon,
  PhoneIcon,
  ClockIcon,
  Settings2Icon,
} from "lucide-react";
import { BASE_PATH } from "../../constants";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { useToast } from "../../hooks/useToast";
import { usePaymentState, setPaid } from "../../hooks/usePaymentState";
import { useAutopayState } from "../../hooks/useAutopayState";
import { useHomeTabsVariant } from "../../hooks/useHomeTabsVariant";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { AppHeader } from "../../components/AppHeader/AppHeader";
import { BottomNav } from "../../components/BottomNav/BottomNav";
import { Toast } from "../../components/Toast/Toast";
import { Invoice } from "../../components/Invoice/Invoice";
import { ChildcareInfo } from "./ChildcareInfo";
import { PaymentSettings } from "./PaymentSettings";

const OUTSTANDING_AMOUNT = "1024.88";

const settingsItems = [
  { id: "contact-info", label: "Contact information", Icon: PencilIcon },
  { id: "password", label: "Password and sign in", Icon: LockIcon },
  { id: "language-notifications", label: "Language and notifications", Icon: GlobeIcon },
  { id: "payment-settings", label: "Payment settings", Icon: CreditCardIcon },
  { id: "help", label: "Help and support", Icon: HelpCircleIcon },
  { id: "terms", label: "Terms and policies", Icon: ScaleIcon },
] as const;

export const Menu = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();
  const isPaid = usePaymentState();
  const autopay = useAutopayState();
  const { toasts, showToast, removeToast } = useToast();
  const tabsVariant = useHomeTabsVariant();
  const isPills = tabsVariant === "pills";
  const [showInvoice, setShowInvoice] = useState(false);
  const [showChildcareInfo, setShowChildcareInfo] = useState(false);
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);

  if (showChildcareInfo) {
    return <ChildcareInfo onClose={() => setShowChildcareInfo(false)} />;
  }
  if (showPaymentSettings) {
    return <PaymentSettings onClose={() => setShowPaymentSettings(false)} />;
  }

  const comingSoon = () => showToast("Coming soon", "info");

  const onSettingsItem = (id: string) => {
    if (id === "payment-settings") setShowPaymentSettings(true);
    else comingSoon();
  };

  if (isPills) {
    const settingsList = [
      { id: "contact-info", label: "Contact information", Icon: PencilIcon, onClick: comingSoon },
      { id: "preferences", label: "Preferences", Icon: Settings2Icon, onClick: comingSoon },
      { id: "payments-link", label: "Payments", Icon: CreditCardIcon, onClick: () => navigate("/balance") },
      { id: "password", label: "Password and sign in", Icon: LockIcon, onClick: comingSoon },
    ];
    const supportList = [
      { id: "help", label: "Help and support", Icon: HelpCircleIcon, onClick: comingSoon },
      { id: "terms", label: "Terms and policies", Icon: ScaleIcon, onClick: comingSoon },
    ];

    return (
      <div className={`flex flex-col bg-white ${shouldShowFrame ? "h-full" : "min-h-screen"} ${!shouldShowFrame ? "touch:h-screen" : ""}`}>
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}

        {/* Header mirroring the pills home screen */}
        <header className={`flex flex-col w-full bg-white ${!shouldShowFrame ? "sticky top-0 z-50" : ""}`}>
          <div className={`flex items-center justify-between px-5 pt-2 pb-1 ${!shouldShowFrame ? "hidden" : ""}`}>
            <span className="font-semibold text-mfneutralsn-500 text-[15px] tracking-[-0.3px]">9:41</span>
            <img className="h-4" alt="Status icons" src={`${BASE_PATH}right-side.svg`} />
          </div>
          <div className="flex items-center justify-between px-5 pt-3 pb-4">
            <h1 className="text-[20px] font-bold text-mfneutralsn-500 tracking-tight leading-tight">Home</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/notifications")}
                aria-label="Notifications"
                className="relative"
              >
                <BellIcon className="w-5 h-5 text-mfneutralsn-400" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <SearchIcon className="w-5 h-5 text-mfneutralsn-400" />
            </div>
          </div>
        </header>

        <div className={`flex-1 overflow-y-auto bg-white ${!shouldShowFrame ? "touch:pb-20" : ""}`}>
          <div className="px-4 pb-6 space-y-6">
            {/* Profile row */}
            <div className="flex items-center gap-3 pt-2">
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

            {/* Payments section — lavender/blue background, matches Figma 1572-65711 */}
            <div className="space-y-3">
              <h2 className="text-[14px] text-mfneutralsn-400">Payments</h2>
              <div className="bg-brandblueb-50 rounded-2xl p-4">
                <button onClick={() => navigate("/balance")} className="w-full text-left">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className={`text-[28px] leading-none font-normal mb-2 ${isPaid ? "text-mfneutralsn-500" : "text-mfredr-400"}`}>
                        {isPaid ? "$0" : `$ -${OUTSTANDING_AMOUNT}`}
                      </div>
                      <div className="text-[14px] text-mfneutralsn-500">
                        {isPaid ? "Everything's settled. You don't owe anything." : "You owe money to the centre."}
                      </div>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-mfneutralsn-400 flex-shrink-0 mt-0.5" />
                  </div>
                </button>

                {/* Always-visible latest invoice subcard (white on the lavender card) */}
                <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 mt-3">
                  <div className="w-9 h-9 rounded-md bg-brandblueb-50 flex items-center justify-center flex-shrink-0">
                    <FileTextIcon className="w-4 h-4 text-brandblueb-400" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] text-mfneutralsn-300 leading-tight">
                      Latest invoice • Charged on Nov 24
                    </span>
                    <span className="text-[14px] text-mfneutralsn-500 leading-tight">Invoice for $1024.00</span>
                  </div>
                </div>

                {!isPaid && (
                  <Button
                    onClick={() => setShowInvoice(true)}
                    className="w-full h-12 bg-mfprimaryp-400 hover:bg-mfprimaryp-400/90 text-white rounded-lg font-medium mt-3"
                  >
                    Pay now
                  </Button>
                )}
              </div>
            </div>

            {/* Sandbox section — inline childcare info */}
            <div className="space-y-3 pt-4 border-t border-mfneutralsn-75">
              <div className="flex items-center justify-between">
                <h2 className="text-[14px] text-mfneutralsn-400">Sandbox</h2>
                <button
                  onClick={() => setShowChildcareInfo(true)}
                  className="text-[14px] text-mfprimaryp-400"
                >
                  See more
                </button>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-3 h-11">
                  <PhoneIcon className="w-4 h-4 text-mfneutralsn-400 flex-shrink-0" />
                  <span className="text-[14px] text-mfneutralsn-500">(202) 810-0946</span>
                </div>
                <div className="flex items-center gap-3 h-11">
                  <HomeIcon className="w-4 h-4 text-mfneutralsn-400 flex-shrink-0" />
                  <span className="text-[14px] text-mfneutralsn-500">1100 15th Street NW</span>
                </div>
                <div className="flex items-start gap-3 py-2">
                  <ClockIcon className="w-4 h-4 text-mfneutralsn-400 flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col leading-snug">
                    <span className="text-[14px] text-mfneutralsn-500">Mon - Fri 8:00am - 5:00pm</span>
                    <span className="text-[14px] text-mfneutralsn-500">Sat-Sun Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-2 pt-4 border-t border-mfneutralsn-75">
              <h2 className="text-[14px] text-mfneutralsn-400">Settings</h2>
              <div className="flex flex-col">
                {settingsList.map(({ id, label, Icon, onClick }) => (
                  <button
                    key={id}
                    onClick={onClick}
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
            </div>

            {/* Support */}
            <div className="space-y-2 pt-4 border-t border-mfneutralsn-75">
              <h2 className="text-[14px] text-mfneutralsn-400">Support</h2>
              <div className="flex flex-col">
                {supportList.map(({ id, label, Icon, onClick }) => (
                  <button
                    key={id}
                    onClick={onClick}
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
            </div>

            {/* Log out */}
            <button
              onClick={comingSoon}
              className="w-full flex items-center justify-center gap-2 py-3 text-[14px] text-mfredr-400 font-medium"
            >
              <LogOutIcon className="w-5 h-5" />
              <span>Log out</span>
            </button>
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
  }

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
                <span className="text-[14px] text-blue-700">You're set to pay invoices automatically</span>
              </div>
            )}

            {!isPaid && (
              <>
                <div className="flex items-center gap-2 bg-mfneutralsn-50 rounded-lg px-3 py-2 mt-3">
                  <div className="w-9 h-9 rounded-md bg-white border border-mfneutralsn-75 flex items-center justify-center flex-shrink-0">
                    <FileTextIcon className="w-4 h-4 text-mfneutralsn-400" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] text-mfneutralsn-300 leading-tight">
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
                onClick={() => onSettingsItem(id)}
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
