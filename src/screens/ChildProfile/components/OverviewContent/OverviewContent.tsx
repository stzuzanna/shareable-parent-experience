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

// ── Shared primitives ─────────────────────────────────────────────────────────

// Flat section wrapper (no rounded border) — sections are separated by a thin
// horizontal line below each card, per Figma 1436-21679.
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white border-b border-mfneutralsn-75">
    {children}
  </div>
);

const CardHeader = ({ title, onPress }: { title: string; onPress?: () => void }) => (
  <button onClick={onPress} className="w-full flex items-center justify-between px-4 pt-3 pb-2 text-left">
    <span className="text-[14px] text-mfneutralsn-300">{title}</span>
    <ChevronRightIcon className="w-5 h-5 text-mfneutralsn-200" />
  </button>
);

// About card header: just the section title — editing happens in the subpage
// reachable via "View all".
const SectionCardHeader = ({ title }: { title: string }) => (
  <div className="w-full flex items-center px-4 pt-4 pb-2">
    <span className="text-[16px] font-semibold text-mfneutralsn-500">{title}</span>
  </div>
);

const ViewAllLink = ({ onPress }: { onPress: () => void }) => (
  <button
    onClick={onPress}
    className="w-full text-left px-4 py-3 text-[14px] font-medium text-mfprimaryp-400 flex items-center gap-1"
  >
    View all
    <ChevronRightIcon className="w-4 h-4" />
  </button>
);

// Compact preview row used in the About → Family card.
const FamilyPreviewRow = ({
  avatar,
  fallback,
  name,
  role,
  email,
  phone,
}: {
  avatar: string;
  fallback: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
}) => (
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
    <div ref={rootRef} className="flex flex-col bg-white pt-4 pb-24 gap-4">
      {/* Permissions */}
      <Card>
        <SectionCardHeader title="Permissions" />
        {LATEST_PERMISSIONS.map((p) => (
          <PermissionRow key={p.id} item={p} />
        ))}
        <ViewAllLink onPress={() => setSection("permissions")} />
      </Card>

      {/* Basic info */}
      <Card>
        <SectionCardHeader title="Basic info" />
        <SummaryRow
          icon={<LockIcon className="w-4 h-4" />}
          label={`${formatHumanDate(basicInfo.dateOfBirth) || "1 Feb 2025"} (1 year 4 months)`}
        />
        <SummaryRow
          icon={<LanguagesIcon className="w-4 h-4" />}
          label={basicInfo.languages.join(", ") || "Add languages"}
        />
        {/* "Add allergy info" CTA is always shown so it can be tapped directly
            from the About tab even when one or more allergies are already set. */}
        <button
          onClick={() =>
            openEdit({
              title: "Allergy info",
              subtitle: "List any allergies the centre should know about.",
              type: "text",
              value: basicInfo.allergy,
              placeholder: "Comma separated",
              key: { section: "basic", field: "allergy" },
            })
          }
          className="w-full flex h-12 items-center gap-3 px-4 active:bg-gray-50"
        >
          <div className="w-6 h-6 rounded-md bg-mfneutralsn-75 flex items-center justify-center flex-shrink-0 text-mfprimaryp-400">
            <PlusIcon className="w-4 h-4" />
          </div>
          <p className="text-[14px] text-mfprimaryp-400 truncate">Add allergy info</p>
        </button>
        {basicInfo.allergy && (
          <div className="flex h-12 items-center gap-3 px-4">
            <div className="w-6 h-6 rounded-md bg-mfyellowy-50 flex items-center justify-center flex-shrink-0 text-mfyellowy-400">
              <AlertTriangleIcon className="w-4 h-4" />
            </div>
            <p className="text-[14px] text-mfneutralsn-500 truncate">{basicInfo.allergy}</p>
          </div>
        )}
        <div className="flex h-12 items-center gap-3 px-4">
          <div className="w-6 h-6 rounded-md bg-brandblueb-50 flex items-center justify-center flex-shrink-0 text-brandblueb-400">
            <HeartIcon className="w-4 h-4" />
          </div>
          <p className="text-[14px] text-mfneutralsn-500 flex-1 truncate">Diabetes</p>
          <FileTextIcon className="w-4 h-4 text-mfneutralsn-300 flex-shrink-0" />
        </div>
        <ViewAllLink onPress={() => setSection("basic")} />
      </Card>

      {/* Family */}
      <Card>
        <SectionCardHeader title="Family" />
        <FamilyPreviewRow
          avatar={MOTHER_AVATAR}
          fallback="SF"
          name="Sarah Freedman"
          role="Mother (Primary)"
          email={familyExtras.sarah?.email}
          phone={familyExtras.sarah?.phone}
        />
        <FamilyPreviewRow
          avatar={FATHER_AVATAR}
          fallback="MF"
          name="Michael Freedman"
          role="Father"
          email={familyExtras.michael?.email}
          phone={familyExtras.michael?.phone}
        />
        <ViewAllLink onPress={() => setSection("family")} />
      </Card>

      {/* Health details */}
      <Card>
        <SectionCardHeader title="Health details" />
        <SummaryRow
          icon={<StethoscopeIcon className="w-4 h-4" />}
          label={health.doctorName || "Add doctor info"}
        />
        <SummaryRow
          icon={<MapPinIcon className="w-4 h-4" />}
          label={health.doctorAddress ? health.doctorAddress.split("\n")[0] : "Add address"}
        />
        <ViewAllLink onPress={() => setSection("health")} />
      </Card>

      {/* Leave — kept available below the Figma-spec sections so the existing flow stays reachable */}
      <Card>
        <CardHeader title="Leave" onPress={() => setSection("leave")} />
        <LeaveRow icon={<SunIcon className="w-[18px] h-[18px] text-mfyellowy-400" />} label="1 - 10 Jul 26" sublabel="Holiday · Opted out of meals" trailing="Upcoming" />
        <LeaveRow icon={<ThermometerIcon className="w-[18px] h-[18px] text-mfredr-400" />} label="4 Mar 26" sublabel="Sick" trailing="Past" />
      </Card>

      {/* Care — V1 only (V2 has bookings in its own tab) */}
      {variant === "v1" && (
        <Card>
          <CardHeader title="Care" onPress={() => setSection("care")} />
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-mfneutralsn-500">Monthly full time</p>
            <p className="text-[14px] text-mfneutralsn-300 mt-0.5">$1,350/month · Aug 31 –</p>
          </div>
          <Divider />
          <BookingRow name="After School Care" date="Mar 7" amount="$50.00" status="pending" />
          <BookingRow name="After School Care" date="Feb 1" amount="$50.00" status="paid" />
        </Card>
      )}

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
