import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRightIcon, ArrowLeftIcon, HomeIcon, PhoneIcon, InfoIcon, CalendarIcon, BookOpenIcon, SunIcon, ThermometerIcon, MessageSquareIcon, PencilIcon, KeyRoundIcon, UserIcon, StethoscopeIcon, ShieldAlertIcon, StickyNoteIcon, IdCardIcon, CheckCircle2Icon, XCircleIcon, HelpCircleIcon } from "lucide-react";
import { useProfileVariant } from "../../../../hooks/useProfileVariant";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import { setChildProfileSubpageActive } from "../../../../hooks/useChildProfileSubpage";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { AbsenceOverlay } from "../../../../components/AbsenceOverlay/AbsenceOverlay";

const KEY_PERSON_NAME = "Olivia Wilson";
const KEY_PERSON_INITIALS = "OW";
const KEY_PERSON_CHAT_ID = 1;
const KEY_PERSON_AVATAR = "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400";
const MOTHER_AVATAR = "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400";
const FATHER_AVATAR = "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400";

// ── Shared primitives ─────────────────────────────────────────────────────────

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-[8.5px] rounded-2xl overflow-hidden border border-mfneutralsn-75 bg-white">
    {children}
  </div>
);

const CardHeader = ({ title, onPress }: { title: string; onPress?: () => void }) => (
  <button onClick={onPress} className="w-full flex items-center justify-between px-4 pt-3 pb-2 text-left">
    <span className="text-[14px] text-mfneutralsn-300">{title}</span>
    <ChevronRightIcon className="w-5 h-5 text-mfneutralsn-200" />
  </button>
);

const Divider = () => <div className="h-px bg-mfneutralsn-75 mx-4" />;

const InfoRow = ({ label, sublabel }: { label: string; sublabel: string }) => (
  <div className="px-4 py-3">
    <p className="text-[14px] font-medium text-mfneutralsn-500 leading-tight">{label}</p>
    <p className="text-[14px] text-mfneutralsn-300 mt-1 leading-tight">{sublabel}</p>
  </div>
);

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

const SummaryPersonRow = ({
  avatarSrc,
  avatarAlt,
  fallback,
  label,
  trailing,
}: {
  avatarSrc: string;
  avatarAlt: string;
  fallback: string;
  label: string;
  trailing?: React.ReactNode;
}) => (
  <div className="flex h-12 items-center justify-between gap-3 px-4 w-full">
    <div className="flex items-center gap-3 min-w-0">
      <Avatar className="w-6 h-6 flex-shrink-0">
        <AvatarImage src={avatarSrc} alt={avatarAlt} />
        <AvatarFallback className="text-[10px]">{fallback}</AvatarFallback>
      </Avatar>
      <p className="text-[14px] text-mfneutralsn-400 truncate">{label}</p>
    </div>
    {trailing && <div className="flex-shrink-0">{trailing}</div>}
  </div>
);

const SectionHeader = ({
  title,
  onBack,
  onEdit,
  onSave,
  onCancel,
  editActive,
}: {
  title: string;
  onBack: () => void;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  editActive?: boolean;
}) => (
  <div className="flex items-center gap-2 px-4 py-3">
    <button
      onClick={onBack}
      className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0"
    >
      <ArrowLeftIcon className="w-4 h-4 text-mfneutralsn-500" />
    </button>
    <span className="text-base font-semibold text-mfneutralsn-500 flex-1">{title}</span>
    {editActive ? (
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onCancel}
          className="px-3 h-9 rounded-lg border border-mfneutralsn-200 bg-white text-[13px] font-medium text-mfneutralsn-500 active:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-3 h-9 rounded-lg bg-mfprimaryp-400 text-white text-[13px] font-medium"
        >
          Save
        </button>
      </div>
    ) : (
      onEdit && (
        <button
          onClick={onEdit}
          aria-label={`Edit ${title}`}
          className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-mfneutralsn-200 bg-white text-[13px] font-medium text-mfneutralsn-500 active:bg-gray-50 flex-shrink-0"
        >
          <PencilIcon className="w-3.5 h-3.5" />
          Edit
        </button>
      )
    )}
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

const SubpageRow = ({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}) => (
  <button
    onClick={onPress}
    className="flex h-12 items-center justify-between gap-3 px-4 w-full border-b border-mfneutralsn-75 text-left active:bg-gray-50"
  >
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-6 h-6 rounded-md bg-mfneutralsn-75 flex items-center justify-center flex-shrink-0 text-mfneutralsn-400">
        {icon}
      </div>
      <p className="text-[14px] text-mfneutralsn-400 truncate">{label}</p>
    </div>
  </button>
);

const SubpagePersonRow = ({
  avatarSrc,
  avatarAlt,
  fallback,
  label,
  badge,
  onPress,
}: {
  avatarSrc: string;
  avatarAlt: string;
  fallback: string;
  label: string;
  badge?: React.ReactNode;
  onPress?: () => void;
}) => (
  <button
    onClick={onPress}
    className="flex h-12 items-center justify-between gap-3 px-4 w-full border-b border-mfneutralsn-75 text-left active:bg-gray-50"
  >
    <div className="flex items-center gap-3 min-w-0">
      <Avatar className="w-6 h-6 flex-shrink-0">
        <AvatarImage src={avatarSrc} alt={avatarAlt} />
        <AvatarFallback className="text-[10px]">{fallback}</AvatarFallback>
      </Avatar>
      <p className="text-[14px] text-mfneutralsn-400 truncate">{label}</p>
    </div>
    {badge && <div className="flex-shrink-0">{badge}</div>}
  </button>
);

const SubsectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="px-4 pt-5 pb-3 text-[16px] font-medium text-mfneutralsn-400">{children}</p>
);

const CareDetail = () => (
  <div className="flex flex-col pt-2 pb-24 gap-2 px-2">
    <div className="bg-white border border-mfprimaryp-100 rounded-xl p-4">
      <p className="text-xs text-mfneutralsn-300 mb-1">Care plan</p>
      <p className="text-sm font-semibold text-mfneutralsn-500">Monthly full time</p>
      <p className="text-xs text-mfneutralsn-300 mt-0.5">$1,350/month · Aug 31 –</p>
    </div>
    <div className="bg-white border border-mfprimaryp-100 rounded-xl p-4">
      <p className="text-xs text-mfneutralsn-300 mb-3">Upcoming bookings</p>
      <div className="flex items-center justify-between py-1">
        <p className="text-sm font-semibold text-mfneutralsn-500 flex-1">After School Care</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-mfneutralsn-300">Mar 7</span>
          <span className="text-sm text-mfneutralsn-400">$50.00</span>
          <BookingStatusIcon status="pending" />
        </div>
      </div>
      <div className="h-px bg-gray-100 my-1" />
      <div className="flex items-center justify-between py-1">
        <p className="text-sm font-semibold text-mfneutralsn-500 flex-1">After School Care</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-mfneutralsn-300">Feb 1</span>
          <span className="text-sm text-mfneutralsn-400">$50.00</span>
          <BookingStatusIcon status="paid" />
        </div>
      </div>
    </div>
  </div>
);

const PrimaryBadge = () => (
  <span className="text-[11px] px-2 py-0.5 rounded-full border border-mfprimaryp-400 text-mfprimaryp-400">Primary</span>
);

const SecondaryBadge = () => (
  <span className="text-[11px] px-2 py-0.5 rounded-full border border-mfneutralsn-200 text-mfneutralsn-400">Secondary</span>
);

const LabelValueRow = ({ label, value }: { label: string; value: string }) => (
  <div className="px-4 pt-2 pb-4">
    <p className="text-[14px] text-mfneutralsn-300 leading-tight">{label}</p>
    <p className="text-[16px] text-mfneutralsn-500 leading-tight mt-1">{value || "-"}</p>
  </div>
);

const FieldShell = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="px-4 pt-2 pb-4">
    <p className="text-[14px] font-medium text-mfneutralsn-500 leading-tight mb-1.5">{label}</p>
    {children}
  </div>
);

const inputClass =
  "w-full h-10 px-3 rounded-lg border border-mfneutralsn-200 bg-white text-[14px] text-mfneutralsn-500 focus:outline-none focus:border-mfprimaryp-400";

const TextField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <FieldShell label={label}>
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  </FieldShell>
);

const DateField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <FieldShell label={label}>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  </FieldShell>
);

const SelectField = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) => (
  <FieldShell label={label}>
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </FieldShell>
);

const LANGUAGE_OPTIONS = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Mandarin", "Arabic", "Polish", "Turkish"];

const LanguagesField = ({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
}) => {
  const [adding, setAdding] = useState(false);
  const available = LANGUAGE_OPTIONS.filter((l) => !values.includes(l));

  return (
    <FieldShell label={label}>
      <div className="flex flex-col gap-2">
        {values.map((lang, i) => (
          <div key={i} className="flex items-center gap-2">
            <select
              value={lang}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
              className={inputClass}
            >
              <option value={lang}>{lang}</option>
              {LANGUAGE_OPTIONS.filter((l) => !values.includes(l) || l === lang).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <button
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              aria-label={`Remove ${lang}`}
              className="w-9 h-9 rounded-lg border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0 text-mfneutralsn-400 active:bg-gray-50"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
        {adding ? (
          <select
            autoFocus
            onChange={(e) => {
              if (e.target.value) {
                onChange([...values, e.target.value]);
                setAdding(false);
              }
            }}
            className={inputClass}
          >
            <option value="">Choose a language…</option>
            {available.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : (
          available.length > 0 && (
            <button
              onClick={() => setAdding(true)}
              aria-label="Add language"
              className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center text-mfneutralsn-500 active:bg-gray-50"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )
        )}
      </div>
    </FieldShell>
  );
};

// ── Detail view: Basic info ───────────────────────────────────────────────────

type OptionalKey = "nationality" | "birthplace" | "specialNotes" | "sensitiveInfo";
const OPTIONAL_LABELS: Record<OptionalKey, string> = {
  nationality: "Nationality",
  birthplace: "Birthplace",
  specialNotes: "Special notes",
  sensitiveInfo: "Sensitive info",
};

const BasicInfoDetail = ({ editing }: { editing: boolean }) => {
  const [dateOfBirth, setDateOfBirth] = useState("2025-02-01");
  const [languages, setLanguages] = useState<string[]>(["English", "Spanish"]);
  const [gender, setGender] = useState("Boy");
  const [optional, setOptional] = useState<Record<OptionalKey, string>>({
    nationality: "",
    birthplace: "",
    specialNotes: "",
    sensitiveInfo: "",
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  if (editing) {
    return (
      <div className="flex flex-col pb-24 pt-2">
        <DateField label="Date of birth" value={dateOfBirth} onChange={setDateOfBirth} />
        <LanguagesField label="Languages" values={languages} onChange={setLanguages} />
        <SelectField label="Gender" value={gender} options={["Boy", "Girl", "Other", "Prefer not to say"]} onChange={setGender} />
        {(Object.keys(OPTIONAL_LABELS) as OptionalKey[]).map((k) => (
          <TextField
            key={k}
            label={OPTIONAL_LABELS[k]}
            value={optional[k]}
            onChange={(v) => setOptional((p) => ({ ...p, [k]: v }))}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-24 pt-2">
      <LabelValueRow label="Date of birth" value={formatDate(dateOfBirth)} />
      <LabelValueRow label="Languages" value={languages.join(", ")} />
      <LabelValueRow label="Gender" value={gender} />
      {(Object.keys(OPTIONAL_LABELS) as OptionalKey[]).map((k) => (
        <LabelValueRow key={k} label={OPTIONAL_LABELS[k]} value={optional[k]} />
      ))}
    </div>
  );
};

// ── Detail view: Health details ───────────────────────────────────────────────

type HealthOptionalKey = "medication" | "immunization";
const HEALTH_OPTIONAL_LABELS: Record<HealthOptionalKey, string> = {
  medication: "Medication",
  immunization: "Immunization record",
};

const HealthDetailsDetail = ({ editing }: { editing: boolean }) => {
  const [doctorName, setDoctorName] = useState("Phil Cawlins");
  const [doctorPhone, setDoctorPhone] = useState("+1 (555) 123-4567");
  const [allergies, setAllergies] = useState("Lactose, Peanuts");
  const [notes, setNotes] = useState("Tolerates penicillin");
  const [optional, setOptional] = useState<Record<HealthOptionalKey, string>>({
    medication: "",
    immunization: "",
  });

  if (editing) {
    return (
      <div className="flex flex-col pb-24 pt-2">
        <TextField label="Doctor's name" value={doctorName} onChange={setDoctorName} />
        <TextField label="Doctor's phone" value={doctorPhone} onChange={setDoctorPhone} />
        <TextField label="Allergies" value={allergies} onChange={setAllergies} placeholder="Comma separated" />
        <TextField label="Additional notes" value={notes} onChange={setNotes} />
        {(Object.keys(HEALTH_OPTIONAL_LABELS) as HealthOptionalKey[]).map((k) => (
          <TextField
            key={k}
            label={HEALTH_OPTIONAL_LABELS[k]}
            value={optional[k]}
            onChange={(v) => setOptional((p) => ({ ...p, [k]: v }))}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-24 pt-2">
      <LabelValueRow label="Doctor's name" value={doctorName} />
      <LabelValueRow label="Doctor's phone" value={doctorPhone} />
      <LabelValueRow label="Allergies" value={allergies} />
      <LabelValueRow label="Additional notes" value={notes} />
      {(Object.keys(HEALTH_OPTIONAL_LABELS) as HealthOptionalKey[]).map((k) => (
        <LabelValueRow key={k} label={HEALTH_OPTIONAL_LABELS[k]} value={optional[k]} />
      ))}
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
  { id: "sarah", name: "Sarah Freedman", role: "Mother", avatar: MOTHER_AVATAR, fallback: "SF", primary: true },
  { id: "michael", name: "Michael Freedman", role: "Father", avatar: FATHER_AVATAR, fallback: "MF", primary: false },
];

type ContactExtras = { email?: string; phone?: string };

const ContactCard = ({
  contact,
  extras,
  editing,
  onChange,
}: {
  contact: ContactDef;
  extras: ContactExtras;
  editing: boolean;
  onChange: (next: ContactExtras) => void;
}) => {
  const Badge = contact.primary ? PrimaryBadge : SecondaryBadge;
  return (
    <div className="px-4 pt-4 pb-2 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback>{contact.fallback}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-[14px] font-medium text-mfneutralsn-500 truncate">{contact.name}</p>
            <p className="text-[14px] text-mfneutralsn-300">{contact.role}</p>
          </div>
        </div>
        <Badge />
      </div>

      {editing ? (
        <>
          <FieldShell label="Email">
            <input
              value={extras.email ?? ""}
              placeholder="name@example.com"
              onChange={(e) => onChange({ ...extras, email: e.target.value })}
              className={inputClass}
            />
          </FieldShell>
          <FieldShell label="Phone number">
            <input
              value={extras.phone ?? ""}
              placeholder="+1 (555) 123-4567"
              onChange={(e) => onChange({ ...extras, phone: e.target.value })}
              className={inputClass}
            />
          </FieldShell>
        </>
      ) : (
        <>
          <LabelValueRow label="Email" value={extras.email ?? ""} />
          <LabelValueRow label="Phone number" value={extras.phone ?? ""} />
        </>
      )}
    </div>
  );
};

const FamilyDetail = ({ editing }: { editing: boolean }) => {
  const [extras, setExtras] = useState<Record<string, ContactExtras>>({
    sarah: { phone: "+1 (555) 123-4567" },
    michael: { phone: "+1 (555) 123-4567" },
  });

  return (
    <div className="flex flex-col pb-24">
      <SubsectionTitle>Parents</SubsectionTitle>
      {CONTACTS.map((c) => (
        <ContactCard
          key={c.id}
          contact={c}
          extras={extras[c.id] ?? {}}
          editing={editing}
          onChange={(next) => setExtras((prev) => ({ ...prev, [c.id]: next }))}
        />
      ))}

      <SubsectionTitle>Siblings</SubsectionTitle>
      <div className="px-4 py-4">
        <p className="text-[13px] text-mfneutralsn-300 mb-3 leading-snug">
          Link a sibling so you can see both children in one place.
        </p>
        <button className="flex items-center gap-2 h-9 px-3 rounded-lg border border-mfprimaryp-400 text-[13px] font-medium text-mfprimaryp-400 active:bg-mfprimaryp-50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Link siblings
        </button>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

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
      <span className="text-xs text-mfneutralsn-300">{date}</span>
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

const LeaveDetail = () => {
  const { shouldShowFrame } = useDeviceDetection();
  const [showAbsence, setShowAbsence] = useState(false);
  const overlayPos = shouldShowFrame ? "absolute" : "fixed";

  return (
    <div className="flex flex-col pb-24">
      <div className="px-4 pt-2 pb-3">
        <button
          onClick={() => setShowAbsence(true)}
          className="flex items-center gap-2 h-9 px-3 rounded-lg border border-mfprimaryp-400 text-[14px] font-medium text-mfprimaryp-400 active:bg-mfprimaryp-50"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add leave
        </button>
      </div>

      <SubsectionTitle>Upcoming</SubsectionTitle>
      <SubpageRowDual
        icon={<SunIcon className="w-4 h-4 text-mfyellowy-400" />}
        label="1 - 10 Jul 2026"
      />
      <SubpageRowDual
        icon={<SunIcon className="w-4 h-4 text-mfyellowy-400" />}
        label="22 - 24 Dec 2026"
      />

      <SubsectionTitle>Past</SubsectionTitle>
      <SubpageRowDual
        icon={<ThermometerIcon className="w-4 h-4 text-mfredr-400" />}
        label="4 Mar 2026"
      />
      <SubpageRowDual
        icon={<ThermometerIcon className="w-4 h-4 text-mfredr-400" />}
        label="18 - 19 Feb 2026"
      />
      <SubpageRowDual
        icon={<SunIcon className="w-4 h-4 text-mfyellowy-400" />}
        label="23 Dec 2025 - 2 Jan 2026"
      />

      {showAbsence && (
        <div className={`${overlayPos} inset-0 z-[90]`}>
          <AbsenceOverlay type="sick" onClose={() => setShowAbsence(false)} />
        </div>
      )}
    </div>
  );
};

type PermissionStatus = "yes" | "no" | "pending";

const LATEST_PERMISSIONS: { id: string; label: string; status: PermissionStatus; lastChanged?: string }[] = [
  { id: "photos", label: "Can your child be photographed?", status: "pending" },
  { id: "field-trip", label: "Can go on a field trip", status: "yes", lastChanged: "01/02/2025" },
  { id: "animals", label: "Can play with animals", status: "yes", lastChanged: "06/10/2024" },
];

const PermissionStatusIcon = ({ status }: { status: PermissionStatus }) => {
  if (status === "yes") return <CheckCircle2Icon className="w-5 h-5 text-green-500" />;
  if (status === "no") return <XCircleIcon className="w-5 h-5 text-mfredr-400" />;
  return <HelpCircleIcon className="w-5 h-5 text-mfprimaryp-400" />;
};

const PermissionRow = ({ item }: { item: { label: string; status: PermissionStatus; lastChanged?: string } }) => (
  <div className="px-4 py-3 flex items-start gap-3">
    <div className="pt-0.5 flex-shrink-0">
      <PermissionStatusIcon status={item.status} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-medium text-mfneutralsn-500 leading-tight">{item.label}</p>
      {item.lastChanged ? (
        <p className="text-[14px] text-mfneutralsn-300 mt-1 leading-tight">Last changed {item.lastChanged}</p>
      ) : (
        <p className="text-[14px] text-mfprimaryp-400 mt-1 leading-tight">Needs your response</p>
      )}
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
    <div className="flex flex-col pt-2 pb-24 gap-0 px-2">
      {items.map((item) => {
        const isEditing = editingId === item.id || item.answer === null;
        return (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-3.5 border border-mfprimaryp-100 rounded-xl mb-2 bg-white"
          >
            <PermissionStatusIcon status={item.answer ?? "pending"} />
            <span className="flex-1 text-sm font-medium text-mfneutralsn-500">{item.label}</span>
            {isEditing ? (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setAnswer(item.id, "yes")}
                  className="px-3 py-1 text-xs font-medium rounded-md border border-gray-200 bg-white text-mfneutralsn-500 active:bg-gray-50"
                >
                  Yes
                </button>
                <button
                  onClick={() => setAnswer(item.id, "no")}
                  className="px-3 py-1 text-xs font-medium rounded-md border border-gray-200 bg-white text-mfneutralsn-500 active:bg-gray-50"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingId(item.id)}
                className="px-3 py-1 text-xs font-medium rounded-md border border-gray-200 bg-white text-mfneutralsn-400 active:bg-gray-50 flex-shrink-0"
              >
                Edit
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const OverviewContent = (): JSX.Element => {
  const variant = useProfileVariant();
  const navigate = useNavigate();
  const location = useLocation();
  const [section, setSection] = useState<Section>(null);
  const [editing, setEditing] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const aboutSection = (location.state as { aboutSection?: Section } | null)?.aboutSection;
    if (aboutSection) {
      setSection(aboutSection);
      navigate("/child-profile", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // When entering/leaving a detail section, scroll the surrounding
  // overflow container back to the top and notify ChildProfile so it hides
  // the tabs + child info row while a subpage is open.
  useEffect(() => {
    const scrollable = rootRef.current?.closest(".overflow-y-auto") as HTMLElement | null;
    scrollable?.scrollTo({ top: 0, behavior: "smooth" });
    setEditing(false);
    setChildProfileSubpageActive(section !== null);
  }, [section]);

  // Make sure the global flag is cleared if this view unmounts mid-subpage.
  useEffect(() => () => setChildProfileSubpageActive(false), []);

  if (section !== null) {
    const editable = section === "basic" || section === "family" || section === "health";
    return (
      <div ref={rootRef} className="flex flex-col bg-white min-h-full">
        <SectionHeader
          title={sectionTitles[section]}
          onBack={() => {
            setEditing(false);
            setSection(null);
          }}
          onEdit={editable ? () => setEditing(true) : undefined}
          onSave={() => setEditing(false)}
          onCancel={() => setEditing(false)}
          editActive={editing}
        />
        {section === "care" && <CareDetail />}
        {section === "family" && <FamilyDetail editing={editing} />}
        {section === "basic" && <BasicInfoDetail editing={editing} />}
        {section === "health" && <HealthDetailsDetail editing={editing} />}
        {section === "leave" && <LeaveDetail />}
        {section === "permissions" && <PermissionsDetail />}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="flex flex-col bg-white pt-4 pb-24 gap-4">
      {/* Leave — both variants */}
      <Card>
        <CardHeader title="Leave" onPress={() => setSection("leave")} />
        <Divider />
        <LeaveRow icon={<SunIcon className="w-[18px] h-[18px] text-mfyellowy-400" />} label="1 - 10 Jul 26" sublabel="Holiday · Opted out of meals" trailing="Upcoming" />
        <Divider />
        <LeaveRow icon={<ThermometerIcon className="w-[18px] h-[18px] text-mfredr-400" />} label="4 Mar 26" sublabel="Sick" trailing="Past" />
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader title="Permissions" onPress={() => setSection("permissions")} />
        {LATEST_PERMISSIONS.map((p, i) => (
          <React.Fragment key={p.id}>
            <Divider />
            <PermissionRow item={p} />
          </React.Fragment>
        ))}
      </Card>

      {/* Care — V1 only (V2 has bookings in its own tab) */}
      {variant === "v1" && (
        <Card>
          <CardHeader title="Care" onPress={() => setSection("care")} />
          <Divider />
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-mfneutralsn-500">Monthly full time</p>
            <p className="text-xs text-mfneutralsn-300 mt-0.5">$1,350/month · Aug 31 –</p>
          </div>
          <Divider />
          <BookingRow name="After School Care" date="Mar 7" amount="$50.00" status="pending" />
          <Divider />
          <BookingRow name="After School Care" date="Feb 1" amount="$50.00" status="paid" />
        </Card>
      )}

      {/* Family */}
      <Card>
        <CardHeader title="Family" onPress={() => setSection("family")} />
        <Divider />
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="w-9 h-9 flex-shrink-0">
              <AvatarImage src={MOTHER_AVATAR} alt="Sarah Freedman" />
              <AvatarFallback>SF</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-mfneutralsn-500 truncate">Sarah Freedman</p>
              <p className="text-xs text-mfneutralsn-300 mt-0.5">+1 (555) 123-4567 · Mother</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full border border-mfprimaryp-400 text-mfprimaryp-400 flex-shrink-0">Primary</span>
        </div>
        <Divider />
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="w-9 h-9 flex-shrink-0">
              <AvatarImage src={FATHER_AVATAR} alt="Michael Freedman" />
              <AvatarFallback>MF</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-mfneutralsn-500 truncate">Michael Freedman</p>
              <p className="text-xs text-mfneutralsn-300 mt-0.5">+1 (555) 123-4567 · Father</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full border border-mfneutralsn-200 text-mfneutralsn-400 flex-shrink-0">Secondary</span>
        </div>
      </Card>

      {/* Basic info */}
      <Card>
        <CardHeader title="Basic info" onPress={() => setSection("basic")} />
        <Divider />
        <SummaryRow icon={<CalendarIcon className="w-4 h-4" />} label="1 Feb 2025" />
        <Divider />
        <SummaryRow icon={<BookOpenIcon className="w-4 h-4" />} label="Bunnies room" />
      </Card>

      {/* Health details */}
      <Card>
        <CardHeader title="Health details" onPress={() => setSection("health")} />
        <Divider />
        <SummaryRow icon={<StethoscopeIcon className="w-4 h-4" />} label="Doctor: Phil Cawlins" />
        <Divider />
        <SummaryRow icon={<ShieldAlertIcon className="w-4 h-4" />} label="Allergies: Lactose, Peanuts" />
        <Divider />
        <SummaryRow icon={<StickyNoteIcon className="w-4 h-4" />} label="Tolerates penicillin" />
      </Card>
    </div>
  );
};

const LeaveRow = ({ icon, label, sublabel, trailing }: { icon: React.ReactNode; label: string; sublabel: string; trailing: string }) => (
  <div className="px-4 py-2.5 flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-mfneutralsn-50 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-medium text-mfneutralsn-500 leading-tight">{label}</p>
      <p className="text-[14px] text-mfneutralsn-300 mt-1 leading-tight truncate">{sublabel}</p>
    </div>
    <span className="text-[14px] text-mfneutralsn-300 flex-shrink-0">{trailing}</span>
  </div>
);
