import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
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
  ArrowLeftRightIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
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
import { NotificationSettings } from "./NotificationSettings";
import { SecuritySettings } from "./SecuritySettings";
import { LanguageSettings } from "./LanguageSettings";

const OUTSTANDING_AMOUNT = "1024.88";

// ─── Switch-account sheet ─────────────────────────────────────────────────────

const CHILDCARE_SITES = [
  {
    id: "sunflower",
    name: "Sunflower Nursery",
    role: "Parent",
    initials: "SN",
    color: "#FFF3CD",
    textColor: "#B45309",
    active: true,
  },
  {
    id: "oaktree",
    name: "Oak Tree Day Care",
    role: "Manager",
    initials: "OT",
    color: "#DCFCE7",
    textColor: "#166534",
    active: false,
  },
];

const SwitchAccountSheet: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <motion.div
    className="fixed inset-0 z-50 flex flex-col justify-end"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />

    {/* Sheet */}
    <motion.div
      className="relative bg-white rounded-t-3xl px-5 pt-5 pb-10 flex flex-col gap-4"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
    >
      {/* Handle */}
      <div className="w-10 h-1 rounded-full bg-mfneutralsn-100 mx-auto -mt-1 mb-1" />

      <p className="text-[16px] font-semibold text-mfneutralsn-500">Switch account</p>
      <p className="text-[13px] text-mfneutralsn-300 -mt-2">You're enrolled at these childcare centres</p>

      <div className="flex flex-col gap-2">
        {CHILDCARE_SITES.map((site) => (
          <button
            key={site.id}
            onClick={onClose}
            className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
              site.active
                ? "border-[#067AEF] bg-[#F5FAFF]"
                : "border-mfneutralsn-100 bg-white active:bg-mfneutralsn-50"
            }`}
          >
            {/* Site avatar */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-[15px] font-bold"
              style={{ backgroundColor: site.color, color: site.textColor }}
            >
              {site.initials}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <p className="text-[14px] font-semibold text-mfneutralsn-500 leading-snug">{site.name}</p>
              <p className="text-[12px] text-mfneutralsn-300 leading-snug">{site.role}</p>
            </div>

            {site.active && (
              <span className="text-[11px] font-medium text-[#067AEF] bg-[#EBF5FE] px-2 py-0.5 rounded-full flex-shrink-0">
                Active
              </span>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

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

// ─── Edit profile page ────────────────────────────────────────────────────────

const InputField: React.FC<{
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  type?: string;
}> = ({ label, value, placeholder, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[14px] font-semibold text-mfneutralsn-500">{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 px-4 rounded-xl border border-mfneutralsn-200 bg-white text-[14px] text-mfneutralsn-500 placeholder:text-mfneutralsn-200 outline-none focus:border-mfprimaryp-400 transition-colors"
    />
  </div>
);

const SelectField: React.FC<{
  label: string;
  value: string;
  placeholder?: string;
  options: string[];
  onChange: (v: string) => void;
}> = ({ label, value, placeholder, options, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[14px] font-semibold text-mfneutralsn-500">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-12 px-4 pr-10 rounded-xl border border-mfneutralsn-200 bg-white text-[14px] outline-none focus:border-mfprimaryp-400 transition-colors appearance-none ${value ? "text-mfneutralsn-500" : "text-mfneutralsn-200"}`}
      >
        <option value="" disabled>{placeholder || "Select…"}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronRightIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mfneutralsn-300 rotate-90 pointer-events-none" />
    </div>
  </div>
);

export const EditProfile: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { shouldShowFrame } = useDeviceDetection();
  const [fields, setFields] = useState({
    name: "Martha Freedman",
    preferredName: "Martha",
    dob: "12 Mar 1985",
    languages: "English",
    nationality: "",
    birthplace: "London",
    email: "martha.freedman@email.com",
    phone: "+44 2324932948239",
    relationship: "Abby's mum",
  });

  const set = (key: keyof typeof fields) => (v: string) => setFields((f) => ({ ...f, [key]: v }));

  return (
    <div className={`flex flex-col bg-white ${shouldShowFrame ? "h-full" : "min-h-screen"}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-mfneutralsn-75">
        <button onClick={onClose} className="w-9 h-9 rounded-full border border-mfneutralsn-100 flex items-center justify-center active:bg-mfneutralsn-50 transition-colors flex-shrink-0">
          <ChevronLeftIcon className="w-4 h-4 text-mfneutralsn-400" />
        </button>
        <h1 className="text-[16px] font-semibold text-mfneutralsn-500">About</h1>
        <button onClick={onClose} className="w-9 h-9 rounded-full border border-mfneutralsn-100 flex items-center justify-center active:bg-mfneutralsn-50 transition-colors flex-shrink-0">
          <span className="text-[16px] text-mfneutralsn-400 leading-none">✕</span>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Avatar row */}
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="w-11 h-11 rounded-full bg-[#EBF5FE] flex items-center justify-center flex-shrink-0">
            <span className="text-[14px] font-semibold text-[#067AEF]">MF</span>
          </div>
          <span className="text-[16px] font-semibold text-mfneutralsn-500">{fields.name}</span>
        </div>

        <div className="px-4 flex flex-col gap-4">
          {/* Section label */}
          <p className="text-[14px] font-semibold text-mfprimaryp-400 -mb-1">Basic info</p>

          <InputField label="Full name"       value={fields.name}          onChange={set("name")}          placeholder="Your full name" />
          <InputField label="Preferred name"  value={fields.preferredName} onChange={set("preferredName")} placeholder="What people call you" />
          <InputField label="Date of birth"   value={fields.dob}           onChange={set("dob")}           placeholder="DD MMM YYYY" />
          <InputField label="Languages"       value={fields.languages}     onChange={set("languages")}     placeholder="e.g. English, Spanish" />
          <SelectField
            label="Nationality"
            value={fields.nationality}
            placeholder="Search or select an option"
            options={["British", "American", "Australian", "Canadian", "German", "French", "Irish", "Other"]}
            onChange={set("nationality")}
          />
          <InputField label="Birthplace"      value={fields.birthplace}    onChange={set("birthplace")}    placeholder="City or country" />

          {/* Contact */}
          <p className="text-[14px] font-semibold text-mfprimaryp-400 mt-2 -mb-1">Contact</p>
          <InputField label="Email"        value={fields.email}        onChange={set("email")}        type="email" />
          <InputField label="Phone number" value={fields.phone}        onChange={set("phone")}        type="tel" />

          {/* Role */}
          <p className="text-[14px] font-semibold text-mfprimaryp-400 mt-2 -mb-1">Role</p>
          <InputField label="Relationship" value={fields.relationship} onChange={set("relationship")} placeholder="e.g. Mum, Dad, Guardian" />
        </div>
      </div>

      {/* Cancel + Save */}
      <div className="fixed bottom-0 left-0 right-0 flex gap-3 px-4 pb-8 pt-3 bg-white border-t border-mfneutralsn-75">
        <button
          onClick={onClose}
          className="flex-1 h-12 rounded-2xl border border-mfneutralsn-200 text-[15px] font-semibold text-mfneutralsn-500 active:bg-mfneutralsn-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="flex-1 h-12 rounded-2xl bg-mfprimaryp-400 text-white text-[15px] font-semibold active:opacity-80 transition-opacity"
        >
          Save
        </button>
      </div>
    </div>
  );
};

// ─── Profile header card ─────────────────────────────────────────────────────

const ProfileCard: React.FC<{ onEdit: () => void; onSwitchAccount: () => void }> = ({ onEdit, onSwitchAccount }) => (
  <div className="pt-4 pb-2">
    {/* Horizontal layout: avatar | name+contact+pill | edit */}
    <div className="flex items-center gap-4">
      <Avatar className="w-[72px] h-[72px] flex-shrink-0 border-2 border-white shadow-sm">
        <AvatarImage src={`${BASE_PATH}avatar-2.png`} alt="Matt Freedman" className="object-cover" />
        <AvatarFallback>MF</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <p className="text-[16px] font-semibold text-mfneutralsn-500 leading-snug">Martha Freedman</p>
        <div className="flex flex-col gap-0.5">
          <span className="text-[12px] text-mfneutralsn-300 leading-snug">matt.freedman@email.com</span>
          <span className="text-[12px] text-mfneutralsn-300 leading-snug">+44 2324932948239</span>
        </div>
        {/* Role pill */}
        <div className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full border border-[#067AEF] bg-[#F5FAFF] self-start mt-0.5">
          <HeartIcon className="w-3 h-3 text-[#067AEF] fill-[#067AEF] flex-shrink-0" />
          <span className="text-[13px] text-mfneutralsn-500 leading-none">Abby's mum</span>
        </div>
      </div>

      <button
        onClick={onEdit}
        className="w-8 h-8 rounded-full flex items-center justify-center active:bg-mfneutralsn-50 transition-colors flex-shrink-0"
        aria-label="Edit profile"
      >
        <PencilIcon className="w-4 h-4 text-mfneutralsn-400" />
      </button>
    </div>

    {/* Switch account row */}
    <button
      onClick={onSwitchAccount}
      className="flex items-center justify-between w-full h-12 mt-1 active:bg-mfneutralsn-50 transition-colors"
    >
      <div className="flex items-center gap-2">
        <ArrowLeftRightIcon className="w-[22px] h-[22px] text-mfneutralsn-400" />
        <span className="text-[14px] text-mfneutralsn-500">Switch account</span>
      </div>
      <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-300" />
    </button>
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
  const [showSwitchAccount, setShowSwitchAccount] = useState(false);
  const [showMultisite, setShowMultisite] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);

  if (showChildcareInfo) return <ChildcareInfo onClose={() => setShowChildcareInfo(false)} />;
  if (showPaymentSettings) return <PaymentSettings onClose={() => setShowPaymentSettings(false)} />;
  if (showNotificationSettings) return <NotificationSettings onClose={() => setShowNotificationSettings(false)} />;
  if (showSecuritySettings) return <SecuritySettings onClose={() => setShowSecuritySettings(false)} />;
  if (showLanguageSettings) return <LanguageSettings onClose={() => setShowLanguageSettings(false)} />;
  if (showEditProfile) return <EditProfile onClose={() => setShowEditProfile(false)} />;

  const comingSoon = () => showToast("Coming soon", "info");

  const settingsList: { id: string; label: string; icon: React.ElementType; onClick: () => void }[] = [
    { id: "payments", label: "Payer preferences", icon: CreditCardIcon, onClick: () => setShowPaymentSettings(true) },
    { id: "notifications", label: "Notifications and messaging", icon: BellIcon, onClick: () => setShowNotificationSettings(true) },
    { id: "password", label: "Password and sign in", icon: LockIcon, onClick: () => setShowSecuritySettings(true) },
    { id: "language", label: "Language", icon: UserCogIcon, onClick: () => setShowLanguageSettings(true) },
  ];

  const supportList: { id: string; label: string; icon: React.ElementType; onClick: () => void }[] = [
    { id: "help", label: "Help and support", icon: HelpCircleIcon, onClick: comingSoon },
    { id: "terms", label: "Terms and policies", icon: ScaleIcon, onClick: comingSoon },
  ];

  const content = (
    <div className={`flex-1 overflow-y-auto ${!shouldShowFrame ? "touch:pb-24" : ""}`}>
      <div className="px-4 pb-8">
        {/* Profile */}
        <ProfileCard onEdit={() => setShowEditProfile(true)} onSwitchAccount={() => setShowSwitchAccount(true)} />

        {/* Payments */}
        <div className="mb-5">
          <SectionLabel>Payments</SectionLabel>
          {showMultisite ? (
            <div className="flex flex-col gap-3">
              {[
                { id: "sunflower", siteName: "Little Explorers", childName: "Abby Freedman", isPaid: isPaid },
                { id: "oaktree", siteName: "Christmas Adventurers", childName: "Abby Freedman", isPaid: true },
              ].map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-[14px] border border-[#F4EDFC] p-4 flex flex-col gap-3"
                  style={{ backgroundColor: "#F5FAFF" }}
                >
                  {/* Site • Child header */}
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-mfneutralsn-400">{entry.siteName}</span>
                    <span className="w-1 h-1 rounded-full bg-mfneutralsn-300 flex-shrink-0" />
                    <span className="text-[14px] font-medium text-mfneutralsn-400">{entry.childName}</span>
                  </div>

                  {/* Balance row */}
                  <button onClick={() => navigate("/balance")} className="flex items-center justify-between w-full">
                    <span className={`text-[32px] font-normal leading-tight tracking-tight ${entry.isPaid ? "text-mfneutralsn-500" : "text-red-600"}`}>
                      {entry.isPaid ? "$0" : `–$${OUTSTANDING_AMOUNT}`}
                    </span>
                    <ChevronRightIcon className="w-5 h-5 text-mfneutralsn-300 flex-shrink-0" />
                  </button>

                  {/* Status */}
                  <div className="flex flex-col gap-2">
                    <p className="text-[14px] text-mfneutralsn-400">
                      {entry.isPaid ? (
                        <><span className="font-medium text-mfneutralsn-500">Everything's settled.</span> You don't owe anything.</>
                      ) : "You owe money to the centre."}
                    </p>

                    {/* Invoice subcard */}
                    <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EBF5FE" }}>
                        <FileTextIcon className="w-4 h-4 text-[#067AEF]" />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[12px] text-mfneutralsn-300 leading-tight">Latest invoice&nbsp;•&nbsp;Charged on Nov 24</span>
                        <span className="text-[14px] text-mfneutralsn-500 leading-tight">Invoice for $1024.00</span>
                      </div>
                    </div>
                  </div>

                  {!entry.isPaid && (
                    <button
                      onClick={() => setShowInvoice(true)}
                      className="w-full h-10 rounded-xl bg-mfprimaryp-400 text-white text-[14px] font-semibold active:opacity-80 transition-opacity"
                    >
                      Pay now
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <PaymentsCard
              isPaid={isPaid}
              onNavigate={() => navigate("/balance")}
              onPayNow={() => setShowInvoice(true)}
            />
          )}
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
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-semibold text-mfneutralsn-500 tracking-tight">Your profile</h1>
              <button
                onClick={() => setShowMultisite((v) => !v)}
                className={`inline-flex items-center h-5 px-2 rounded-full text-[11px] font-medium border transition-colors ${
                  showMultisite
                    ? "bg-mfprimaryp-400 border-mfprimaryp-400 text-white"
                    : "bg-mfneutralsn-50 border-mfneutralsn-200 text-mfneutralsn-400"
                }`}
              >
                Multisites
              </button>
            </div>
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

        <AnimatePresence>
          {showSwitchAccount && <SwitchAccountSheet onClose={() => setShowSwitchAccount(false)} />}
        </AnimatePresence>
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

      <AnimatePresence>
        {showSwitchAccount && <SwitchAccountSheet onClose={() => setShowSwitchAccount(false)} />}
      </AnimatePresence>
    </div>
  );
};
