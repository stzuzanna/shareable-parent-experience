import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRightIcon, ArrowLeftIcon, SunIcon, ThermometerIcon, StethoscopeIcon, CheckCircle2Icon, XCircleIcon, HelpCircleIcon, PlusIcon, LockIcon, LanguagesIcon, HeartIcon, MapPinIcon, AlertTriangleIcon, MailIcon, PhoneIcon, FileTextIcon, IdCardIcon, InfoIcon } from "lucide-react";
import { useProfileVariant } from "../../../../hooks/useProfileVariant";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import { setChildProfileSubpageActive } from "../../../../hooks/useChildProfileSubpage";
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

// ── Child-pro style primitives ────────────────────────────────────────────────

// Flat section separated by a bottom border, with title + optional description + View all
const Section = ({
  title,
  description,
  onViewAll,
  children,
}: {
  title: string;
  description?: string;
  onViewAll?: () => void;
  children: React.ReactNode;
}) => (
  <div className="px-4 py-4 border-b border-[#f1f1f4] flex flex-col gap-3">
    <div>
      <p className="text-[14px] font-semibold text-mfneutralsn-500">{title}</p>
      {description && <p className="text-[13px] text-mfneutralsn-300 mt-0.5">{description}</p>}
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

// Contact summary card: bordered, tappable, with avatar + name + relation + pill
const ContactSummaryCard = ({
  avatarSrc,
  fallback,
  name,
  relation,
  info,
  pill,
  onClick,
}: {
  avatarSrc: string;
  fallback: string;
  name: string;
  relation: string;
  info?: string;
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
        {relation}{info ? ` · ${info}` : ""}
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

// Clickable row for subpages: label / value / chevron → opens EditFieldSheet
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

// ── Detail view: Basic info ───────────────────────────────────────────────────

type OptionalKey = "nationality" | "birthplace" | "specialNotes" | "sensitiveInfo";
const OPTIONAL_LABELS: Record<OptionalKey, string> = {
  nationality: "Nationality",
  birthplace: "Birthplace",
  specialNotes: "Special notes",
  sensitiveInfo: "Sensitive info",
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
  { id: "sarah", name: "Sarah Freedman", role: "Mother", avatar: MOTHER_AVATAR, fallback: "SF", primary: true },
  { id: "michael", name: "Michael Freedman", role: "Father", avatar: FATHER_AVATAR, fallback: "MF", primary: false },
];

type ContactExtras = { email?: string; phone?: string };

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
    <div className="px-4 pt-4 pb-1 border-b border-mfneutralsn-75 last:border-b-0 flex flex-col gap-2">
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
      <div className="-mx-4">
        <EditableRow
          icon={<MailIcon className="w-4 h-4" />}
          label="Email"
          value={extras.email ?? ""}
          placeholder="Add email"
          onPress={() =>
            openEdit({
              title: `${contact.name} — Email`,
              subtitle: `Email address we can reach ${contact.role.toLowerCase()} on.`,
              type: "text",
              value: extras.email ?? "",
              placeholder: "name@example.com",
              key: { section: "family", field: `${contact.id}:email` },
            })
          }
        />
        <EditableRow
          icon={<PhoneIcon className="w-4 h-4" />}
          label="Phone number"
          value={extras.phone ?? ""}
          placeholder="Add phone"
          onPress={() =>
            openEdit({
              title: `${contact.name} — Phone`,
              subtitle: `Phone number we can reach ${contact.role.toLowerCase()} on.`,
              type: "text",
              value: extras.phone ?? "",
              placeholder: "+1 (555) 123-4567",
              key: { section: "family", field: `${contact.id}:phone` },
            })
          }
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
  <div className="flex flex-col pb-24">
    <SubsectionTitle>Parents</SubsectionTitle>
    {CONTACTS.map((c) => (
      <ContactCard
        key={c.id}
        contact={c}
        extras={extras[c.id] ?? {}}
        openEdit={openEdit}
      />
    ))}

    <SubsectionTitle>Siblings</SubsectionTitle>
    <div className="px-4 py-4">
      <p className="text-[14px] text-mfneutralsn-300 mb-3 leading-snug">
        Link a sibling so you can see both children in one place.
      </p>
      <button className="flex items-center gap-2 h-9 px-3 rounded-lg border border-mfprimaryp-400 text-[14px] font-medium text-mfprimaryp-400 active:bg-mfprimaryp-50">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Link siblings
      </button>
    </div>
  </div>
);

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
    <div className="flex flex-col pb-24">
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
    </div>
);

type PermissionStatus = "yes" | "no" | "pending";

const LATEST_PERMISSIONS: { id: string; label: string; status: PermissionStatus; lastChanged?: string; changedBy?: string }[] = [
  { id: "photos", label: "Can be in photos", status: "yes", lastChanged: "05/25/2026", changedBy: "Sofia Adams Growth" },
  { id: "animals", label: "Can play with animals", status: "no", lastChanged: "05/25/2026", changedBy: "Sofia Adams Growth" },
];

const PermissionStatusIcon = ({ status }: { status: PermissionStatus }) => {
  if (status === "yes") return <CheckCircle2Icon className="w-5 h-5 text-green-500" />;
  if (status === "no") return <XCircleIcon className="w-5 h-5 text-mfredr-400" />;
  return <HelpCircleIcon className="w-5 h-5 text-mfprimaryp-400" />;
};

const PermissionRow = ({
  item,
}: {
  item: { label: string; status: PermissionStatus; lastChanged?: string; changedBy?: string };
}) => (
  <div className="px-4 py-3 flex items-start gap-3">
    <div className="pt-0.5 flex-shrink-0">
      <PermissionStatusIcon status={item.status} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-medium text-mfneutralsn-500 leading-tight">{item.label}</p>
      {item.lastChanged ? (
        <p className="text-[14px] text-mfneutralsn-300 mt-1 leading-tight">
          Last changed{item.changedBy ? ` by ${item.changedBy}` : ""} on {item.lastChanged}
        </p>
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
    </div>
  );
};

export const OverviewContent = (): JSX.Element => {
  const variant = useProfileVariant();
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();
  const location = useLocation();
  const [section, setSection] = useState<Section>(null);
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

  // When entering/leaving a detail section, notify ChildProfile (so it hides
  // the tabs + child info row while a subpage is open) and then scroll the
  // surrounding overflow container to the top. The scroll runs in a
  // requestAnimationFrame so the parent has actually re-rendered with the
  // hidden tabs by the time we set scrollTop — otherwise the scroll lands at
  // the old scroll offset and the user sees the middle of the subpage.
  useEffect(() => {
    setShowLeaveSheet(false);
    setChildProfileSubpageActive(section !== null);
    const handle = requestAnimationFrame(() => {
      const scrollable = rootRef.current?.closest(".overflow-y-auto") as HTMLElement | null;
      if (scrollable) scrollable.scrollTop = 0;
    });
    return () => cancelAnimationFrame(handle);
  }, [section]);

  // Make sure the global flag is cleared if this view unmounts mid-subpage.
  useEffect(() => () => setChildProfileSubpageActive(false), []);

  if (section !== null) {
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

  return (
    <div ref={rootRef} className="flex flex-col bg-white pb-24">
      {/* Family */}
      <Section title="Family" description="2 contacts" onViewAll={() => setSection("family")}>
        <ContactSummaryCard
          avatarSrc={MOTHER_AVATAR}
          fallback="SF"
          name="Sarah Freedman"
          relation="Mother"
          info={familyExtras.sarah?.phone}
          pill="Primary"
          onClick={() => setSection("family")}
        />
        <ContactSummaryCard
          avatarSrc={FATHER_AVATAR}
          fallback="MF"
          name="Michael Freedman"
          relation="Father"
          info={familyExtras.michael?.phone}
          pill="Secondary"
          onClick={() => setSection("family")}
        />
      </Section>

      {/* Basic info */}
      <Section title="Basic info" description="Personal details" onViewAll={() => setSection("basic")}>
        <InfoRow
          label="Date of birth"
          value={`${formatHumanDate(basicInfo.dateOfBirth) || "1 Feb 2025"} (1 year 4 months)`}
        />
        <InfoRow
          label="Languages"
          value={basicInfo.languages.length ? basicInfo.languages.join(", ") : undefined}
          onAdd={() =>
            openEdit({
              title: "Languages",
              subtitle: "Languages spoken at home.",
              type: "select-multiple",
              value: basicInfo.languages.join(", "),
              options: LANGUAGE_OPTIONS_ARR,
              key: { section: "basic", field: "languages" },
            })
          }
        />
        <InfoRow
          label="Gender"
          value={basicInfo.gender || undefined}
          onAdd={() =>
            openEdit({
              title: "Gender",
              type: "text",
              value: basicInfo.gender,
              key: { section: "basic", field: "gender" },
            })
          }
        />
        <InfoRow
          label="Allergy"
          value={basicInfo.allergy || undefined}
          onAdd={() =>
            openEdit({
              title: "Allergy info",
              subtitle: "List any allergies the centre should know about.",
              type: "text",
              value: basicInfo.allergy,
              placeholder: "Comma separated",
              key: { section: "basic", field: "allergy" },
            })
          }
        />
      </Section>

      {/* Health details */}
      <Section title="Health details" onViewAll={() => setSection("health")}>
        <InfoRow
          label="Doctor"
          value={health.doctorName || undefined}
          onAdd={() =>
            openEdit({
              title: "Doctor name",
              type: "text",
              value: health.doctorName,
              key: { section: "health", field: "doctorName" },
            })
          }
        />
        <InfoRow
          label="Tolerates penicillin"
          value={health.toleratesPenicillin || undefined}
        />
        <InfoRow
          label="Special notes"
          value={health.specialNotes || undefined}
          onAdd={() =>
            openEdit({
              title: "Special notes",
              type: "text",
              value: health.specialNotes,
              key: { section: "health", field: "specialNotes" },
            })
          }
        />
      </Section>

      {/* Permissions */}
      <Section title="Permissions" onViewAll={() => setSection("permissions")}>
        {LATEST_PERMISSIONS.map((p) => (
          <PermissionRow key={p.id} item={p} />
        ))}
      </Section>

      {/* Leave */}
      <Section title="Leave" onViewAll={() => setSection("leave")}>
        <LeaveRow
          icon={<SunIcon className="w-[18px] h-[18px] text-mfyellowy-400" />}
          label="1 - 10 Jul 26"
          sublabel="Holiday · Opted out of meals"
          trailing="Upcoming"
        />
        <LeaveRow
          icon={<ThermometerIcon className="w-[18px] h-[18px] text-mfredr-400" />}
          label="4 Mar 26"
          sublabel="Sick"
          trailing="Past"
        />
      </Section>

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
