import React, { useEffect, useRef, useState } from "react";
import { ChevronRightIcon, ArrowLeftIcon, FileTextIcon, CheckCircle2Icon, XCircleIcon, HelpCircleIcon } from "lucide-react";
import { setChildProfileSubpageActive } from "../../../../hooks/useChildProfileSubpage";
import { DocumentPreviewPage } from "../DocumentPreviewPage/DocumentPreviewPage";
import { ContractDetailPage } from "../ContractDetailPage/ContractDetailPage";
import { BASE_PATH } from "../../../../constants";

// ── Shared primitives ─────────────────────────────────────────────────────────

const Divider = () => <div className="h-px bg-mfneutralsn-75 mx-4" />;

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-[8.5px] rounded-2xl overflow-hidden border border-mfneutralsn-75 bg-white">
    {children}
  </div>
);

const CardHeader = ({ title, count, onPress }: { title: string; count?: number; onPress?: () => void }) => (
  <button
    onClick={onPress}
    className="w-full flex items-center justify-between px-4 pt-3 pb-2 text-left"
  >
    <span className="text-[14px] text-mfneutralsn-300">{title}</span>
    <div className="flex items-center gap-1.5">
      {count !== undefined && <span className="text-[14px] text-mfneutralsn-300">{count}</span>}
      <ChevronRightIcon className="w-5 h-5 text-mfneutralsn-200" />
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
    <span className={`text-[14px] px-2.5 py-0.5 rounded-full whitespace-nowrap ${styles[variant]}`}>
      {label}
    </span>
  );
};

interface DocumentItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: { label: string; variant: "sign" | "complete" | "answer" | "yes" };
  bodyText?: string;
}

const NOTE_ITEMS: DocumentItem[] = [
  {
    id: "note-active",
    title: "Abby has been really active lately",
    subtitle: "Added by Anna Müller · 21 Feb 2026",
    bodyText:
      "Abby has been really active lately at nursery. She's been joining in with group activities, especially outdoor play and story time. We're seeing more confidence when she tries new things with her friends.\n\nWe'll keep you posted on how she settles over the next few weeks.",
  },
];

const FORM_DOCUMENTS: DocumentItem[] = [
  {
    id: "about-me",
    title: "About me form",
    subtitle: "Sent by Olivia Wilson · 03/03/2026 4:16 PM",
    badge: { label: "Sign", variant: "sign" },
  },
  {
    id: "merchandise",
    title: "Merchandise",
    subtitle: "Sent by Olivia Wilson · 03/03/2026 4:16 PM",
    badge: { label: "Complete", variant: "complete" },
  },
  {
    id: "enrollment",
    title: "Enrollment form",
    subtitle: "Sent by Olivia Wilson · 03/03/2026 4:16 PM",
    badge: { label: "Complete", variant: "complete" },
  },
  {
    id: "care-contract",
    title: "Updated care contract",
    subtitle: "Sent by Olivia Wilson · 21/02/2026 9:00 AM",
    badge: { label: "Complete", variant: "complete" },
  },
];

const DocumentBadge = ({ badge }: { badge: DocumentItem["badge"] }) =>
  badge ? <Badge label={badge.label} variant={badge.variant} /> : null;

// ── Detail item row (matching Figma) ──────────────────────────────────────────

const DetailItem = ({ doc, onOpen }: { doc: DocumentItem; onOpen: (doc: DocumentItem) => void }) => (
  <button
    type="button"
    onClick={() => onOpen(doc)}
    className="w-full flex items-center justify-between px-4 py-3 gap-3 border border-mfprimaryp-100 rounded-xl mx-2 mb-2 bg-white text-left active:bg-gray-50"
  >
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <FileTextIcon className="w-4 h-4 text-mfneutralsn-300 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-mfneutralsn-500 truncate">{doc.title}</p>
        <p className="text-[14px] text-mfneutralsn-300 mt-1 leading-tight truncate">{doc.subtitle}</p>
      </div>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      <DocumentBadge badge={doc.badge} />
      <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-200" />
    </div>
  </button>
);

const FormDocumentRow = ({
  doc,
  onOpen,
  showDivider,
}: {
  doc: DocumentItem;
  onOpen: (doc: DocumentItem) => void;
  showDivider?: boolean;
}) => (
  <>
    <button
      type="button"
      onClick={() => onOpen(doc)}
      className="w-full px-4 py-3 flex items-center justify-between text-left active:bg-gray-50"
    >
      <div>
        <p className="text-[14px] font-medium text-mfneutralsn-500 leading-tight">{doc.title}</p>
        <p className="text-[14px] text-mfneutralsn-300 mt-1 leading-tight">{doc.subtitle}</p>
      </div>
      <DocumentBadge badge={doc.badge} />
    </button>
    {showDivider ? <Divider /> : null}
  </>
);

// ── Detail views ──────────────────────────────────────────────────────────────

const FormsDetail = ({ onOpenDocument }: { onOpenDocument: (doc: DocumentItem) => void }) => (
  <div className="flex flex-col pt-2 pb-24 gap-0">
    {FORM_DOCUMENTS.map((doc) => (
      <DetailItem key={doc.id} doc={doc} onOpen={onOpenDocument} />
    ))}
  </div>
);

type PermAnswer = "yes" | "no" | null;

interface PermItem {
  id: string;
  label: string;
  answer: PermAnswer;
}

const AnswerIcon = ({ answer }: { answer: PermAnswer }) => {
  if (answer === "yes") return <CheckCircle2Icon className="w-5 h-5 text-green-500 flex-shrink-0" />;
  if (answer === "no") return <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />;
  return <HelpCircleIcon className="w-5 h-5 text-mfprimaryp-400 flex-shrink-0" />;
};

const PermissionsDetail = () => {
  const [items, setItems] = useState<PermItem[]>([
    { id: "sunscreen", label: "Can use sunscreen", answer: null },
    { id: "photos", label: "Can be in photos", answer: "yes" },
    { id: "trips", label: "Can go on field trips", answer: "yes" },
    { id: "repellent", label: "Can use insect repellent", answer: null },
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
            <AnswerIcon answer={item.answer} />
            <span className="flex-1 text-sm font-medium text-mfneutralsn-500">{item.label}</span>
            {isEditing ? (
              <div className="flex items-center gap-1.5">
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
                className="px-3 py-1 text-[14px] font-medium rounded-md border border-gray-200 bg-white text-mfneutralsn-400 active:bg-gray-50"
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

const NotesDetail = ({ onOpenNote }: { onOpenNote: (note: DocumentItem) => void }) => (
  <div className="flex flex-col pt-2 pb-24 gap-2 px-2">
    {NOTE_ITEMS.map((note) => (
      <button
        key={note.id}
        type="button"
        onClick={() => onOpenNote(note)}
        className="w-full bg-white border border-gray-100 rounded-xl p-4 text-left active:bg-gray-50"
      >
        <p className="text-sm font-medium text-mfneutralsn-500">{note.title}</p>
        <p className="text-[14px] text-mfneutralsn-300 mt-1">{note.subtitle}</p>
      </button>
    ))}
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

// ── Contract detail data ──────────────────────────────────────────────────────

const CONTRACT_META: Record<string, { status: "signed" | "pending"; completedOn?: string; contractId: string; fileName: string }> = {
  "about-me": {
    status: "pending",
    contractId: "c9cda816-56b1-4735-9f37-dc4d3bb8e734",
    fileName: "abby-freedman_about-me-form_04-29-2026.pdf",
  },
  "enrollment": {
    status: "signed",
    completedOn: "04/29/2026",
    contractId: "eefa7455-14bb-42bf-9e4e-18596560871a",
    fileName: "abby-freedman_enrollment-form_04-29-2026.pdf",
  },
  "care-contract": {
    status: "signed",
    completedOn: "02/21/2026",
    contractId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    fileName: "abby-freedman_care-contract_02-21-2026.pdf",
  },
  "merchandise": {
    status: "signed",
    completedOn: "03/03/2026",
    contractId: "f1e2d3c4-b5a6-9870-fedc-ba0987654321",
    fileName: "abby-freedman_merchandise_03-03-2026.pdf",
  },
};

export const DocumentsContent = (): JSX.Element => {
  const [section, setSection] = useState<Section>(null);
  const [openDocument, setOpenDocument] = useState<DocumentItem | null>(null);
  const [contractDetail, setContractDetail] = useState<DocumentItem | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChildProfileSubpageActive(section !== null || openDocument !== null || contractDetail !== null);
  }, [section, openDocument, contractDetail]);

  useEffect(() => () => setChildProfileSubpageActive(false), []);

  useEffect(() => {
    const scrollable = rootRef.current?.closest(".overflow-y-auto") as HTMLElement | null;
    scrollable?.scrollTo({ top: 0, behavior: "smooth" });
  }, [section, openDocument, contractDetail]);

  // Forms → contract detail first, then document preview
  const handleOpenFormDocument = (doc: DocumentItem) => {
    if (CONTRACT_META[doc.id]) {
      setContractDetail(doc);
    } else {
      setOpenDocument(doc);
    }
  };

  if (openDocument !== null) {
    return (
      <div ref={rootRef} className="flex flex-col">
        <DocumentPreviewPage
          title={openDocument.title}
          subtitle={openDocument.subtitle}
          bodyText={openDocument.bodyText}
          onBack={() => {
            // if came from contract detail, go back there
            if (contractDetail !== null) {
              setOpenDocument(null);
            } else {
              setOpenDocument(null);
            }
          }}
        />
      </div>
    );
  }

  if (contractDetail !== null) {
    const meta = CONTRACT_META[contractDetail.id] ?? {
      status: "pending" as const,
      contractId: "unknown",
      fileName: contractDetail.title + ".pdf",
    };
    const isPending = meta.status === "pending";
    return (
      <div ref={rootRef} className="flex flex-col">
        <ContractDetailPage
          title={contractDetail.title}
          childName="Abby Freedman"
          status={meta.status}
          sentOn="04/29/2026"
          completedOn={meta.completedOn}
          fileName={meta.fileName}
          fileSize="0.09 MB"
          signees={
            isPending
              ? [
                  { name: "Martha Freedman", role: "Mum", status: "received", statusDate: "Apr 29 2026, 3:01pm" },
                  { name: "Nursery representative", role: "Name shown once signed", status: "pending" },
                ]
              : [
                  { name: "Martha Freedman", role: "Mum", avatarSrc: `${BASE_PATH}avatar-2.png`, status: "signed", statusDate: "Apr 29 2026, 2:18pm" },
                  { name: "Sofia Adams", role: "Nursery staff", avatarSrc: `${BASE_PATH}avatar---rounded---xl.png`, status: "signed", statusDate: "Apr 29 2026, 2:21pm" },
                ]
          }
          createdOn="04/29/2026 at 11:22am"
          contractId={meta.contractId}
          onClose={() => setContractDetail(null)}
          onViewDocument={() => setOpenDocument(contractDetail)}
        />
      </div>
    );
  }

  if (section !== null) {
    return (
      <div ref={rootRef} className="flex flex-col bg-mfneutralsn-50 min-h-full">
        <SectionHeader title={sectionTitles[section]} onBack={() => setSection(null)} />
        {section === "forms" && <FormsDetail onOpenDocument={handleOpenFormDocument} />}
        {section === "permissions" && <PermissionsDetail />}
        {section === "notes" && <NotesDetail onOpenNote={setOpenDocument} />}
        {section === "resources" && <ResourcesDetail />}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="flex flex-col bg-mfneutralsn-50 pb-24 gap-4">
      {/* Notes */}
      <Card>
        <CardHeader title="Notes" count={NOTE_ITEMS.length} onPress={() => setSection("notes")} />
        <Divider />
        <button
          type="button"
          onClick={() => setOpenDocument(NOTE_ITEMS[0])}
          className="w-full px-4 py-3 text-left active:bg-gray-50"
        >
          <p className="text-[14px] font-medium text-mfneutralsn-500 leading-tight">{NOTE_ITEMS[0].title}</p>
          <p className="text-[14px] text-mfneutralsn-300 mt-1 leading-tight">21 Feb 2026</p>
        </button>
      </Card>

      {/* Forms and contracts */}
      <Card>
        <CardHeader title="Forms and contracts" count={6} onPress={() => setSection("forms")} />
        {FORM_DOCUMENTS.slice(0, 3).map((doc, index, list) => (
          <FormDocumentRow
            key={doc.id}
            doc={doc}
            onOpen={handleOpenFormDocument}
            showDivider={index < list.length - 1}
          />
        ))}
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader title="Permissions" count={6} onPress={() => setSection("permissions")} />
        <Divider />
        <div className="px-4 py-3 flex items-center justify-between">
          <p className="text-[14px] font-medium text-mfneutralsn-500 leading-tight">Can use sunscreen</p>
          <Badge label="Answer" variant="answer" />
        </div>
        <Divider />
        <div className="px-4 py-3 flex items-center justify-between">
          <p className="text-[14px] font-medium text-mfneutralsn-500 leading-tight">Can be in photos</p>
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
