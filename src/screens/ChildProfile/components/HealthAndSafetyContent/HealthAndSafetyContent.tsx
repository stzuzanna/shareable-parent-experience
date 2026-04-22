import React, { useState } from "react";
import { ChevronRightIcon, ArrowLeftIcon, UserIcon, ShieldAlertIcon, PillIcon, SyringeIcon } from "lucide-react";

// ── Shared primitives ─────────────────────────────────────────────────────────

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-2 rounded-2xl overflow-hidden border border-gray-100 bg-white">
    {children}
  </div>
);

const CardHeader = ({ title, count, onPress }: { title: string; count?: number; onPress?: () => void }) => (
  <button onClick={onPress} className="w-full flex items-center justify-between px-4 py-3 text-left">
    <span className="text-sm text-mfneutralsn-300">{title}</span>
    <div className="flex items-center gap-1.5">
      {count !== undefined && <span className="text-sm text-mfneutralsn-300">{count}</span>}
      <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-200" />
    </div>
  </button>
);

const Divider = () => <div className="h-px bg-gray-100 mx-4" />;

const SectionHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <button
      onClick={onBack}
      className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0"
    >
      <ArrowLeftIcon className="w-4 h-4 text-mfneutralsn-500" />
    </button>
    <span className="text-base font-semibold text-mfneutralsn-500">{title}</span>
  </div>
);

// ── Detail row ────────────────────────────────────────────────────────────────

const DetailRow = ({
  icon,
  label,
  sublabel,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  badge?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between px-4 py-3 border border-mfprimaryp-100 rounded-xl mx-2 mb-2 bg-white">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className="w-8 h-8 rounded-full bg-mfprimaryp-100 flex items-center justify-center text-mfprimaryp-400 flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-mfneutralsn-500">{label}</p>
        {sublabel && <p className="text-xs text-mfneutralsn-300 mt-0.5">{sublabel}</p>}
      </div>
    </div>
    {badge && <div className="flex-shrink-0 ml-2">{badge}</div>}
  </div>
);

const Badge = ({ label, variant }: { label: string; variant: "orange" | "green" }) => (
  <span className={`text-xs px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
    variant === "orange"
      ? "bg-orange-50 border-orange-400 text-orange-600"
      : "bg-green-50 border-green-500 text-green-700"
  }`}>
    {label}
  </span>
);

// ── Detail views ──────────────────────────────────────────────────────────────

const HealthInfoDetail = () => (
  <div className="flex flex-col pt-2 pb-24">
    <DetailRow icon={<UserIcon className="w-4 h-4" />} label="Phil Cawlins" sublabel="+1 (555) 123-4567 · Doctor" />
    <DetailRow icon={<ShieldAlertIcon className="w-4 h-4" />} label="Lactose, Peanuts" sublabel="Allergies" />
    <DetailRow icon={<ShieldAlertIcon className="w-4 h-4" />} label="Tolerates penicillin" sublabel="Additional notes" />
  </div>
);

const MedicationDetail = () => (
  <div className="flex flex-col pt-2 pb-24">
    <DetailRow
      icon={<PillIcon className="w-4 h-4" />}
      label="Panodil"
      sublabel="Flu · Daily"
      badge={<Badge label="Sign" variant="orange" />}
    />
    <DetailRow
      icon={<PillIcon className="w-4 h-4" />}
      label="Zyrtec"
      sublabel="Pollen allergy · Daily"
      badge={<Badge label="Active" variant="green" />}
    />
  </div>
);

const ImmunizationDetail = () => (
  <div className="flex flex-col pt-2 pb-24">
    <DetailRow icon={<SyringeIcon className="w-4 h-4" />} label="DTaP" sublabel="Mar 2, 2026" />
    <DetailRow icon={<SyringeIcon className="w-4 h-4" />} label="Hepatitis B" sublabel="Mar 2, 2026" />
  </div>
);

const AccidentsDetail = () => (
  <div className="flex flex-col items-center justify-center py-16 px-8">
    <p className="text-sm text-mfneutralsn-300 text-center">No accident reports on record.</p>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

type Section = "health" | "accidents" | "medication" | "immunization" | null;

const sectionTitles: Record<NonNullable<Section>, string> = {
  health: "Health info",
  accidents: "Accident reports",
  medication: "Medication",
  immunization: "Immunization records",
};

const medications = [
  { name: "Panodil", detail: "Flu · Daily", badge: "Sign", badgeStyle: "border border-mforangeo-400 text-mforangeo-400" },
  { name: "Zyrtec", detail: "Pollen allergy · Daily", badge: "Active", badgeStyle: "border border-green-500 text-green-600" },
];

const immunizations = [
  { name: "DTaP", date: "Mar 2 2026" },
  { name: "Hepatitis B", date: "Mar 2 2026" },
];

export const HealthAndSafetyContent = (): JSX.Element => {
  const [section, setSection] = useState<Section>(null);

  if (section !== null) {
    return (
      <div className="flex flex-col bg-mfneutralsn-50 min-h-full">
        <SectionHeader title={sectionTitles[section]} onBack={() => setSection(null)} />
        {section === "health" && <HealthInfoDetail />}
        {section === "accidents" && <AccidentsDetail />}
        {section === "medication" && <MedicationDetail />}
        {section === "immunization" && <ImmunizationDetail />}
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-mfneutralsn-50 pb-24 gap-4">
      {/* Health info */}
      <Card>
        <CardHeader title="Health info" onPress={() => setSection("health")} />
        <Divider />
        <div className="px-4 py-3 flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold text-mfneutralsn-500">Phil Cawlins</p>
            <p className="text-xs text-mfneutralsn-300 mt-0.5">+1 (555) 123-4567 · Doctor</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-mfneutralsn-500">Lactose, Peanuts</p>
            <p className="text-xs text-mfneutralsn-300 mt-0.5">Allergies</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-mfneutralsn-500">Tolerates penicillin</p>
          </div>
        </div>
      </Card>

      {/* Accident reports */}
      <Card>
        <CardHeader title="Accident reports" count={0} onPress={() => setSection("accidents")} />
      </Card>

      {/* Medication */}
      <Card>
        <CardHeader title="Medication" count={4} onPress={() => setSection("medication")} />
        {medications.map((med, i) => (
          <React.Fragment key={med.name}>
            <Divider />
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-mfneutralsn-500">{med.name}</p>
                <p className="text-xs text-mfneutralsn-300 mt-0.5">{med.detail}</p>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full ${med.badgeStyle}`}>{med.badge}</span>
            </div>
          </React.Fragment>
        ))}
      </Card>

      {/* Immunization records */}
      <Card>
        <CardHeader title="Immunization records" count={2} onPress={() => setSection("immunization")} />
        {immunizations.map((imm) => (
          <React.Fragment key={imm.name}>
            <Divider />
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-mfneutralsn-500">{imm.name}</p>
                <p className="text-xs text-mfneutralsn-300 mt-0.5">{imm.date}</p>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-200" />
            </div>
          </React.Fragment>
        ))}
      </Card>
    </div>
  );
};
