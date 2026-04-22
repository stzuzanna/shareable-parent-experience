import React, { useState } from "react";
import { ChevronRightIcon, ArrowLeftIcon, FileTextIcon } from "lucide-react";

// ── Shared primitives ─────────────────────────────────────────────────────────

const Divider = () => <div className="h-px bg-gray-100 mx-4" />;

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-2 rounded-2xl overflow-hidden border border-gray-100 bg-white">
    {children}
  </div>
);

const CardHeader = ({ title, count, onPress }: { title: string; count?: number; onPress?: () => void }) => (
  <button
    onClick={onPress}
    className="w-full flex items-center justify-between px-4 py-3 text-left"
  >
    <span className="text-sm text-mfneutralsn-300">{title}</span>
    <div className="flex items-center gap-1.5">
      {count !== undefined && <span className="text-sm text-mfneutralsn-300">{count}</span>}
      <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-200" />
    </div>
  </button>
);

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

// ── Badges ────────────────────────────────────────────────────────────────────

const Badge = ({ label, variant }: { label: string; variant: "sign" | "complete" | "answer" | "yes" }) => {
  const styles = {
    sign: "bg-mfyellowy-50 border border-mfyellowy-400 text-mfneutralsn-500",
    complete: "bg-green-50 border border-green-500 text-green-700",
    answer: "bg-mfyellowy-50 border border-mfyellowy-400 text-mfneutralsn-500",
    yes: "bg-green-50 border border-green-500 text-green-700",
  };
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full whitespace-nowrap ${styles[variant]}`}>
      {label}
    </span>
  );
};

// ── Detail item row (matching Figma) ──────────────────────────────────────────

const DetailItem = ({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between px-4 py-3 gap-3 border border-mfprimaryp-100 rounded-xl mx-2 mb-2 bg-white">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <FileTextIcon className="w-4 h-4 text-mfneutralsn-300 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-mfneutralsn-500 truncate">{title}</p>
        {subtitle && <p className="text-xs text-mfneutralsn-300 mt-0.5 truncate">{subtitle}</p>}
      </div>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      {badge}
      <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-200" />
    </div>
  </div>
);

// ── Detail views ──────────────────────────────────────────────────────────────

const FormsDetail = () => (
  <div className="flex flex-col pt-2 pb-24 gap-0">
    <DetailItem
      title="About me form"
      subtitle="Sent by Olivia Wilson · 03/03/2026 4:16 PM"
      badge={<Badge label="Sign" variant="sign" />}
    />
    <DetailItem
      title="Merchandise"
      subtitle="Sent by Olivia Wilson · 03/03/2026 4:16 PM"
      badge={<Badge label="Complete" variant="complete" />}
    />
    <DetailItem
      title="Enrollment form"
      subtitle="Sent by Olivia Wilson · 03/03/2026 4:16 PM"
      badge={<Badge label="Complete" variant="complete" />}
    />
    <DetailItem
      title="Updated care contract"
      subtitle="Sent by Olivia Wilson · 21/02/2026 9:00 AM"
      badge={<Badge label="Complete" variant="complete" />}
    />
  </div>
);

const PermissionsDetail = () => (
  <div className="flex flex-col pt-2 pb-24 gap-0">
    <DetailItem
      title="Can use sunscreen"
      badge={<Badge label="Answer" variant="answer" />}
    />
    <DetailItem
      title="Can be in photos"
      badge={<Badge label="Yes" variant="yes" />}
    />
    <DetailItem
      title="Can go on field trips"
      badge={<Badge label="Yes" variant="yes" />}
    />
    <DetailItem
      title="Can use insect repellent"
      badge={<Badge label="Answer" variant="answer" />}
    />
  </div>
);

const NotesDetail = () => (
  <div className="flex flex-col pt-2 pb-24 gap-2 px-2">
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <p className="text-sm font-medium text-mfneutralsn-500">Tobin has been really active lately...</p>
      <p className="text-xs text-mfneutralsn-300 mt-1">Added by Anna Müller · Feb 21</p>
    </div>
  </div>
);

const ResourcesDetail = () => (
  <div className="flex flex-col items-center justify-center py-16 px-8">
    <p className="text-sm text-mfneutralsn-300 text-center">No resources have been shared yet.</p>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

type Section = "forms" | "permissions" | "notes" | "resources" | null;

const sectionTitles: Record<NonNullable<Section>, string> = {
  forms: "Forms and contracts",
  permissions: "Permissions",
  notes: "Notes",
  resources: "Resources",
};

export const DocumentsContent = (): JSX.Element => {
  const [section, setSection] = useState<Section>(null);

  if (section !== null) {
    return (
      <div className="flex flex-col bg-mfneutralsn-50 min-h-full">
        <SectionHeader title={sectionTitles[section]} onBack={() => setSection(null)} />
        {section === "forms" && <FormsDetail />}
        {section === "permissions" && <PermissionsDetail />}
        {section === "notes" && <NotesDetail />}
        {section === "resources" && <ResourcesDetail />}
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-mfneutralsn-50 pt-4 pb-24 gap-4">
      {/* Notes */}
      <Card>
        <CardHeader title="Notes" count={1} onPress={() => setSection("notes")} />
        <Divider />
        <div className="px-4 py-3">
          <p className="text-sm font-semibold text-mfneutralsn-500">Tobin has been really active lately...</p>
          <p className="text-xs text-mfneutralsn-300 mt-0.5">Feb 21</p>
        </div>
      </Card>

      {/* Forms and contracts */}
      <Card>
        <CardHeader title="Forms and contracts" count={6} onPress={() => setSection("forms")} />
        <Divider />
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-mfneutralsn-500">About me form</p>
            <p className="text-xs text-mfneutralsn-300 mt-0.5">Sent by Olivia Wilson · 03/03/2026</p>
          </div>
          <Badge label="Sign" variant="sign" />
        </div>
        <Divider />
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-mfneutralsn-500">Merchandise</p>
            <p className="text-xs text-mfneutralsn-300 mt-0.5">Sent by Olivia Wilson · 03/03/2026</p>
          </div>
          <Badge label="Complete" variant="complete" />
        </div>
        <Divider />
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-mfneutralsn-500">Enrollment form</p>
            <p className="text-xs text-mfneutralsn-300 mt-0.5">Sent by Olivia Wilson · 21/02/2026</p>
          </div>
          <Badge label="Complete" variant="complete" />
        </div>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader title="Permissions" count={6} onPress={() => setSection("permissions")} />
        <Divider />
        <div className="px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-mfneutralsn-500">Can use sunscreen</p>
          <Badge label="Answer" variant="answer" />
        </div>
        <Divider />
        <div className="px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-mfneutralsn-500">Can be in photos</p>
          <Badge label="Yes" variant="yes" />
        </div>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader title="Resources" count={0} onPress={() => setSection("resources")} />
      </Card>
    </div>
  );
};
