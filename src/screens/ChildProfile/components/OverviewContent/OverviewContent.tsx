import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRightIcon, ArrowLeftIcon, HomeIcon, PhoneIcon, InfoIcon, CalendarIcon, BookOpenIcon, SunIcon, ThermometerIcon, MessageSquareIcon, PencilIcon, KeyRoundIcon, UserIcon, StethoscopeIcon, ShieldAlertIcon, StickyNoteIcon, IdCardIcon, CheckCircle2Icon, XCircleIcon, HelpCircleIcon } from "lucide-react";
import { useProfileVariant } from "../../../../hooks/useProfileVariant";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";

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
    <p className="text-[12px] text-mfneutralsn-300 mt-1 leading-tight">{sublabel}</p>
  </div>
);

const SectionHeader = ({ title, onBack, onEdit }: { title: string; onBack: () => void; onEdit?: () => void }) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <button
      onClick={onBack}
      className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0"
    >
      <ArrowLeftIcon className="w-4 h-4 text-mfneutralsn-500" />
    </button>
    <span className="text-base font-semibold text-mfneutralsn-500 flex-1">{title}</span>
    {onEdit && (
      <button
        onClick={onEdit}
        aria-label={`Edit ${title}`}
        className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0 active:bg-gray-50"
      >
        <PencilIcon className="w-4 h-4 text-mfneutralsn-500" />
      </button>
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
    <ChevronRightIcon className="w-[18px] h-[18px] text-mfneutralsn-400 opacity-80 flex-shrink-0" />
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
    <div className="flex items-center gap-2 flex-shrink-0">
      {badge}
      <ChevronRightIcon className="w-[18px] h-[18px] text-mfneutralsn-400 opacity-80" />
    </div>
  </button>
);

const SubsectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="px-4 pt-5 pb-3 text-[16px] font-medium text-mfneutralsn-400">{children}</p>
);

const ChildcareDetail = () => (
  <div className="flex flex-col pb-24">
    <SubsectionTitle>Centre</SubsectionTitle>
    <SubpagePersonRow
      avatarSrc={KEY_PERSON_AVATAR}
      avatarAlt={KEY_PERSON_NAME}
      fallback={KEY_PERSON_INITIALS}
      label={`Key person: ${KEY_PERSON_NAME}`}
    />
    <SubpageRow icon={<HomeIcon className="w-4 h-4" />} label="11 NW Street NY" />
    <SubpageRow icon={<PhoneIcon className="w-4 h-4" />} label="+1 (245) 464-6464" />
    <SubpageRow icon={<InfoIcon className="w-4 h-4" />} label="Gate code: 1243" />
  </div>
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

const FamilyDetail = () => (
  <div className="flex flex-col pb-24">
    <SubsectionTitle>Parents</SubsectionTitle>
    <SubpagePersonRow
      avatarSrc={MOTHER_AVATAR}
      avatarAlt="Sarah Freedman"
      fallback="SF"
      label="Sarah Freedman · Mother"
      badge={<PrimaryBadge />}
    />
    <SubpagePersonRow
      avatarSrc={FATHER_AVATAR}
      avatarAlt="Michael Freedman"
      fallback="MF"
      label="Michael Freedman · Father"
      badge={<SecondaryBadge />}
    />
  </div>
);

const BasicInfoDetail = () => (
  <div className="flex flex-col pb-24">
    <SubsectionTitle>Basics</SubsectionTitle>
    <SubpageRow icon={<IdCardIcon className="w-4 h-4" />} label="Amanda Freedman" />
    <SubpageRow icon={<CalendarIcon className="w-4 h-4" />} label="1 Feb 2025 (1 year 4 months)" />
    <SubpageRow icon={<BookOpenIcon className="w-4 h-4" />} label="Bunnies room" />
    <SubpageRow icon={<KeyRoundIcon className="w-4 h-4" />} label={`Key person: ${KEY_PERSON_NAME}`} />

    <SubsectionTitle>Health &amp; sensitive info</SubsectionTitle>
    <SubpageRow icon={<StethoscopeIcon className="w-4 h-4" />} label="Doctor: Phil Cawlins" />
    <SubpageRow icon={<ShieldAlertIcon className="w-4 h-4" />} label="Allergies: Lactose, Peanuts" />
    <SubpageRow icon={<StickyNoteIcon className="w-4 h-4" />} label="Tolerates penicillin" />
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

type Section = "childcare" | "care" | "family" | "basic" | "leave" | "closures" | null;

const sectionTitles: Record<NonNullable<Section>, string> = {
  childcare: "Childcare info",
  care: "Care",
  family: "Family",
  basic: "Basic info",
  leave: "Leave",
  closures: "Meadows closure days",
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
        <p className="text-[12px] text-mfneutralsn-300 mt-1 leading-tight">Last changed {item.lastChanged}</p>
      ) : (
        <p className="text-[12px] text-mfprimaryp-400 mt-1 leading-tight">Needs your response</p>
      )}
    </div>
  </div>
);

export const OverviewContent = (): JSX.Element => {
  const variant = useProfileVariant();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // When entering/leaving a detail section, scroll the surrounding
  // overflow container back to the top so the child profile header stays visible.
  useEffect(() => {
    const scrollable = rootRef.current?.closest(".overflow-y-auto") as HTMLElement | null;
    scrollable?.scrollTo({ top: 0, behavior: "smooth" });
  }, [section]);

  if (section !== null) {
    const editable = section === "basic" || section === "family";
    return (
      <div ref={rootRef} className="flex flex-col bg-white min-h-full">
        <SectionHeader
          title={sectionTitles[section]}
          onBack={() => setSection(null)}
          onEdit={editable ? () => {} : undefined}
        />
        {section === "childcare" && <ChildcareDetail />}
        {section === "care" && <CareDetail />}
        {section === "family" && <FamilyDetail />}
        {section === "basic" && <BasicInfoDetail />}
        {section === "leave" && (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <p className="text-sm text-mfneutralsn-300 text-center">Detailed leave view coming soon.</p>
          </div>
        )}
        {section === "closures" && (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <p className="text-sm text-mfneutralsn-300 text-center">Detailed closure days view coming soon.</p>
          </div>
        )}
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

      {/* Childcare info */}
      <Card>
        <CardHeader title="Childcare info" onPress={() => setSection("childcare")} />
        <Divider />
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="w-9 h-9 flex-shrink-0">
              <AvatarImage src={KEY_PERSON_AVATAR} alt={KEY_PERSON_NAME} />
              <AvatarFallback>{KEY_PERSON_INITIALS}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-mfneutralsn-500 truncate">{KEY_PERSON_NAME}</p>
              <p className="text-xs text-mfneutralsn-300 mt-0.5">Key person</p>
            </div>
          </div>
          <button
            aria-label={`Message ${KEY_PERSON_NAME}`}
            onClick={() => navigate(`/messages/chat/${KEY_PERSON_CHAT_ID}`)}
            className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0 active:bg-gray-50"
          >
            <MessageSquareIcon className="w-4 h-4 text-mfneutralsn-400" />
          </button>
        </div>
        <Divider />
        <InfoRow label="11 NW Street NY" sublabel="Address" />
        <Divider />
        <InfoRow label="+12454646464" sublabel="Phone number" />
        <Divider />
        <InfoRow label="Gate code 1243" sublabel="About" />
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader title="Permissions" onPress={() => navigate("/child-profile/about/permissions")} />
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

      {/* Meadows closure days — both variants */}
      <Card>
        <CardHeader title="Meadows closure days" onPress={() => setSection("closures")} />
        <Divider />
        <InfoRow label="14 May 26" sublabel="Ascension Day" />
        <Divider />
        <InfoRow label="14 Jun - 14 Jul" sublabel="Summer holidays" />
        <Divider />
        <InfoRow label="14 Jul" sublabel="Independence Day" />
      </Card>

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
        <InfoRow label="1 Feb 2025" sublabel="Date of birth" />
        <Divider />
        <InfoRow label="4 Mar 2026" sublabel="Upcoming room move" />
        <Divider />
        <InfoRow label="English, Spanish" sublabel="Language" />
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
      <p className="text-[12px] text-mfneutralsn-300 mt-1 leading-tight truncate">{sublabel}</p>
    </div>
    <span className="text-[12px] text-mfneutralsn-300 flex-shrink-0">{trailing}</span>
  </div>
);
