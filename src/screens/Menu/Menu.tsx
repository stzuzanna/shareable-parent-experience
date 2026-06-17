import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRightIcon,
  LogOutIcon,
  FileTextIcon,
  PencilIcon,
  LockIcon,
  HelpCircleIcon,
  ScaleIcon,
  CreditCardIcon,
  BellIcon,
  SearchIcon,
  UserCogIcon,
  HeartIcon,
} from "lucide-react";
import { BASE_PATH } from "../../constants";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { useToast } from "../../hooks/useToast";
import { usePaymentState, setPaid } from "../../hooks/usePaymentState";
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

// ─── Shared sub-components ───────────────────────────────────────────────────

const MenuRow: React.FC<{ icon: React.ElementType; label: string; onClick: () => void }> = ({
  icon: Icon,
  label,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between h-12 w-full active:bg-mfneutralsn-50 transition-colors"
  >
    <div className="flex items-center gap-3">
      <Icon className="w-[22px] h-[22px] text-mfneutralsn-400 flex-shrink-0" />
      <span className="text-[14px] font-semibold text-mfneutralsn-500">{label}</span>
    </div>
    <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-300 flex-shrink-0" />
  </button>
);

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[14px] text-mfneutralsn-300 py-1.5">{children}</p>
);

// ─── Profile header card ─────────────────────────────────────────────────────

const ProfileCard: React.FC<{ onEdit: () => void }> = ({ onEdit }) => (
  <div className="py-4">
    {/* Avatar row: avatar left, edit button top-right */}
    <div className="flex items-start justify-between mb-4">
      <Avatar className="w-[100px] h-[100px] border-4 border-white shadow-sm">
        <AvatarImage src={`${BASE_PATH}avatar-2.png`} alt="Matt Freedman" className="object-cover" />
        <AvatarFallback>MF</AvatarFallback>
      </Avatar>
      <button
        onClick={onEdit}
        className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center active:bg-mfneutralsn-50 transition-colors flex-shrink-0"
        aria-label="Edit profile"
      >
        <PencilIcon className="w-4 h-4 text-mfneutralsn-400" />
      </button>
    </div>

    {/* Name + role pill + contact */}
    <div className="flex flex-col gap-2">
      <p className="text-[16px] font-semibold text-mfneutralsn-500 leading-snug">Matt Freedman</p>

      {/* Role pill — blue outlined with heart icon */}
      <div className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full border border-[#067AEF] bg-[#F5FAFF] self-start">
        <HeartIcon className="w-3.5 h-3.5 text-[#067AEF] fill-[#067AEF] flex-shrink-0" />
        <span className="text-[13px] text-mfneutralsn-500 leading-none">Tobin's parent</span>
      </div>

      {/* Email · Phone */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[12px] text-mfneutralsn-300">matt.freedman@email.com</span>
        <span className="w-1 h-1 rounded-full bg-mfneutralsn-200 flex-shrink-0" />
        <span className="text-[12px] text-mfneutralsn-300">+44 2324932948239</span>
      </div>
    </div>
  </div>
);

// ─── Payments card ────────────────────────────────────────────────────────────

const PaymentsCard: React.FC<{
  isPaid: boolean;
  onNavigate: () => void;
  onPayNow: () => void;
}> = ({ isPaid, onNavigate, onPayNow }) => (
  <div className="rounded-2xl p-4 border border-[#F4EDFC]" style={{ backgroundColor: "#F5FAFF" }}>
    {/* Balance + chevron */}
    <button onClick={onNavigate} className="w-full text-left flex items-start justify-between mb-3">
      <div>
        <p className={`text-[32px] font-normal leading-tight tracking-tight ${isPaid ? "text-mfneutralsn-500" : "text-red-600"}`}>
          {isPaid ? "$0" : `–$${OUTSTANDING_AMOUNT}`}
        </p>
        <p className="text-[14px] text-mfneutralsn-300 mt-0.5">
          {isPaid ? (
            <><span className="font-medium text-mfneutralsn-500">Everything's settled. </span>You don't owe anything.</>
          ) : (
            "You owe money to the centre."
          )}
        </p>
      </div>
      <ChevronRightIcon className="w-5 h-5 text-mfneutralsn-300 flex-shrink-0 mt-2" />
    </button>

    {/* Latest invoice subcard */}
    <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EBF5FE" }}>
        <FileTextIcon className="w-4 h-4 text-[#067AEF]" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[12px] text-mfneutralsn-300 leading-tight">
          Latest invoice&nbsp;•&nbsp;Charged on Nov 24
        </span>
        <span className="text-[14px] text-mfneutralsn-500 leading-tight">Invoice for $1024.00</span>
      </div>
    </div>

    {!isPaid && (
      <Button
        onClick={onPayNow}
        className="w-full h-12 bg-mfprimaryp-400 hover:bg-mfprimaryp-400/90 text-white rounded-xl font-medium mt-3"
      >
        Pay now
      </Button>
    )}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const Menu = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();
  const isPaid = usePaymentState();
  const { toasts, showToast, removeToast } = useToast();
  const tabsVariant = useHomeTabsVariant();
  const isPills = tabsVariant === "pills" || tabsVariant === "sidekick";
  const [showInvoice, setShowInvoice] = useState(false);
  const [showChildcareInfo, setShowChildcareInfo] = useState(false);
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);

  if (showChildcareInfo) return <ChildcareInfo onClose={() => setShowChildcareInfo(false)} />;
  if (showPaymentSettings) return <PaymentSettings onClose={() => setShowPaymentSettings(false)} />;

  const comingSoon = () => showToast("Coming soon", "info");

  const settingsList: { id: string; label: string; icon: React.ElementType; onClick: () => void }[] = [
    { id: "payments", label: "Payments", icon: CreditCardIcon, onClick: () => navigate("/balance") },
    { id: "notifications", label: "Notifications and messaging", icon: BellIcon, onClick: comingSoon },
    { id: "password", label: "Password and sign in", icon: LockIcon, onClick: comingSoon },
    { id: "language", label: "Language", icon: UserCogIcon, onClick: comingSoon },
  ];

  const supportList: { id: string; label: string; icon: React.ElementType; onClick: () => void }[] = [
    { id: "help", label: "Help and support", icon: HelpCircleIcon, onClick: comingSoon },
    { id: "terms", label: "Terms and policies", icon: ScaleIcon, onClick: comingSoon },
  ];

  const content = (
    <div className={`flex-1 overflow-y-auto ${!shouldShowFrame ? "touch:pb-24" : ""}`}>
      <div className="px-4 pb-8">
        {/* Profile */}
        <ProfileCard onEdit={comingSoon} />

        {/* Payments */}
        <div className="mb-5">
          <SectionLabel>Payments</SectionLabel>
          <PaymentsCard
            isPaid={isPaid}
            onNavigate={() => navigate("/balance")}
            onPayNow={() => setShowInvoice(true)}
          />
        </div>

        {/* Settings */}
        <div className="border-t border-mfneutralsn-75 pt-4 mb-1">
          <SectionLabel>Settings</SectionLabel>
          <div className="flex flex-col">
            {settingsList.map(({ id, label, icon, onClick }) => (
              <MenuRow key={id} icon={icon} label={label} onClick={onClick} />
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="border-t border-mfneutralsn-75 pt-4 mb-1">
          <SectionLabel>Support</SectionLabel>
          <div className="flex flex-col">
            {supportList.map(({ id, label, icon, onClick }) => (
              <MenuRow key={id} icon={icon} label={label} onClick={onClick} />
            ))}
          </div>
        </div>

        {/* Log out */}
        <button
          onClick={comingSoon}
          className="flex items-center gap-2 mt-4 py-3 text-[16px] text-[#C20A0A]"
        >
          <LogOutIcon className="w-[18px] h-[18px]" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  if (isPills) {
    return (
      <div className={`flex flex-col bg-white ${shouldShowFrame ? "h-full" : "min-h-screen"}`}>
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}

        {/* Header */}
        <header className="flex flex-col w-full bg-white">
          {shouldShowFrame && (
            <div className="flex items-center justify-between px-5 pt-2 pb-1">
              <span className="font-semibold text-mfneutralsn-500 text-[15px]">9:41</span>
              <img className="h-4" alt="Status icons" src={`${BASE_PATH}right-side.svg`} />
            </div>
          )}
          <div className="flex items-center justify-between px-5 pt-3 pb-2">
            <h1 className="text-[20px] font-semibold text-mfneutralsn-500 tracking-tight">Your profile</h1>
            <SearchIcon className="w-5 h-5 text-mfneutralsn-400" />
          </div>
        </header>

        {content}

        <div className={!shouldShowFrame ? "sticky bottom-0 z-50" : ""}>
          <BottomNav />
        </div>

        {showInvoice && (
          <Invoice onClose={() => setShowInvoice(false)} isPaid={isPaid} onPaymentSuccess={() => setPaid(true)} />
        )}
      </div>
    );
  }

  // V1 / underline tabs
  return (
    <div className={`flex flex-col bg-white ${shouldShowFrame ? "h-full" : "min-h-screen"}`}>
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}

      <AppHeader title="Your profile" />

      {content}

      <div className={!shouldShowFrame ? "sticky bottom-0 z-50" : ""}>
        <BottomNav />
      </div>

      {showInvoice && (
        <Invoice onClose={() => setShowInvoice(false)} isPaid={isPaid} onPaymentSuccess={() => setPaid(true)} />
      )}
    </div>
  );
};
