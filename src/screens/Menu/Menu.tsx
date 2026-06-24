import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  XIcon,
  CameraIcon,
  LogOutIcon,
  LockIcon,
  CreditCardIcon,
  BellIcon,
  SearchIcon,
  UserCogIcon,
  HeartIcon,
  ArrowLeftRightIcon,
  ExternalLinkIcon,
  HelpCircleIcon,
  ScaleIcon,
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

// ─── View profile page ────────────────────────────────────────────────────────

const ViewProfileRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-mfneutralsn-75 last:border-0 gap-4">
    <span className="text-[14px] text-mfneutralsn-400 flex-shrink-0">{label}</span>
    <span className="text-[14px] text-mfneutralsn-500 text-right">{value}</span>
  </div>
);

export const ViewProfile: React.FC<{ onClose: () => void; onEdit: () => void }> = ({ onClose, onEdit }) => {
  const { shouldShowFrame } = useDeviceDetection();
  return (
    <div className={`flex flex-col bg-white ${shouldShowFrame ? "h-full" : "min-h-screen"}`}>
      {shouldShowFrame && (
        <div className="flex items-center justify-between px-5 pt-2 pb-1">
          <span className="font-semibold text-mfneutralsn-500 text-[15px]">9:41</span>
          <img className="h-4" alt="Status icons" src={`${BASE_PATH}right-side.svg`} />
        </div>
      )}
      {/* Header */}
      <div className="relative flex items-center justify-center px-4 pt-4 pb-3 border-b border-[#f1f1f4]">
        <button onClick={onClose} className="absolute left-4 w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center active:bg-mfneutralsn-50 transition-colors">
          <ChevronLeftIcon className="w-4 h-4 text-mfneutralsn-400" />
        </button>
        <p className="text-[17px] font-semibold text-mfneutralsn-500">About</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Centered avatar */}
        <div className="flex flex-col items-center pt-6 pb-4">
          <button className="relative">
            <div className="w-20 h-20 rounded-full bg-[#EBF5FE] flex items-center justify-center">
              <span className="text-[20px] font-semibold text-[#067AEF]">MF</span>
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-mfneutralsn-500 border-2 border-white flex items-center justify-center">
              <CameraIcon className="w-3 h-3 text-white" />
            </div>
          </button>
        </div>

        <div className="px-4">
          <p className="text-[12px] font-semibold text-mfneutralsn-300 uppercase tracking-wide pb-1 pt-2">Basic info</p>
          <ViewProfileRow label="Full name" value="Martha Freedman" />
          <ViewProfileRow label="Preferred name" value="Martha" />
          <ViewProfileRow label="Date of birth" value="12 Mar 1985" />
          <ViewProfileRow label="Languages" value="English" />
          <ViewProfileRow label="Birthplace" value="London" />
        </div>

        <div className="px-4 mt-4">
          <p className="text-[12px] font-semibold text-mfneutralsn-300 uppercase tracking-wide pb-1 pt-2">Contact</p>
          <ViewProfileRow label="Email" value="martha.freedman@email.com" />
          <ViewProfileRow label="Phone number" value="+44 2324932948239" />
        </div>

        <div className="px-4 mt-4">
          <p className="text-[12px] font-semibold text-mfneutralsn-300 uppercase tracking-wide pb-1 pt-2">Role</p>
          <ViewProfileRow label="Relationship" value="Abby's mum" />
        </div>
      </div>

      {/* Edit CTA */}
      <div className="px-4 pb-8 pt-3 bg-white border-t border-mfneutralsn-75 flex-shrink-0">
        <button
          onClick={onEdit}
          className="w-full h-12 rounded-2xl bg-mfprimaryp-400 text-white text-[15px] font-semibold active:opacity-80 transition-opacity"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

// ─── Edit profile page ────────────────────────────────────────────────────────

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
      {shouldShowFrame && (
        <div className="flex items-center justify-between px-5 pt-2 pb-1">
          <span className="font-semibold text-mfneutralsn-500 text-[15px]">9:41</span>
          <img className="h-4" alt="Status icons" src={`${BASE_PATH}right-side.svg`} />
        </div>
      )}
      {/* Header */}
      <div className="relative flex items-center justify-center px-4 pt-4 pb-3 border-b border-[#f1f1f4]">
        <button onClick={onClose} className="absolute left-4 w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center active:bg-mfneutralsn-50 transition-colors">
          <ChevronLeftIcon className="w-4 h-4 text-mfneutralsn-400" />
        </button>
        <p className="text-[17px] font-semibold text-mfneutralsn-500">About</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Centered avatar */}
        <div className="flex flex-col items-center pt-6 pb-4">
          <button className="relative">
            <div className="w-20 h-20 rounded-full bg-[#EBF5FE] flex items-center justify-center">
              <span className="text-[20px] font-semibold text-[#067AEF]">MF</span>
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-mfneutralsn-500 border-2 border-white flex items-center justify-center">
              <CameraIcon className="w-3 h-3 text-white" />
            </div>
          </button>
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
      <div className="flex gap-3 px-4 pb-8 pt-3 bg-white border-t border-mfneutralsn-75 flex-shrink-0">
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

const ProfileCard: React.FC<{ onEdit: () => void }> = ({ onEdit }) => (
  <div className="pt-4 pb-2">
    <button onClick={onEdit} className="flex items-center gap-4 w-full text-left active:bg-mfneutralsn-50 transition-colors rounded-xl">
      <Avatar className="w-[72px] h-[72px] flex-shrink-0 border-2 border-white shadow-sm">
        <AvatarImage src={`${BASE_PATH}avatar-2.png`} alt="Matt Freedman" className="object-cover" />
        <AvatarFallback>MF</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <p className="text-[16px] font-semibold text-mfneutralsn-500 leading-snug">Matt Freedman</p>
        <span className="text-[12px] text-mfneutralsn-300 leading-snug">matt.freedman@email.com</span>
        {/* Role pill */}
        <div className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full border border-[#067AEF] bg-[#F5FAFF] self-start mt-0.5">
          <HeartIcon className="w-3 h-3 text-[#067AEF] fill-[#067AEF] flex-shrink-0" />
          <span className="text-[13px] text-mfneutralsn-500 leading-none">Parent</span>
        </div>
      </div>

      <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-300 flex-shrink-0" />
    </button>
  </div>
);

// ─── Payments card ────────────────────────────────────────────────────────────

const PaymentsCard: React.FC<{
  isPaid: boolean;
  onNavigate: () => void;
  onPayNow: () => void;
}> = ({ isPaid, onNavigate, onPayNow }) => (
  <button onClick={onNavigate} className="w-full text-left rounded-2xl p-3 border border-mfneutralsn-100 bg-white active:bg-mfneutralsn-50 transition-colors">
    {/* Balance header row */}
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-1.5">
        <span className="text-[14px] text-mfneutralsn-300">Balance</span>
        <span className="w-1 h-1 rounded-full bg-mfneutralsn-300 flex-shrink-0" />
        <span className="text-[14px] text-mfneutralsn-300">Anny</span>
      </div>
      <ChevronRightIcon className="w-5 h-5 text-mfneutralsn-300 flex-shrink-0" />
    </div>

    {/* Balance amount */}
    <p className={`text-[32px] font-normal leading-tight tracking-tight mb-3 ${isPaid ? "text-mfneutralsn-500" : "text-red-600"}`}>
      {isPaid ? "$0" : `–$${OUTSTANDING_AMOUNT}`}
    </p>

    {isPaid ? (
      <div className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-mfneutralsn-200 bg-mfneutralsn-50">
        <span className="text-[13px] text-mfneutralsn-400">Paying automatically</span>
        <span className="w-1 h-1 rounded-full bg-mfneutralsn-300 flex-shrink-0" />
        <span className="text-[13px] text-mfneutralsn-400">Visa 4242</span>
      </div>
    ) : (
      <Button
        onClick={(e) => { e.stopPropagation(); onPayNow(); }}
        className="w-full h-9 bg-mfprimaryp-400 hover:bg-mfprimaryp-400/90 text-white rounded-xl font-medium"
      >
        Pay now
      </Button>
    )}
  </button>
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
  const [invoiceIsPaid, setInvoiceIsPaid] = useState(false);
  const [showChildcareInfo, setShowChildcareInfo] = useState(false);
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);
  const [showSwitchAccount, setShowSwitchAccount] = useState(false);
  const [showMultisite, setShowMultisite] = useState(false);
  const [showViewProfile, setShowViewProfile] = useState(false);
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
  if (showViewProfile) return <ViewProfile onClose={() => setShowViewProfile(false)} onEdit={() => { setShowViewProfile(false); setShowEditProfile(true); }} />;

  const comingSoon = () => showToast("Coming soon", "info");

  const settingsList: { id: string; label: string; icon: React.ElementType; onClick: () => void }[] = [
    { id: "payments", label: "Payment methods", icon: CreditCardIcon, onClick: () => setShowPaymentSettings(true) },
    { id: "notifications", label: "Notifications and messaging", icon: BellIcon, onClick: () => setShowNotificationSettings(true) },
    { id: "password", label: "Password and sign in", icon: LockIcon, onClick: () => setShowSecuritySettings(true) },
    { id: "language", label: "Language", icon: UserCogIcon, onClick: () => setShowLanguageSettings(true) },
  ];

  const content = (
    <div className={`flex-1 overflow-y-auto ${!shouldShowFrame ? "touch:pb-24" : ""}`}>
      <div className="px-4 pb-8">
        {/* Profile */}
        <ProfileCard onEdit={() => setShowViewProfile(true)} />

        {/* Payments */}
        <div className="mb-5">
          <SectionLabel>Payments</SectionLabel>
          {showMultisite ? (
            <>
              {/* Switch account button */}
              <button
                onClick={() => setShowSwitchAccount(true)}
                className="flex items-center justify-center gap-2 w-full h-11 mb-3 rounded-2xl border border-mfneutralsn-200 active:bg-mfneutralsn-50 transition-colors"
              >
                <ArrowLeftRightIcon className="w-4 h-4 text-mfneutralsn-400" />
                <span className="text-[14px] font-medium text-mfneutralsn-500">Switch account</span>
              </button>

              {/* Side-by-side child cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "tobin", childName: "Tobin", isPaid: false },
                  { id: "anny", childName: "Anny", isPaid: isPaid },
                ].map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-2xl border border-mfneutralsn-100 bg-white p-3 flex flex-col gap-3"
                  >
                    {/* Child name + chevron */}
                    <button onClick={() => navigate("/balance")} className="flex items-center justify-between w-full">
                      <span className="text-[14px] text-mfneutralsn-400">{entry.childName}</span>
                      <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-300 flex-shrink-0" />
                    </button>

                    {/* Balance */}
                    <span className={`text-[28px] font-normal leading-tight tracking-tight text-mfneutralsn-500`}>
                      {entry.isPaid ? "$0" : `–$${OUTSTANDING_AMOUNT}`}
                    </span>

                    {entry.isPaid ? (
                      <p className="text-[13px] text-mfneutralsn-400">Everything's settled.</p>
                    ) : (
                      <button
                        onClick={() => { setInvoiceIsPaid(entry.isPaid); setShowInvoice(true); }}
                        className="w-full h-9 rounded-xl bg-mfprimaryp-400 text-white text-[13px] font-semibold active:opacity-80 transition-opacity"
                      >
                        Pay now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <PaymentsCard
              isPaid={isPaid}
              onNavigate={() => navigate("/balance")}
              onPayNow={() => { setInvoiceIsPaid(isPaid); setShowInvoice(true); }}
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

        {/* Help & Legal */}
        <div className="border-t border-mfneutralsn-75 pt-3 mb-1">
          <div className="flex">
            <button
              onClick={comingSoon}
              className="flex-1 flex items-center gap-1 py-2.5 text-[14px] text-mfneutralsn-400 active:text-mfneutralsn-500 transition-colors"
            >
              <HelpCircleIcon className="w-[14px] h-[14px] flex-shrink-0" />
              <span>Help centre</span>
              <ExternalLinkIcon className="w-[14px] h-[14px] flex-shrink-0 ml-0.5" />
            </button>
            <button
              onClick={comingSoon}
              className="flex-1 flex items-center gap-1 py-2.5 text-[14px] text-mfneutralsn-400 active:text-mfneutralsn-500 transition-colors"
            >
              <ScaleIcon className="w-[14px] h-[14px] flex-shrink-0" />
              <span>Legal terms</span>
              <ExternalLinkIcon className="w-[14px] h-[14px] flex-shrink-0 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Log out */}
        <button
          onClick={comingSoon}
          className="flex items-center justify-center gap-2 w-full mt-4 py-3 text-[16px] text-[#C20A0A]"
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
          <Invoice onClose={() => setShowInvoice(false)} isPaid={invoiceIsPaid} onPaymentSuccess={() => setPaid(true)} />
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
