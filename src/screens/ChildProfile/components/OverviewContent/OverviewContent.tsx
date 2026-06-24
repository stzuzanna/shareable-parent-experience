import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRightIcon, ArrowLeftIcon, SunIcon, ThermometerIcon, StethoscopeIcon, CheckCircle2Icon, XCircleIcon, HelpCircleIcon, PlusIcon, LockIcon, LanguagesIcon, HeartIcon, MapPinIcon, AlertTriangleIcon, MailIcon, PhoneIcon, FileTextIcon, IdCardIcon, InfoIcon, XIcon, UsersIcon, UserIcon, CakeIcon, ShieldCheckIcon, CalendarOffIcon } from "lucide-react";
import { useProfileVariant } from "../../../../hooks/useProfileVariant";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import { useChildProfileDesign } from "../../../../hooks/useChildProfileDesign";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { AddLeaveSheet } from "../../../../components/AddLeaveSheet/AddLeaveSheet";
import { EditFieldSheet, type EditFieldConfig } from "../../../../components/EditFieldSheet/EditFieldSheet";
import { BASE_PATH } from "../../../../constants";

// ── Editable field config ─────────────────────────────────────────────────────

interface FieldKey { section: "basic" | "health" | "family"; field: string }
type EditingField = (EditFieldConfig & { key: FieldKey }) | null;

interface BasicInfoState {
  dateOfBirth: string;
  languages: string[]; // comma-separated when edited
  gender: string;
  allergy: string;
  nationality: string;
  birthplace: string;
  specialNotes: string;
  sensitiveInfo: string;
}

interface HealthState {
  toleratesPenicillin: string;
  diet: string;
  specialNotes: string;
  doctorName: string;
  doctorPhone: string;
  doctorAddress: string;
  dentistName: string;
  dentistPhone: string;
  dentistAddress: string;
}

const LANGUAGE_OPTIONS_ARR = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Mandarin", "Arabic", "Polish", "Turkish"];

const formatHumanDate = (iso: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const MOTHER_AVATAR = "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400";
const FATHER_AVATAR = "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400";

// ── Detail panel overlay ──────────────────────────────────────────────────────

const DetailPanel = ({
  title,
  subtitle,
  onClose,
  footer,
  children,
  bottomClass = "bottom-0",
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
  bottomClass?: string;
}) => (
  <>
    {/* backdrop */}
    <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
    {/* panel — slides up from bottom on mobile */}
    <div className={`fixed inset-x-0 top-16 z-50 bg-white flex flex-col rounded-t-2xl overflow-hidden shadow-xl ${bottomClass}`}>
      {/* header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3 border-b border-[#f1f1f4] flex-shrink-0">
        <div>
          <p className="text-[17px] font-semibold text-mfneutralsn-500 leading-snug">{title}</p>
          {subtitle && <p className="text-[13px] text-mfneutralsn-300 mt-0.5">{subtitle}</p>}
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0 ml-3 mt-0.5"
        >
          <XIcon className="w-4 h-4 text-mfneutralsn-400" />
        </button>
      </div>
      {/* body */}
      <div className="flex-1 overflow-y-auto">{children}</div>
      {/* footer */}
      {footer && (
        <div className="flex-shrink-0 px-4 py-4 border-t border-[#f1f1f4] flex gap-3">
          {footer}
        </div>
      )}
    </div>
  </>
);

// ── Child-pro style primitives ────────────────────────────────────────────────

// Flat section separated by a bottom border, with icon + title + optional description + View all
const Section = ({
  Icon,
  title,
  description,
  onViewAll,
  children,
}: {
  Icon?: React.ElementType;
  title: string;
  description?: string;
  onViewAll?: () => void;
  children: React.ReactNode;
}) => (
  <div className="px-4 py-4 border-b border-[#f1f1f4] flex flex-col gap-3">
    {/* Icon + title on one row; subtitle flush-left below (aligned with icon) */}
    <div>
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon className="w-4 h-4 text-mfneutralsn-400 flex-shrink-0" />
        )}
        <p className="text-[14px] font-semibold text-mfneutralsn-500">{title}</p>
      </div>
      {description && (
        <p className="text-[13px] text-mfneutralsn-300 mt-0.5">{description}</p>
      )}
    </div>
    <div className="flex flex-col gap-2">{children}</div>
    {onViewAll && (
      <button
        onClick={onViewAll}
        className="self-start text-[14px] font-medium text-mfprimaryp-400 pt-1"
      >
        View all
      </button>
    )}
  </div>
);

// AboutRow: icon square + value
const AboutRow = ({ Icon, value }: { Icon: React.ElementType; value: string }) => (
  <div className="flex items-center gap-3 py-2">
    <div className="w-6 h-6 rounded-md bg-mfneutralsn-75 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-mfneutralsn-400" />
    </div>
    <span className="text-[14px] text-mfneutralsn-400">{value}</span>
  </div>
);

// Contact summary card: bordered, tappable, with avatar + name + relation + pill
const ContactSummaryCard = ({
  avatarSrc,
  fallback,
  name,
  relation,
  additionalInfo,
  pill,
  onClick,
}: {
  avatarSrc: string;
  fallback: string;
  name: string;
  relation: string;
  additionalInfo?: string;
  pill: "Primary" | "Secondary";
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#f1f1f4] bg-white text-left active:bg-[#f9f6fe] active:border-[#8c4de5] transition-colors"
  >
    <Avatar className="w-10 h-10 flex-shrink-0">
      <AvatarImage src={avatarSrc} alt={name} />
      <AvatarFallback className="text-sm">{fallback}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-semibold text-mfneutralsn-500 leading-tight">{name}</p>
      <p className="text-[13px] text-mfneutralsn-300 mt-0.5 leading-tight truncate">
        {relation}{additionalInfo ? ` · ${additionalInfo}` : ""}
      </p>
    </div>
    <span
      className={`inline-flex items-center px-2 h-6 rounded-full text-[12px] border flex-shrink-0 ${
        pill === "Primary"
          ? "border-mfprimaryp-400 bg-[#f5faff] text-mfneutralsn-500"
          : "border-mfneutralsn-300 bg-[#f9f9fb] text-mfneutralsn-500"
      }`}
    >
      {pill}
    </span>
  </button>
);

// Info row: label on left (fixed width), value on right — border-top separator
const InfoRow = ({
  label,
  value,
  onAdd,
}: {
  label: string;
  value?: string;
  onAdd?: () => void;
}) => (
  <div
    onClick={!value && onAdd ? onAdd : undefined}
    className={`flex items-center gap-3 py-3 border-t border-[#f1f1f4] ${!value && onAdd ? "cursor-pointer" : ""}`}
  >
    <span className="w-[130px] flex-shrink-0 text-[14px] text-mfneutralsn-300">{label}</span>
    {value ? (
      <span className="text-[14px] text-mfneutralsn-400 flex-1 min-w-0">{value}</span>
    ) : (
      <span className="flex items-center gap-1 text-[14px] text-mfneutralsn-300">
        Add <PlusIcon className="w-3.5 h-3.5" />
      </span>
    )}
  </div>
);

const Divider = () => <div className="h-px bg-mfneutralsn-75 mx-4" />;

const SummaryRow = ({
  icon,
  label,
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
}) => (
  <div className="flex h-12 items-center justify-between gap-3 px-4 w-full">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-6 h-6 rounded-md bg-mfneutralsn-75 flex items-center justify-center flex-shrink-0 text-mfneutralsn-400">
        {icon}
      </div>
      <p className="text-[14px] text-mfneutralsn-400 truncate">{label}</p>
    </div>
    {trailing && <div className="flex-shrink-0">{trailing}</div>}
  </div>
);

// ── Classic design primitives (card-based layout) ─────────────────────────────

const ClassicCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white border-b border-mfneutralsn-75">{children}</div>
);

const ClassicCardHeader = ({ title, onPress }: { title: string; onPress?: () => void }) => (
  <button onClick={onPress} className="w-full flex items-center justify-between px-4 pt-3 pb-2 text-left">
    <span className="text-[14px] text-mfneutralsn-300">{title}</span>
    <ChevronRightIcon className="w-5 h-5 text-mfneutralsn-200" />
  </button>
);

const ClassicSectionCardHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="w-full flex flex-col px-4 pt-4 pb-2">
    <span className="text-[16px] font-semibold text-mfneutralsn-500">{title}</span>
    {subtitle && <span className="text-[13px] text-mfneutralsn-300 mt-0.5">{subtitle}</span>}
  </div>
);

const ClassicViewAllLink = ({ onPress }: { onPress: () => void }) => (
  <button onClick={onPress} className="w-full text-left px-4 py-3 text-[14px] font-medium text-mfprimaryp-400 flex items-center gap-1">
    View all <ChevronRightIcon className="w-4 h-4" />
  </button>
);

const ClassicFamilyPreviewRow = ({
  avatar, fallback, name, role, email, phone,
}: { avatar: string; fallback: string; name: string; role: string; email?: string; phone?: string }) => (
  <div className="px-4 py-2.5 flex items-center justify-between gap-3">
    <div className="flex items-center gap-3 min-w-0">
      <Avatar className="w-9 h-9 flex-shrink-0">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-mfneutralsn-500 truncate">{name}</p>
        <p className="text-[14px] text-mfneutralsn-300 mt-0.5 truncate">{role}</p>
      </div>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0 text-mfneutralsn-400">
      {email && <MailIcon className="w-4 h-4" />}
      {phone && <PhoneIcon className="w-4 h-4" />}
    </div>
  </div>
);

// Per Figma 1545-22397, the subpage header is the minimised child profile:
// back arrow (circular outlined) + small avatar + child name. The section
// title moves into the body, just above the row list.
const SectionHeader = ({
  onBack,
  trailing,
}: {
  title?: string;
  onBack: () => void;
  trailing?: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <button
      onClick={onBack}
      aria-label="Back"
      className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0"
    >
      <ArrowLeftIcon className="w-4 h-4 text-mfneutralsn-500" />
    </button>
    <Avatar className="w-8 h-8 flex-shrink-0">
      <AvatarImage
        src={`${BASE_PATH}pexels-daisy-anderson-5581091-1.png`}
        alt="Abby Freedman"
        className="object-cover"
      />
      <AvatarFallback className="text-[12px]">AF</AvatarFallback>
    </Avatar>
    <span className="text-[16px] font-medium text-mfneutralsn-500 flex-1 truncate">Abby Freedman</span>
    {trailing}
  </div>
);

// ── Booking status icon ───────────────────────────────────────────────────────

const BookingStatusIcon = ({ status }: { status: "pending" | "paid" }) => {
  if (status === "paid") {
    return (
      <div className="w-7 h-7 rounded-full border-2 border-green-500 flex items-center justify-center flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full border-2 border-orange-400 flex items-center justify-center flex-shrink-0">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#fb923c" strokeWidth="2" />
        <path d="M12 6v6l4 2" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// ── Detail views ──────────────────────────────────────────────────────────────

const SubsectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="px-4 pt-5 pb-3 text-[16px] font-medium text-mfneutralsn-400">{children}</p>
);

// Clickable row for subpages: icon + value (or "Add X" placeholder) + chevron.
// Per Figma 1545-22397 there's no label above the value, and the chevron only
// appears when a value is set. Both states open EditFieldSheet on tap.
const EditableRow = ({
  icon,
  label,
  value,
  placeholder,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  placeholder?: string;
  onPress: () => void;
}) => (
  <button
    onClick={onPress}
    className="w-full flex items-center gap-3 px-4 h-12 text-left active:bg-gray-50"
  >
    <div className="w-7 h-7 rounded-md bg-mfneutralsn-75 flex items-center justify-center flex-shrink-0 text-mfneutralsn-400">
      {icon}
    </div>
    {value ? (
      <>
        <p className="text-[14px] text-mfneutralsn-500 leading-tight flex-1 truncate">{value}</p>
        <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-300 flex-shrink-0" />
      </>
    ) : (
      <p className="text-[14px] text-mfneutralsn-300 leading-tight flex-1 truncate">
        {placeholder ?? `Add ${label.toLowerCase()}`}
      </p>
    )}
  </button>
);

const CareDetail = () => (
  <div className="flex flex-col pt-2 pb-24 gap-2 px-2">
    <div className="bg-white border border-mfprimaryp-100 rounded-xl p-4">
      <p className="text-[14px] text-mfneutralsn-300 mb-1">Care plan</p>
      <p className="text-sm font-semibold text-mfneutralsn-500">Monthly full time</p>
      <p className="text-[14px] text-mfneutralsn-300 mt-0.5">$1,350/month · Aug 31 –</p>
    </div>
    <div className="bg-white border border-mfprimaryp-100 rounded-xl p-4">
      <p className="text-[14px] text-mfneutralsn-300 mb-3">Upcoming bookings</p>
      <div className="flex items-center justify-between py-1">
        <p className="text-sm font-semibold text-mfneutralsn-500 flex-1">After School Care</p>
        <div className="flex items-center gap-2">
          <span className="text-[14px] text-mfneutralsn-300">Mar 7</span>
          <span className="text-sm text-mfneutralsn-400">$50.00</span>
          <BookingStatusIcon status="pending" />
        </div>
      </div>
      <div className="h-px bg-gray-100 my-1" />
      <div className="flex items-center justify-between py-1">
        <p className="text-sm font-semibold text-mfneutralsn-500 flex-1">After School Care</p>
        <div className="flex items-center gap-2">
          <span className="text-[14px] text-mfneutralsn-300">Feb 1</span>
          <span className="text-sm text-mfneutralsn-400">$50.00</span>
          <BookingStatusIcon status="paid" />
        </div>
      </div>
    </div>
  </div>
);

const PrimaryBadge = () => (
  <span className="text-[14px] px-2 py-0.5 rounded-full border border-mfprimaryp-400 text-mfprimaryp-400">Primary</span>
);

const SecondaryBadge = () => (
  <span className="text-[14px] px-2 py-0.5 rounded-full border border-mfneutralsn-200 text-mfneutralsn-400">Secondary</span>
);

// ── About panel (canvas child-pro style) ──────────────────────────────────────

interface AboutState {
  fullName: string;
  preferredName: string;
  dateOfBirth: string;
  languages: string;
  nationality: string;
  birthplace: string;
  homeLanguage: string;
  livesWith: string;
  parentalResponsibility: string;
  ethnicity: string;
  religion: string;
  specialNote: string;
}

// Small section label — matches canvas body-small n300 emphasized (14px medium gray)
const PanelSectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[14px] font-medium text-mfneutralsn-300">{children}</p>
);

// Canvas-style info row: 130px label + value or "Add" affordance.
// No horizontal padding — container provides it (px-4).
// Rows stack in a plain flex-col; first row has no border, rest have border-top.
const AboutInfoRow = ({
  label,
  value,
  onAdd,
  onEdit,
  first,
}: {
  label: string;
  value?: string;
  onAdd?: () => void;
  onEdit?: () => void;
  first?: boolean;
}) => (
  <div
    onClick={value ? onEdit : onAdd}
    className={`flex items-center gap-2 py-3 ${!first ? "border-t border-[#f1f1f4]" : ""} ${(!value && onAdd) || (value && onEdit) ? "cursor-pointer" : ""}`}
  >
    <span className="w-[130px] flex-shrink-0 text-[14px] text-mfneutralsn-300">{label}</span>
    {value ? (
      <span className="text-[14px] text-mfneutralsn-400 flex-1 min-w-0">{value}</span>
    ) : (
      <span className="flex items-center gap-1 text-[14px] text-mfneutralsn-300 opacity-80">
        Add <PlusIcon className="w-[18px] h-[18px]" />
      </span>
    )}
  </div>
);

// View mode body — mirrors canvas DetailPanel body: px-4 pt-6 pb-6, gap-6 between sections
const AboutViewContent = ({
  state,
  onEdit,
}: {
  state: AboutState;
  onEdit: (field: keyof AboutState) => void;
}) => (
  <div className="flex flex-col gap-6 px-4 pt-6 pb-6">
    {/* Basic info section */}
    <div className="flex flex-col">
      <PanelSectionLabel>Basic info</PanelSectionLabel>
      <div className="flex flex-col">
        <AboutInfoRow first label="Full name"      value={state.fullName}      onEdit={() => onEdit("fullName")} />
        <AboutInfoRow label="Preferred name" value={state.preferredName || undefined} onAdd={() => onEdit("preferredName")} onEdit={() => onEdit("preferredName")} />
        <AboutInfoRow
          label="Date of birth"
          value={state.dateOfBirth ? `${formatHumanDate(state.dateOfBirth)} (1 year 4 months)` : undefined}
          onEdit={() => onEdit("dateOfBirth")}
          onAdd={() => onEdit("dateOfBirth")}
        />
        <AboutInfoRow label="Languages"   value={state.languages || undefined}   onAdd={() => onEdit("languages")}   onEdit={() => onEdit("languages")} />
        <AboutInfoRow label="Nationality" value={state.nationality || undefined} onAdd={() => onEdit("nationality")} onEdit={() => onEdit("nationality")} />
        <AboutInfoRow label="Birthplace"  value={state.birthplace || undefined}  onAdd={() => onEdit("birthplace")}  onEdit={() => onEdit("birthplace")} />
      </div>
    </div>

    {/* Household section */}
    <div className="flex flex-col">
      <PanelSectionLabel>Household</PanelSectionLabel>
      <div className="flex flex-col">
        <AboutInfoRow first label="Home language"           value={state.homeLanguage || undefined}           onAdd={() => onEdit("homeLanguage")}           onEdit={() => onEdit("homeLanguage")} />
        <AboutInfoRow label="Lives with"              value={state.livesWith || undefined}              onAdd={() => onEdit("livesWith")}              onEdit={() => onEdit("livesWith")} />
        <AboutInfoRow label="Parental responsibility" value={state.parentalResponsibility || undefined} onAdd={() => onEdit("parentalResponsibility")} onEdit={() => onEdit("parentalResponsibility")} />
      </div>
    </div>

    {/* Sensitive info section */}
    <div className="flex flex-col">
      <PanelSectionLabel>Sensitive info</PanelSectionLabel>
      <div className="flex flex-col">
        <AboutInfoRow first label="Ethnicity"    value={state.ethnicity || undefined}   onAdd={() => onEdit("ethnicity")}    onEdit={() => onEdit("ethnicity")} />
        <AboutInfoRow label="Religion"     value={state.religion || undefined}     onAdd={() => onEdit("religion")}     onEdit={() => onEdit("religion")} />
        <AboutInfoRow label="Special note" value={state.specialNote || undefined}  onAdd={() => onEdit("specialNote")}  onEdit={() => onEdit("specialNote")} />
      </div>
    </div>
  </div>
);

// Edit mode field — label above full-width input, auto-scrolls+focuses when it's the target
const AboutEditField = ({
  fieldKey,
  focusField,
  label,
  value,
  onChange,
  multiline,
}: {
  fieldKey: keyof AboutState;
  focusField: keyof AboutState | null;
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  useEffect(() => {
    if (focusField !== fieldKey) return;
    const timer = setTimeout(() => {
      wrapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [focusField, fieldKey]);

  return (
    <div ref={wrapRef} className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-mfneutralsn-400">{label}</label>
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full text-[14px] text-mfneutralsn-500 border border-[#c6c6d2] rounded-lg px-3 py-2.5 resize-none outline-none focus:border-mfprimaryp-400 transition-colors bg-white"
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-[14px] text-mfneutralsn-500 border border-[#c6c6d2] rounded-lg px-3 py-2.5 outline-none focus:border-mfprimaryp-400 transition-colors bg-white"
        />
      )}
    </div>
  );
};

// Edit mode body — mirrors canvas EditDetailPanel body: px-4 pt-6 pb-6, sections gap-6, fields gap-4
const AboutEditContent = ({
  state,
  focusField,
  onChange,
}: {
  state: AboutState;
  focusField: keyof AboutState | null;
  onChange: (field: keyof AboutState, value: string) => void;
}) => (
  <div className="flex flex-col gap-6 px-4 pt-6 pb-6">
    <div className="flex flex-col gap-4">
      <PanelSectionLabel>Basic info</PanelSectionLabel>
      <AboutEditField fieldKey="fullName"      focusField={focusField} label="Full name"      value={state.fullName}      onChange={(v) => onChange("fullName", v)} />
      <AboutEditField fieldKey="preferredName" focusField={focusField} label="Preferred name" value={state.preferredName} onChange={(v) => onChange("preferredName", v)} />
      <AboutEditField fieldKey="dateOfBirth"   focusField={focusField} label="Date of birth"  value={state.dateOfBirth}   onChange={(v) => onChange("dateOfBirth", v)} />
      <AboutEditField fieldKey="languages"     focusField={focusField} label="Languages"      value={state.languages}     onChange={(v) => onChange("languages", v)} />
      <AboutEditField fieldKey="nationality"   focusField={focusField} label="Nationality"    value={state.nationality}   onChange={(v) => onChange("nationality", v)} />
      <AboutEditField fieldKey="birthplace"    focusField={focusField} label="Birthplace"     value={state.birthplace}    onChange={(v) => onChange("birthplace", v)} />
    </div>

    <div className="flex flex-col gap-4">
      <PanelSectionLabel>Household</PanelSectionLabel>
      <AboutEditField fieldKey="homeLanguage"           focusField={focusField} label="Home language"           value={state.homeLanguage}           onChange={(v) => onChange("homeLanguage", v)} />
      <AboutEditField fieldKey="livesWith"              focusField={focusField} label="Lives with"              value={state.livesWith}              onChange={(v) => onChange("livesWith", v)} />
      <AboutEditField fieldKey="parentalResponsibility" focusField={focusField} label="Parental responsibility" value={state.parentalResponsibility} onChange={(v) => onChange("parentalResponsibility", v)} />
    </div>

    <div className="flex flex-col gap-4">
      <PanelSectionLabel>Sensitive info</PanelSectionLabel>
      <AboutEditField fieldKey="ethnicity"   focusField={focusField} label="Ethnicity"    value={state.ethnicity}   onChange={(v) => onChange("ethnicity", v)} />
      <AboutEditField fieldKey="religion"    focusField={focusField} label="Religion"     value={state.religion}    onChange={(v) => onChange("religion", v)} />
      <AboutEditField fieldKey="specialNote" focusField={focusField} label="Special note" value={state.specialNote} onChange={(v) => onChange("specialNote", v)} multiline />
    </div>
  </div>
);

// ── Health panel (same view/edit pattern as About) ────────────────────────────

// Tappable icon row used inside full-screen section pages
const SectionRow = ({
  Icon,
  value,
  placeholder,
  onTap,
}: {
  Icon: React.ElementType;
  value?: string;
  placeholder: string;
  onTap?: () => void;
}) => (
  <div
    onClick={onTap}
    className={`flex items-center gap-3 py-2 ${onTap ? "cursor-pointer" : ""}`}
  >
    <div className="w-6 h-6 rounded-md bg-mfneutralsn-75 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-mfneutralsn-400" />
    </div>
    <span className={`text-[14px] ${value ? "text-mfneutralsn-400" : "text-mfneutralsn-300"}`}>
      {value || placeholder}
    </span>
  </div>
);

const HealthViewContent = ({
  state,
  onEdit,
}: {
  state: HealthState;
  onEdit: (field: keyof HealthState) => void;
}) => (
  <div className="flex flex-col gap-6 px-4 pt-6 pb-6">
    {/* General */}
    <div className="flex flex-col">
      <PanelSectionLabel>General</PanelSectionLabel>
      <div className="flex flex-col">
        <AboutInfoRow first label="Penicillin"   value={state.toleratesPenicillin || undefined} onAdd={() => onEdit("toleratesPenicillin")} onEdit={() => onEdit("toleratesPenicillin")} />
        <AboutInfoRow label="Diet"          value={state.diet || undefined}                onAdd={() => onEdit("diet")}                onEdit={() => onEdit("diet")} />
        <AboutInfoRow label="Special notes" value={state.specialNotes || undefined}       onAdd={() => onEdit("specialNotes")}       onEdit={() => onEdit("specialNotes")} />
      </div>
    </div>

    {/* Doctor */}
    <div className="flex flex-col">
      <PanelSectionLabel>Doctor</PanelSectionLabel>
      <div className="flex flex-col">
        <AboutInfoRow first label="Name"    value={state.doctorName || undefined}                                              onAdd={() => onEdit("doctorName")}    onEdit={() => onEdit("doctorName")} />
        <AboutInfoRow label="Phone"   value={state.doctorPhone || undefined}                                             onAdd={() => onEdit("doctorPhone")}   onEdit={() => onEdit("doctorPhone")} />
        <AboutInfoRow label="Address" value={state.doctorAddress ? state.doctorAddress.replace(/\n/g, ", ") : undefined} onAdd={() => onEdit("doctorAddress")} onEdit={() => onEdit("doctorAddress")} />
      </div>
    </div>

    {/* Dentist */}
    <div className="flex flex-col">
      <PanelSectionLabel>Dentist</PanelSectionLabel>
      <div className="flex flex-col">
        <AboutInfoRow first label="Name"    value={state.dentistName || undefined}    onAdd={() => onEdit("dentistName")}    onEdit={() => onEdit("dentistName")} />
        <AboutInfoRow label="Phone"   value={state.dentistPhone || undefined}   onAdd={() => onEdit("dentistPhone")}   onEdit={() => onEdit("dentistPhone")} />
        <AboutInfoRow label="Address" value={state.dentistAddress || undefined} onAdd={() => onEdit("dentistAddress")} onEdit={() => onEdit("dentistAddress")} />
      </div>
    </div>
  </div>
);

const HealthEditContent = ({
  state,
  focusField,
  onChange,
}: {
  state: HealthState;
  focusField: keyof HealthState | null;
  onChange: (field: keyof HealthState, value: string) => void;
}) => (
  <div className="flex flex-col gap-6 px-4 pt-6 pb-6">
    <div className="flex flex-col gap-4">
      <PanelSectionLabel>General</PanelSectionLabel>
      <HealthEditField fieldKey="toleratesPenicillin" focusField={focusField} label="Tolerates penicillin"   value={state.toleratesPenicillin} onChange={(v) => onChange("toleratesPenicillin", v)} />
      <HealthEditField fieldKey="diet"                focusField={focusField} label="Dietary considerations" value={state.diet}                onChange={(v) => onChange("diet", v)} multiline />
      <HealthEditField fieldKey="specialNotes"        focusField={focusField} label="Special notes"          value={state.specialNotes}        onChange={(v) => onChange("specialNotes", v)} multiline />
    </div>

    <div className="flex flex-col gap-4">
      <PanelSectionLabel>Doctor</PanelSectionLabel>
      <HealthEditField fieldKey="doctorName"    focusField={focusField} label="Name"    value={state.doctorName}    onChange={(v) => onChange("doctorName", v)} />
      <HealthEditField fieldKey="doctorPhone"   focusField={focusField} label="Phone"   value={state.doctorPhone}   onChange={(v) => onChange("doctorPhone", v)} />
      <HealthEditField fieldKey="doctorAddress" focusField={focusField} label="Address" value={state.doctorAddress} onChange={(v) => onChange("doctorAddress", v)} multiline />
    </div>

    <div className="flex flex-col gap-4">
      <PanelSectionLabel>Dentist</PanelSectionLabel>
      <HealthEditField fieldKey="dentistName"    focusField={focusField} label="Name"    value={state.dentistName}    onChange={(v) => onChange("dentistName", v)} />
      <HealthEditField fieldKey="dentistPhone"   focusField={focusField} label="Phone"   value={state.dentistPhone}   onChange={(v) => onChange("dentistPhone", v)} />
      <HealthEditField fieldKey="dentistAddress" focusField={focusField} label="Address" value={state.dentistAddress} onChange={(v) => onChange("dentistAddress", v)} multiline />
    </div>
  </div>
);

// Identical shape to AboutEditField but typed for HealthState
const HealthEditField = ({
  fieldKey,
  focusField,
  label,
  value,
  onChange,
  multiline,
}: {
  fieldKey: keyof HealthState;
  focusField: keyof HealthState | null;
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  useEffect(() => {
    if (focusField !== fieldKey) return;
    const timer = setTimeout(() => {
      wrapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [focusField, fieldKey]);

  return (
    <div ref={wrapRef} className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-mfneutralsn-400">{label}</label>
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full text-[14px] text-mfneutralsn-500 border border-[#c6c6d2] rounded-lg px-3 py-2.5 resize-none outline-none focus:border-mfprimaryp-400 transition-colors bg-white"
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-[14px] text-mfneutralsn-500 border border-[#c6c6d2] rounded-lg px-3 py-2.5 outline-none focus:border-mfprimaryp-400 transition-colors bg-white"
        />
      )}
    </div>
  );
};

// ── Detail view: Basic info (classic layout) ──────────────────────────────────

type OptionalKey = "nationality" | "birthplace";
const OPTIONAL_LABELS: Record<OptionalKey, string> = {
  nationality: "Nationality",
  birthplace: "Birthplace",
};

const BasicInfoDetail = ({
  state,
  openEdit,
}: {
  state: BasicInfoState;
  openEdit: (config: EditFieldConfig & { key: FieldKey }) => void;
}) => (
  <div className="flex flex-col pb-24 pt-2">
    <p className="px-4 pb-2 text-[14px] font-medium text-mfneutralsn-500">Basic info</p>
    <EditableRow
      icon={<IdCardIcon className="w-4 h-4" />}
      label="Name"
      value="Abby Freedman"
      onPress={() =>
        openEdit({
          title: "Child name",
          subtitle: "Your child's full name.",
          type: "text",
          value: "Abby Freedman",
          key: { section: "basic", field: "name" },
        })
      }
    />
    <EditableRow
      icon={<LockIcon className="w-4 h-4" />}
      label="Date of birth"
      value={state.dateOfBirth ? `${formatHumanDate(state.dateOfBirth)} (1 year 4 months)` : ""}
      onPress={() =>
        openEdit({
          title: "Date of birth",
          subtitle: "Used to determine the room your child belongs to.",
          type: "date",
          value: state.dateOfBirth,
          key: { section: "basic", field: "dateOfBirth" },
        })
      }
    />
    <EditableRow
      icon={<LanguagesIcon className="w-4 h-4" />}
      label="Languages"
      value={state.languages.join(", ")}
      onPress={() =>
        openEdit({
          title: "Languages",
          subtitle: "Comma separated list of languages spoken at home.",
          type: "text",
          value: state.languages.join(", "),
          placeholder: "English, Spanish",
          key: { section: "basic", field: "languages" },
        })
      }
    />
    <EditableRow
      icon={<MapPinIcon className="w-4 h-4" />}
      label="Gender"
      value={state.gender}
      onPress={() =>
        openEdit({
          title: "Gender",
          subtitle: "How your child identifies.",
          type: "select",
          value: state.gender,
          options: ["Boy", "Girl", "Other", "Prefer not to say"],
          key: { section: "basic", field: "gender" },
        })
      }
    />
    <EditableRow
      icon={<AlertTriangleIcon className="w-4 h-4" />}
      label="Allergy"
      value={state.allergy}
      placeholder="Add allergy information"
      onPress={() =>
        openEdit({
          title: "Allergy info",
          subtitle: "List any allergies the centre should know about.",
          type: "text",
          value: state.allergy,
          placeholder: "Comma separated",
          key: { section: "basic", field: "allergy" },
        })
      }
    />
    <EditableRow
      icon={<InfoIcon className="w-4 h-4" />}
      label="Dietary preference"
      value=""
      placeholder="Add dietary preference"
      onPress={() =>
        openEdit({
          title: "Dietary preference",
          subtitle: "Any food restrictions or preferences the centre should follow.",
          type: "textarea",
          value: "",
          key: { section: "basic", field: "specialNotes" },
        })
      }
    />
    <EditableRow
      icon={<HeartIcon className="w-4 h-4" />}
      label="Medical condition"
      value=""
      placeholder="Add medical condition"
      onPress={() =>
        openEdit({
          title: "Medical condition",
          subtitle: "Any medical conditions the centre should know about.",
          type: "textarea",
          value: "",
          key: { section: "basic", field: "sensitiveInfo" },
        })
      }
    />
    {(["nationality", "birthplace"] as OptionalKey[]).map((k) => (
      <EditableRow
        key={k}
        icon={<InfoIcon className="w-4 h-4" />}
        label={OPTIONAL_LABELS[k]}
        value={state[k]}
        onPress={() =>
          openEdit({
            title: OPTIONAL_LABELS[k],
            subtitle: `Optional. Update the ${OPTIONAL_LABELS[k].toLowerCase()} for your child.`,
            type: "text",
            value: state[k],
            key: { section: "basic", field: k },
          })
        }
      />
    ))}
  </div>
);

// ── Detail view: Health details ───────────────────────────────────────────────

const HealthDetailsDetail = ({
  state,
  openEdit,
}: {
  state: HealthState;
  openEdit: (config: EditFieldConfig & { key: FieldKey }) => void;
}) => {
  const open = (
    title: string,
    field: keyof HealthState,
    extras: Partial<EditFieldConfig> = {},
  ) =>
    openEdit({
      title,
      subtitle: `Update the ${title.toLowerCase()} for your child.`,
      type: "text",
      value: state[field],
      key: { section: "health", field },
      ...extras,
    });

  return (
    <div className="flex flex-col pb-24 pt-2">
      <p className="px-4 pb-2 text-[14px] font-medium text-mfneutralsn-500">Health details</p>
      <EditableRow
        icon={<HelpCircleIcon className="w-4 h-4" />}
        label="Tolerates penicillin"
        value={state.toleratesPenicillin}
        onPress={() =>
          open("Tolerates penicillin", "toleratesPenicillin", {
            type: "select",
            options: ["Yes", "No", "Unknown"],
            subtitle: "Whether your child can take penicillin-based medication.",
          })
        }
      />
      <EditableRow
        icon={<InfoIcon className="w-4 h-4" />}
        label="Special dietary considerations"
        value={state.diet}
        placeholder="Add dietary considerations"
        onPress={() =>
          open("Special dietary considerations", "diet", {
            type: "textarea",
            subtitle: "Any food restrictions or preferences the centre should follow.",
          })
        }
      />
      <EditableRow
        icon={<InfoIcon className="w-4 h-4" />}
        label="Special notes"
        value={state.specialNotes}
        placeholder="Add special notes"
        onPress={() =>
          open("Special notes", "specialNotes", {
            type: "textarea",
            subtitle: "Anything else the centre should know about your child's health.",
          })
        }
      />

      <SubsectionTitle>Doctor</SubsectionTitle>
      <EditableRow
        icon={<StethoscopeIcon className="w-4 h-4" />}
        label="Name"
        value={state.doctorName}
        placeholder="Add doctor name"
        onPress={() => open("Doctor name", "doctorName", { subtitle: "Your child's primary doctor." })}
      />
      <EditableRow
        icon={<PhoneIcon className="w-4 h-4" />}
        label="Phone"
        value={state.doctorPhone}
        placeholder="Add doctor phone"
        onPress={() => open("Doctor phone", "doctorPhone", { subtitle: "Phone number for your doctor." })}
      />
      <EditableRow
        icon={<MapPinIcon className="w-4 h-4" />}
        label="Address"
        value={state.doctorAddress ? state.doctorAddress.replace(/\n/g, ", ") : ""}
        placeholder="Add doctor address"
        onPress={() =>
          open("Doctor address", "doctorAddress", {
            type: "textarea",
            subtitle: "Street address of your doctor's surgery.",
          })
        }
      />

      <SubsectionTitle>Dentist</SubsectionTitle>
      <EditableRow
        icon={<StethoscopeIcon className="w-4 h-4" />}
        label="Name"
        value={state.dentistName}
        placeholder="Add dentist name"
        onPress={() => open("Dentist name", "dentistName", { subtitle: "Your child's dentist." })}
      />
      <EditableRow
        icon={<PhoneIcon className="w-4 h-4" />}
        label="Phone"
        value={state.dentistPhone}
        placeholder="Add dentist phone"
        onPress={() => open("Dentist phone", "dentistPhone", { subtitle: "Phone number for your dentist." })}
      />
      <EditableRow
        icon={<MapPinIcon className="w-4 h-4" />}
        label="Address"
        value={state.dentistAddress}
        placeholder="Add dentist address"
        onPress={() =>
          open("Dentist address", "dentistAddress", {
            type: "textarea",
            subtitle: "Street address of your dentist's office.",
          })
        }
      />
    </div>
  );
};

// ── Detail view: Family ───────────────────────────────────────────────────────

type ContactDef = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  fallback: string;
  primary: boolean;
};

const CONTACTS: ContactDef[] = [
  { id: "sarah",   name: "Sarah Freedman",   role: "Mother",      avatar: MOTHER_AVATAR, fallback: "SF", primary: true },
  { id: "michael", name: "Michael Freedman", role: "Father",      avatar: FATHER_AVATAR, fallback: "MF", primary: false },
  { id: "grandma", name: "Grandma Freedman", role: "Grandmother", avatar: "",            fallback: "GF", primary: false },
  { id: "grandpa", name: "Grandpa Freedman", role: "Grandfather", avatar: "",            fallback: "GF", primary: false },
];

const SIBLING = { name: "Tom Freedman", role: "Sibling", room: "Caterpillars", fallback: "TF" };

type ContactExtras = { email?: string; phone?: string };

// Inline contact detail chip: icon + value (or placeholder) — used side by side in one row
const ContactInfoChip = ({
  icon, value, placeholder, onAdd,
}: { icon: React.ReactNode; value?: string; placeholder: string; onAdd?: () => void }) => (
  <div
    className={`flex items-center gap-1 ${!value && onAdd ? "cursor-pointer" : ""}`}
    onClick={!value && onAdd ? onAdd : undefined}
  >
    <span className={value ? "text-mfneutralsn-400" : "text-mfneutralsn-300"}>{icon}</span>
    <span className={`text-[13px] ${value ? "text-mfneutralsn-500" : "text-mfneutralsn-300"}`}>
      {value || placeholder}
    </span>
  </div>
);

const ContactCard = ({
  contact,
  extras,
  openEdit,
}: {
  contact: ContactDef;
  extras: ContactExtras;
  openEdit: (config: EditFieldConfig & { key: FieldKey }) => void;
}) => {
  const Badge = contact.primary ? PrimaryBadge : SecondaryBadge;
  return (
    <div className="mx-4 mb-3 p-4 rounded-2xl border border-[#f1f1f4] bg-white flex flex-col gap-1">
      {/* Top row: initials avatar + name + pill */}
      <div className="flex items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-3 min-w-0">
          {/* Initials-only avatar matching canvas blue circle style */}
          <div className="w-10 h-10 rounded-full bg-[#dce8fc] flex items-center justify-center flex-shrink-0">
            <span className="text-[13px] font-semibold text-[#1a6fc4]">{contact.fallback}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-mfneutralsn-500 leading-tight">{contact.name}</p>
            <p className="text-[13px] text-mfneutralsn-300 mt-0.5">{contact.role} · Additional info</p>
          </div>
        </div>
        {contact.primary && <PrimaryBadge />}
      </div>
      {/* Email + phone on the same row */}
      <div className="flex items-center gap-4 mt-0.5">
        <ContactInfoChip
          icon={<MailIcon className="w-4 h-4" />}
          value={extras.email}
          placeholder="Add email"
          onAdd={() => openEdit({
            title: `${contact.name} — Email`,
            subtitle: `Email address we can reach ${contact.role.toLowerCase()} on.`,
            type: "text", value: extras.email ?? "", placeholder: "name@example.com",
            key: { section: "family", field: `${contact.id}:email` },
          })}
        />
        <ContactInfoChip
          icon={<PhoneIcon className="w-4 h-4" />}
          value={extras.phone}
          placeholder="Phone missing"
          onAdd={() => openEdit({
            title: `${contact.name} — Phone`,
            subtitle: `Phone number we can reach ${contact.role.toLowerCase()} on.`,
            type: "text", value: extras.phone ?? "", placeholder: "+1 (555) 123-4567",
            key: { section: "family", field: `${contact.id}:phone` },
          })}
        />
      </div>
    </div>
  );
};

const FamilyDetail = ({
  extras,
  openEdit,
}: {
  extras: Record<string, ContactExtras>;
  openEdit: (config: EditFieldConfig & { key: FieldKey }) => void;
}) => (
  <div className="flex flex-col pt-3 pb-4">
    {CONTACTS.map((c) => (
      <ContactCard key={c.id} contact={c} extras={extras[c.id] ?? {}} openEdit={openEdit} />
    ))}
    {/* Sibling card */}
    <div className="mx-4 mt-1 p-4 rounded-2xl border border-[#f1f1f4] bg-white flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-[#dce8fc] flex items-center justify-center flex-shrink-0">
        <span className="text-[13px] font-semibold text-[#1a6fc4]">{SIBLING.fallback}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-mfneutralsn-500 leading-tight">{SIBLING.name}</p>
        <p className="text-[13px] text-mfneutralsn-300 mt-0.5">{SIBLING.role} · {SIBLING.room}</p>
      </div>
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

type PanelKey = "family" | "basic" | "health" | "permissions" | "leave" | null;

// Keep the Section type for care navigation (classic layout / care subpage)
type Section = "care" | "family" | "basic" | "health" | "leave" | "permissions" | null;

const sectionTitles: Record<NonNullable<Section>, string> = {
  care: "Care",
  family: "Family",
  basic: "Basic info",
  health: "Health details",
  leave: "Leave",
  permissions: "Permissions",
};

const BookingRow = ({ name, date, amount, status }: { name: string; date: string; amount: string; status: "pending" | "paid" }) => (
  <div className="px-4 py-2.5 flex items-center justify-between gap-2">
    <p className="text-sm font-semibold text-mfneutralsn-500 flex-1 min-w-0 truncate">{name}</p>
    <div className="flex items-center gap-2 flex-shrink-0">
      <span className="text-[14px] text-mfneutralsn-300">{date}</span>
      <span className="text-sm text-mfneutralsn-400">{amount}</span>
      <BookingStatusIcon status={status} />
    </div>
  </div>
);

const SubpageRowDual = ({
  icon,
  label,
  sublabel,
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  trailing?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-3 px-4 py-3 w-full border-b border-mfneutralsn-75">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-6 h-6 rounded-md bg-mfneutralsn-75 flex items-center justify-center flex-shrink-0 text-mfneutralsn-400">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[14px] text-mfneutralsn-400 truncate">{label}</p>
        {sublabel && <p className="text-[14px] text-mfneutralsn-300 mt-0.5 truncate">{sublabel}</p>}
      </div>
    </div>
    {trailing && <div className="flex-shrink-0">{trailing}</div>}
  </div>
);

const LeaveDetail = () => (
  <div className="flex flex-col">
    <Section Icon={SunIcon} title="Upcoming" description="Planned time off">
      <AboutRow Icon={SunIcon}  value="1 - 10 Jul 2026 · Holiday" />
      <AboutRow Icon={SunIcon}  value="22 - 24 Dec 2026 · Holiday" />
    </Section>
    <Section Icon={ThermometerIcon} title="Past" description="Previous absences">
      <AboutRow Icon={ThermometerIcon} value="4 Mar 2026 · Sick" />
      <AboutRow Icon={ThermometerIcon} value="18 - 19 Feb 2026 · Sick" />
      <AboutRow Icon={SunIcon}         value="23 Dec 2025 - 2 Jan 2026 · Holiday" />
    </Section>
  </div>
);

type PermissionStatus = "yes" | "no" | "pending";

const LATEST_PERMISSIONS: { id: string; label: string; status: PermissionStatus; lastChanged?: string; changedBy?: string }[] = [
  { id: "photos", label: "Can be in photos", status: "yes", lastChanged: "05/25/2026", changedBy: "Sofia Adams Growth" },
  { id: "animals", label: "Can play with animals", status: "no", lastChanged: "05/25/2026", changedBy: "Sofia Adams Growth" },
  { id: "sunscreen", label: "Can apply sunscreen", status: "yes", lastChanged: "05/25/2026", changedBy: "Sofia Adams Growth" },
  { id: "trips", label: "Can go on field trips", status: "no", lastChanged: "05/20/2026", changedBy: "Sofia Adams Growth" },
  { id: "plasters", label: "Can apply plasters", status: "no", lastChanged: "05/20/2026", changedBy: "Sofia Adams Growth" },
  { id: "social", label: "Can be on social media", status: "no", lastChanged: "05/18/2026", changedBy: "Sofia Adams Growth" },
];

const permissionSummary = (() => {
  const yes = LATEST_PERMISSIONS.filter(p => p.status === "yes").length;
  const no = LATEST_PERMISSIONS.filter(p => p.status === "no").length;
  const parts = [];
  if (no > 0) parts.push(`${no} no`);
  if (yes > 0) parts.push(`${yes} yes`);
  return parts.join(", ");
})();

const PermissionStatusBox = ({ status }: { status: PermissionStatus }) => {
  if (status === "yes") return (
    <div className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center flex-shrink-0">
      <CheckCircle2Icon className="w-4 h-4 text-green-700" />
    </div>
  );
  if (status === "no") return (
    <div className="w-6 h-6 rounded-md bg-red-100 flex items-center justify-center flex-shrink-0">
      <XCircleIcon className="w-4 h-4 text-red-700" />
    </div>
  );
  return (
    <div className="w-6 h-6 rounded-md bg-mfneutralsn-75 flex items-center justify-center flex-shrink-0">
      <HelpCircleIcon className="w-4 h-4 text-mfprimaryp-400" />
    </div>
  );
};

const PermissionRow = ({
  item,
  hideSubtitle = false,
}: {
  item: { label: string; status: PermissionStatus; lastChanged?: string; changedBy?: string };
  hideSubtitle?: boolean;
}) => (
  <div className="py-2 flex items-center gap-3">
    <PermissionStatusBox status={item.status} />
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-medium text-mfneutralsn-500 leading-tight">{item.label}</p>
      {!hideSubtitle && (item.lastChanged ? (
        <p className="text-[14px] text-mfneutralsn-300 mt-1 leading-tight">
          Last changed{item.changedBy ? ` by ${item.changedBy}` : ""} on {item.lastChanged}
        </p>
      ) : (
        <p className="text-[14px] text-mfprimaryp-400 mt-1 leading-tight">Needs your response</p>
      ))}
    </div>
  </div>
);

type PermAnswer = "yes" | "no" | null;

interface PermItem {
  id: string;
  label: string;
  answer: PermAnswer;
  lastChanged?: string;
}

const PermissionsDetail = () => {
  const [items, setItems] = useState<PermItem[]>([
    { id: "photos", label: "Can your child be photographed?", answer: null },
    { id: "field-trip", label: "Can go on a field trip", answer: "yes", lastChanged: "01/02/2025" },
    { id: "animals", label: "Can play with animals", answer: "yes", lastChanged: "06/10/2024" },
    { id: "sunscreen", label: "Sunscreen", answer: "yes", lastChanged: "05/06/2024" },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const setAnswer = (id: string, answer: "yes" | "no") => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, answer } : it)));
    setEditingId(null);
  };

  return (
    <div className="flex flex-col">
      <Section Icon={ShieldCheckIcon} title="Permissions" description="Your child's consents">
      {items.map((item) => {
        const isEditing = editingId === item.id || item.answer === null;
        return (
          <div
            key={item.id}
            className="flex items-center gap-3 py-2.5"
          >
            <PermissionStatusBox status={item.answer ?? "pending"} />
            <span className="flex-1 text-sm font-medium text-mfneutralsn-500">{item.label}</span>
            {isEditing ? (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setAnswer(item.id, "yes")}
                  className="px-3 py-1 text-[14px] font-medium rounded-md border border-gray-200 bg-white text-mfneutralsn-500 active:bg-gray-50"
                >
                  Yes
                </button>
                <button
                  onClick={() => setAnswer(item.id, "no")}
                  className="px-3 py-1 text-[14px] font-medium rounded-md border border-gray-200 bg-white text-mfneutralsn-500 active:bg-gray-50"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingId(item.id)}
                className="px-3 py-1 text-[14px] font-medium rounded-md border border-gray-200 bg-white text-mfneutralsn-400 active:bg-gray-50 flex-shrink-0"
              >
                Edit
              </button>
            )}
          </div>
        );
      })}
      </Section>
    </div>
  );
};

export const OverviewContent = (): JSX.Element => {
  const variant = useProfileVariant();
  const design = useChildProfileDesign();
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();
  const location = useLocation();
  // For classic layout: full-screen section navigation
  const [section, setSection] = useState<Section>(null);
  // For new layout: panel overlay
  const [panel, setPanel] = useState<PanelKey>(null);
  const [showLeaveSheet, setShowLeaveSheet] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const [basicInfo, setBasicInfo] = useState<BasicInfoState>({
    dateOfBirth: "2025-02-01",
    languages: ["English", "Spanish"],
    gender: "Boy",
    allergy: "Peanuts",
    nationality: "",
    birthplace: "",
    specialNotes: "",
    sensitiveInfo: "",
  });

  const [aboutState, setAboutState] = useState<AboutState>({
    fullName: "Abby Freedman",
    preferredName: "",
    dateOfBirth: "2025-02-01",
    languages: "English, Spanish",
    nationality: "",
    birthplace: "",
    homeLanguage: "",
    livesWith: "",
    parentalResponsibility: "",
    ethnicity: "",
    religion: "",
    specialNote: "",
  });
  const [aboutEditing, setAboutEditing] = useState(false);
  const [aboutFocusField, setAboutFocusField] = useState<keyof AboutState | null>(null);
  const [aboutDraft, setAboutDraft] = useState<AboutState | null>(null);

  const openAboutEdit = (field: keyof AboutState | null = null) => {
    setAboutDraft({ ...aboutState });
    setAboutFocusField(field);
    setAboutEditing(true);
  };
  const cancelAboutEdit = () => { setAboutEditing(false); setAboutFocusField(null); setAboutDraft(null); };
  const saveAboutEdit = () => { if (aboutDraft) setAboutState(aboutDraft); setAboutEditing(false); setAboutFocusField(null); setAboutDraft(null); };

  const [healthEditing, setHealthEditing] = useState(false);
  const [healthFocusField, setHealthFocusField] = useState<keyof HealthState | null>(null);
  const [healthDraft, setHealthDraft] = useState<HealthState | null>(null);

  const openHealthEdit = (field: keyof HealthState | null = null) => {
    setHealthDraft({ ...health });
    setHealthFocusField(field);
    setHealthEditing(true);
  };
  const cancelHealthEdit = () => { setHealthEditing(false); setHealthFocusField(null); setHealthDraft(null); };
  const saveHealthEdit = () => { if (healthDraft) setHealth(healthDraft); setHealthEditing(false); setHealthFocusField(null); setHealthDraft(null); };

  const [health, setHealth] = useState<HealthState>({
    toleratesPenicillin: "Yes",
    diet: "",
    specialNotes: "Epi-pen available",
    doctorName: "Phillip O'Donnell",
    doctorPhone: "070 3597 2396",
    doctorAddress: "235 N. Greenbrier Street\nArlington\nVA 22203\nUS",
    dentistName: "",
    dentistPhone: "",
    dentistAddress: "",
  });

  const [familyExtras, setFamilyExtras] = useState<Record<string, ContactExtras>>({
    sarah: { phone: "+1 (555) 123-4567" },
    michael: { phone: "+1 (555) 123-4567" },
  });

  const [editingField, setEditingField] = useState<EditingField>(null);

  const openEdit = (config: EditFieldConfig & { key: FieldKey }) =>
    setEditingField(config);

  const handleSaveField = (value: string) => {
    if (!editingField) return;
    const { section: target, field } = editingField.key;
    if (target === "basic") {
      if (field === "languages") {
        const parsed = value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .filter((lang) => LANGUAGE_OPTIONS_ARR.includes(lang) || lang.length > 0);
        setBasicInfo((prev) => ({ ...prev, languages: parsed }));
      } else {
        setBasicInfo((prev) => ({ ...prev, [field]: value }));
      }
    } else if (target === "health") {
      setHealth((prev) => ({ ...prev, [field]: value }));
    } else if (target === "family") {
      const [contactId, contactField] = field.split(":");
      setFamilyExtras((prev) => ({
        ...prev,
        [contactId]: { ...prev[contactId], [contactField]: value },
      }));
    }
  };

  useEffect(() => {
    const aboutSection = (location.state as { aboutSection?: Section } | null)?.aboutSection;
    if (aboutSection) {
      setSection(aboutSection);
      navigate("/child-profile", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Classic layout: scroll to top on section change
  useEffect(() => {
    setShowLeaveSheet(false);
    const handle = requestAnimationFrame(() => {
      const scrollable = rootRef.current?.closest(".overflow-y-auto") as HTMLElement | null;
      if (scrollable) scrollable.scrollTop = 0;
    });
    return () => cancelAnimationFrame(handle);
  }, [section]);

  // ── Classic layout full-screen section view ─────────────────────────────────
  if (design === "classic" && section !== null) {
    return (
      <div ref={rootRef} className="flex flex-col bg-white min-h-full">
        <SectionHeader
          title={sectionTitles[section]}
          onBack={() => setSection(null)}
          trailing={
            section === "leave" ? (
              <button
                type="button"
                onClick={() => setShowLeaveSheet(true)}
                className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-mfneutralsn-200 bg-white text-[14px] font-medium text-mfneutralsn-500 active:bg-gray-50 flex-shrink-0"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                Add leave
              </button>
            ) : undefined
          }
        />
        {section === "care" && <CareDetail />}
        {section === "family" && <FamilyDetail extras={familyExtras} openEdit={openEdit} />}
        {section === "basic" && <BasicInfoDetail state={basicInfo} openEdit={openEdit} />}
        {section === "health" && <HealthDetailsDetail state={health} openEdit={openEdit} />}
        {section === "leave" && <LeaveDetail />}
        {section === "permissions" && <PermissionsDetail />}
        <AddLeaveSheet
          isOpen={section === "leave" && showLeaveSheet}
          onClose={() => setShowLeaveSheet(false)}
          useAbsolute={shouldShowFrame}
        />
        <EditFieldSheet
          isOpen={editingField !== null}
          field={editingField}
          onClose={() => setEditingField(null)}
          onSave={handleSaveField}
          useAbsolute={shouldShowFrame}
        />
      </div>
    );
  }

  // ── Classic layout ──────────────────────────────────────────────────────────
  if (design === "classic") {
    return (
      <div ref={rootRef} className="flex flex-col bg-white pt-4 pb-24 gap-4">
        <ClassicCard>
          <ClassicSectionCardHeader title="Permissions" subtitle="Parental consent" />
          <div className="px-4">{LATEST_PERMISSIONS.slice(0, 2).map((p) => <PermissionRow key={p.id} item={p} hideSubtitle />)}</div>
          <ClassicViewAllLink onPress={() => setSection("permissions")} />
        </ClassicCard>

        <ClassicCard>
          <ClassicSectionCardHeader title="Basic info" />
          <SummaryRow icon={<LockIcon className="w-4 h-4" />} label={`${formatHumanDate(basicInfo.dateOfBirth) || "1 Feb 2025"} (1 year 4 months)`} />
          <SummaryRow icon={<LanguagesIcon className="w-4 h-4" />} label={basicInfo.languages.join(", ") || "Add languages"} />
          {basicInfo.allergy && (
            <div className="flex h-12 items-center gap-3 px-4">
              <div className="w-6 h-6 rounded-md bg-mfyellowy-100 flex items-center justify-center flex-shrink-0 text-mfyellowy-400">
                <AlertTriangleIcon className="w-4 h-4" />
              </div>
              <p className="text-[14px] text-mfneutralsn-500 truncate">{basicInfo.allergy}</p>
            </div>
          )}
          <ClassicViewAllLink onPress={() => setSection("basic")} />
        </ClassicCard>

        <ClassicCard>
          <ClassicSectionCardHeader title="Family" />
          <ClassicFamilyPreviewRow avatar={MOTHER_AVATAR} fallback="SF" name="Sarah Freedman" role="Mother (Primary)" phone={familyExtras.sarah?.phone} />
          <ClassicFamilyPreviewRow avatar={FATHER_AVATAR} fallback="MF" name="Michael Freedman" role="Father" phone={familyExtras.michael?.phone} />
          <ClassicViewAllLink onPress={() => setSection("family")} />
        </ClassicCard>

        <ClassicCard>
          <ClassicSectionCardHeader title="Health details" subtitle="Doctor and med info" />
          <SummaryRow icon={<StethoscopeIcon className="w-4 h-4" />} label={health.doctorName || "Add doctor info"} />
          <SummaryRow icon={<MapPinIcon className="w-4 h-4" />} label={health.doctorAddress ? health.doctorAddress.split("\n")[0] : "Add address"} />
          <ClassicViewAllLink onPress={() => setSection("health")} />
        </ClassicCard>

        <ClassicCard>
          <ClassicSectionCardHeader title="Leave" subtitle="Upcoming and past absences" />
          <div className="px-4">
            <LeaveRow icon={<div className="w-6 h-6 rounded-md bg-yellow-100 flex items-center justify-center flex-shrink-0"><SunIcon className="w-4 h-4 text-yellow-700" /></div>} label="1 - 10 Jul 26" sublabel="Holiday · Opted out of meals" trailing="Upcoming" />
            <LeaveRow icon={<div className="w-6 h-6 rounded-md bg-red-100 flex items-center justify-center flex-shrink-0"><ThermometerIcon className="w-4 h-4 text-red-700" /></div>} label="4 Mar 26" sublabel="Sick" trailing="Past" />
          </div>
          <ClassicViewAllLink onPress={() => setSection("leave")} />
        </ClassicCard>

        {variant === "v1" && (
          <ClassicCard>
            <ClassicCardHeader title="Care" onPress={() => setSection("care")} />
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-mfneutralsn-500">Monthly full time</p>
              <p className="text-[14px] text-mfneutralsn-300 mt-0.5">$1,350/month · Aug 31 –</p>
            </div>
          </ClassicCard>
        )}

        <EditFieldSheet isOpen={editingField !== null} field={editingField} onClose={() => setEditingField(null)} onSave={handleSaveField} useAbsolute={shouldShowFrame} />
      </div>
    );
  }

  // ── New (child-pro) layout ──────────────────────────────────────────────────
  return (
    <div ref={rootRef} className="flex flex-col bg-white pt-4 pb-24">
      {/* Permissions */}
      <Section
        title="Permissions"
        description={permissionSummary}
        onViewAll={() => setPanel("permissions")}
      >
        {LATEST_PERMISSIONS.slice(0, 2).map((p) => (
          <PermissionRow key={p.id} item={p} hideSubtitle />
        ))}
      </Section>

      {/* About / Basic info */}
      <Section
        title="About"
        description="Personal details"
        onViewAll={() => setPanel("basic")}
      >
        <AboutRow Icon={CakeIcon} value={`${formatHumanDate(basicInfo.dateOfBirth) || "1 Feb 2025"} (1 year 4 months)`} />
        <AboutRow
          Icon={LanguagesIcon}
          value={basicInfo.languages.length ? basicInfo.languages.join(", ") : "Add languages"}
        />
        <AboutRow
          Icon={UserIcon}
          value={basicInfo.gender || "Add gender"}
        />
        {basicInfo.allergy && (
          <AboutRow Icon={AlertTriangleIcon} value={basicInfo.allergy} />
        )}
      </Section>

      {/* Family */}
      <Section
        title="Family"
        description="4 contacts · 1 sibling"
        onViewAll={() => setPanel("family")}
      >
        <ContactSummaryCard
          avatarSrc={MOTHER_AVATAR}
          fallback="SF"
          name="Sarah Freedman"
          relation="Mother"
          additionalInfo="Primary contact"
          pill="Primary"
          onClick={() => setPanel("family")}
        />
        <ContactSummaryCard
          avatarSrc={FATHER_AVATAR}
          fallback="MF"
          name="Michael Freedman"
          relation="Father"
          pill="Secondary"
          onClick={() => setPanel("family")}
        />
      </Section>

      {/* Health details */}
      <Section
        title="Health details"
        description="Doctor and med info"
        onViewAll={() => setPanel("health")}
      >
        <AboutRow Icon={StethoscopeIcon} value={health.doctorName || "Add doctor info"} />
        <AboutRow Icon={HelpCircleIcon} value={health.toleratesPenicillin ? `Penicillin: ${health.toleratesPenicillin}` : "Add penicillin info"} />
      </Section>

      {/* Leave */}
      <Section
        title="Leave"
        description="Upcoming and past absences"
        onViewAll={() => setPanel("leave")}
      >
        <LeaveRow
          icon={<div className="w-6 h-6 rounded-md bg-yellow-100 flex items-center justify-center flex-shrink-0"><SunIcon className="w-4 h-4 text-yellow-700" /></div>}
          label="1 - 10 Jul 26"
          sublabel="Holiday · Opted out of meals"
          trailing="Upcoming"
        />
        <LeaveRow
          icon={<div className="w-6 h-6 rounded-md bg-red-100 flex items-center justify-center flex-shrink-0"><ThermometerIcon className="w-4 h-4 text-red-700" /></div>}
          label="4 Mar 26"
          sublabel="Sick"
          trailing="Past"
        />
      </Section>

      {/* Panel overlays */}
      {panel === "family" && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col">
          <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-[#f1f1f4] flex-shrink-0">
            <button
              onClick={() => setPanel(null)}
              className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0"
              aria-label="Back"
            >
              <ArrowLeftIcon className="w-4 h-4 text-mfneutralsn-500" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[17px] font-semibold text-mfneutralsn-500 leading-snug">Family</p>
              <p className="text-[13px] text-mfneutralsn-300 mt-0.5">4 contacts · 1 sibling</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <FamilyDetail extras={familyExtras} openEdit={openEdit} />
          </div>
          <div className="flex-shrink-0 px-4 py-4 border-t border-[#f1f1f4] flex gap-3">
            <button className="flex-1 h-10 rounded-lg border border-mfneutralsn-200 bg-white text-[14px] font-medium text-mfneutralsn-500 active:bg-gray-50">
              Link sibling
            </button>
            <button className="flex-1 h-10 rounded-lg border border-mfneutralsn-200 bg-white text-[14px] font-medium text-mfneutralsn-500 active:bg-gray-50">
              Add contact
            </button>
          </div>
        </div>
      )}
      {panel === "basic" && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col">
          {/* header */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-[#f1f1f4] flex-shrink-0">
            <button
              onClick={aboutEditing ? cancelAboutEdit : () => { setPanel(null); }}
              className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0"
              aria-label="Back"
            >
              <ArrowLeftIcon className="w-4 h-4 text-mfneutralsn-500" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[17px] font-semibold text-mfneutralsn-500 leading-snug">About</p>
              {!aboutEditing && <p className="text-[13px] text-mfneutralsn-300 mt-0.5">Personal details</p>}
            </div>
          </div>
          {/* body */}
          <div className="flex-1 overflow-y-auto">
            {aboutEditing ? (
              <AboutEditContent
                state={aboutDraft!}
                focusField={aboutFocusField}
                onChange={(field, value) => setAboutDraft((prev) => prev ? { ...prev, [field]: value } : prev)}
              />
            ) : (
              <AboutViewContent
                state={aboutState}
                onEdit={(field) => openAboutEdit(field)}
              />
            )}
          </div>
          {/* footer */}
          {aboutEditing ? (
            <div className="flex-shrink-0 px-4 py-4 border-t border-[#f1f1f4] flex gap-3">
              <button
                onClick={cancelAboutEdit}
                className="flex-1 h-11 rounded-xl border border-mfneutralsn-200 bg-white text-[15px] font-medium text-mfneutralsn-500 active:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveAboutEdit}
                className="flex-1 h-11 rounded-xl bg-mfprimaryp-400 text-white text-[15px] font-semibold active:opacity-90 transition-opacity"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex-shrink-0 px-4 py-4 border-t border-[#f1f1f4]">
              <button
                onClick={() => openAboutEdit(null)}
                className="w-full h-11 rounded-xl bg-mfprimaryp-400 text-white text-[15px] font-semibold active:opacity-90 transition-opacity"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      )}
      {panel === "health" && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col">
          <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-[#f1f1f4] flex-shrink-0">
            <button
              onClick={healthEditing ? cancelHealthEdit : () => { setPanel(null); }}
              className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0"
              aria-label="Back"
            >
              <ArrowLeftIcon className="w-4 h-4 text-mfneutralsn-500" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[17px] font-semibold text-mfneutralsn-500 leading-snug">Health details</p>
              {!healthEditing && <p className="text-[13px] text-mfneutralsn-300 mt-0.5">Doctor and med info</p>}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {healthEditing ? (
              <HealthEditContent
                state={healthDraft!}
                focusField={healthFocusField}
                onChange={(field, value) => setHealthDraft((prev) => prev ? { ...prev, [field]: value } : prev)}
              />
            ) : (
              <HealthViewContent
                state={health}
                onEdit={(field) => openHealthEdit(field)}
              />
            )}
          </div>
          {healthEditing ? (
            <div className="flex-shrink-0 px-4 py-4 border-t border-[#f1f1f4] flex gap-3">
              <button
                onClick={cancelHealthEdit}
                className="flex-1 h-11 rounded-xl border border-mfneutralsn-200 bg-white text-[15px] font-medium text-mfneutralsn-500 active:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveHealthEdit}
                className="flex-1 h-11 rounded-xl bg-mfprimaryp-400 text-white text-[15px] font-semibold active:opacity-90 transition-opacity"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex-shrink-0 px-4 py-4 border-t border-[#f1f1f4]">
              <button
                onClick={() => openHealthEdit(null)}
                className="w-full h-11 rounded-xl bg-mfprimaryp-400 text-white text-[15px] font-semibold active:opacity-90 transition-opacity"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      )}
      {panel === "permissions" && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col">
          <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-[#f1f1f4] flex-shrink-0">
            <button
              onClick={() => setPanel(null)}
              className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0"
              aria-label="Back"
            >
              <ArrowLeftIcon className="w-4 h-4 text-mfneutralsn-500" />
            </button>
            <p className="text-[17px] font-semibold text-mfneutralsn-500 flex-1">Permissions</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <PermissionsDetail />
          </div>
        </div>
      )}
      {panel === "leave" && (
        <div className="fixed inset-0 z-[200] bg-white flex flex-col">
          <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-[#f1f1f4] flex-shrink-0">
            <button
              onClick={() => setPanel(null)}
              className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0"
              aria-label="Back"
            >
              <ArrowLeftIcon className="w-4 h-4 text-mfneutralsn-500" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[17px] font-semibold text-mfneutralsn-500 leading-snug">Leave</p>
              <p className="text-[13px] text-mfneutralsn-300 mt-0.5">Upcoming and past absences</p>
            </div>
            <button
              type="button"
              onClick={() => setShowLeaveSheet(true)}
              className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-mfneutralsn-200 bg-white text-[14px] font-medium text-mfneutralsn-500 active:bg-gray-50"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Add leave
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <LeaveDetail />
          </div>
        </div>
      )}

      <AddLeaveSheet
        isOpen={panel === "leave" && showLeaveSheet}
        onClose={() => setShowLeaveSheet(false)}
        useAbsolute={shouldShowFrame}
      />
      <EditFieldSheet
        isOpen={editingField !== null}
        field={editingField}
        onClose={() => setEditingField(null)}
        onSave={handleSaveField}
        useAbsolute={shouldShowFrame}
      />
    </div>
  );
};

const LeaveRow = ({ icon, label, sublabel, trailing }: { icon: React.ReactNode; label: string; sublabel: string; trailing: string }) => (
  <div className="py-2 flex items-center gap-3">
    {icon}
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-medium text-mfneutralsn-500 leading-tight">{label}</p>
      <p className="text-[14px] text-mfneutralsn-300 mt-1 leading-tight truncate">{sublabel}</p>
    </div>
    <span className="text-[14px] text-mfneutralsn-300 flex-shrink-0">{trailing}</span>
  </div>
);
