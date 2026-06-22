import React from "react";
import { XIcon, DownloadIcon, FileTextIcon, BookOpenIcon, UserIcon, CheckCircle2Icon, ClockIcon } from "lucide-react";
import { BASE_PATH } from "../../../../constants";

export interface Signee {
  name: string;
  role: string;
  avatarSrc?: string;
  status: "signed" | "received" | "pending";
  statusDate?: string; // e.g. "Apr 29 2026, 2:18pm"
}

export interface ContractDetailProps {
  title: string;           // e.g. "Virginia enrollment form"
  childName: string;       // e.g. "Aaron Griffin"
  status: "signed" | "pending";
  sentOn: string;          // e.g. "04/29/2026"
  completedOn?: string;    // undefined → shows "--"
  fileName: string;        // e.g. "aaron-griffin_virginia-enrollment-formm_04-29-2026.pdf"
  fileSize: string;        // e.g. "0.09 MB"
  signees: Signee[];
  createdOn: string;       // e.g. "04/29/2026 at 11:22am"
  contractId: string;
  onClose: () => void;
  onViewDocument: () => void;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: "signed" | "pending" }> = ({ status }) =>
  status === "signed" ? (
    <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full border border-emerald-400 bg-emerald-50 text-[13px] font-medium text-emerald-700">
      <CheckCircle2Icon className="w-3.5 h-3.5" />
      Signed digitally
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full border border-amber-400 bg-amber-50 text-[13px] font-medium text-amber-700">
      <ClockIcon className="w-3.5 h-3.5" />
      Pending
    </span>
  );

// ─── Signee row ───────────────────────────────────────────────────────────────

const SigneeRow: React.FC<{ signee: Signee }> = ({ signee }) => (
  <div className="flex items-center gap-3 py-3">
    {/* Avatar */}
    {signee.avatarSrc ? (
      <img src={signee.avatarSrc} alt={signee.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
    ) : (
      <div className="w-9 h-9 rounded-full bg-mfprimaryp-50 flex items-center justify-center flex-shrink-0">
        <UserIcon className="w-4 h-4 text-mfprimaryp-400" />
      </div>
    )}

    {/* Name + role */}
    <div className="flex-1 min-w-0">
      <p className={`text-[14px] font-semibold leading-snug ${signee.status === "pending" ? "text-mfneutralsn-300" : "text-mfneutralsn-500"}`}>
        {signee.name}
      </p>
      <p className="text-[12px] text-mfneutralsn-300 leading-snug">{signee.role}</p>
    </div>

    {/* Status */}
    <div className="text-right flex-shrink-0">
      {signee.status === "pending" ? (
        <span className="text-[13px] text-mfneutralsn-300 font-medium">Pending</span>
      ) : (
        <>
          <p className="text-[13px] font-semibold text-mfneutralsn-500">
            {signee.status === "signed" ? "Signed" : "Received"}
          </p>
          {signee.statusDate && (
            <p className="text-[11px] text-mfneutralsn-300">{signee.statusDate}</p>
          )}
        </>
      )}
    </div>
  </div>
);

// ─── Section label ────────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[13px] font-semibold text-mfneutralsn-500 mb-2">{children}</p>
);

const MetaRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-[13px] font-semibold text-mfneutralsn-500">{label}</p>
    <p className="text-[13px] text-mfneutralsn-400 mt-0.5">{value}</p>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export const ContractDetailPage: React.FC<ContractDetailProps> = ({
  title,
  childName,
  status,
  sentOn,
  completedOn,
  fileName,
  fileSize,
  signees,
  createdOn,
  contractId,
  onClose,
  onViewDocument,
}) => (
  <div className="flex flex-col bg-white min-h-full pb-28">
    {/* Header */}
    <div className="flex items-start justify-between px-4 pt-5 pb-4">
      <div className="flex-1 min-w-0 pr-3">
        <h1 className="text-[22px] font-bold text-mfneutralsn-500 leading-tight">Contract</h1>
        <p className="text-[13px] text-mfprimaryp-400 mt-0.5">
          {title}&nbsp;·&nbsp;{childName}
        </p>
      </div>
      <button
        onClick={onClose}
        className="w-9 h-9 rounded-full border border-mfneutralsn-100 flex items-center justify-center flex-shrink-0 active:bg-mfneutralsn-50 transition-colors"
      >
        <XIcon className="w-4 h-4 text-mfneutralsn-400" />
      </button>
    </div>

    <div className="px-4 flex flex-col gap-5">
      {/* Status badge */}
      <StatusBadge status={status} />

      {/* Dates */}
      <div className="flex gap-8">
        <MetaRow label="Sent on" value={sentOn} />
        <MetaRow label="Completed on" value={completedOn ?? "—"} />
      </div>

      {/* Contract file */}
      <div>
        <SectionLabel>Contract file</SectionLabel>
        <div className={`rounded-2xl border overflow-hidden ${status === "signed" ? "border-emerald-200" : "border-mfneutralsn-100"}`}>
          {/* File row */}
          <button
            onClick={onViewDocument}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-white active:bg-mfneutralsn-50 transition-colors"
          >
            <FileTextIcon className="w-5 h-5 text-mfneutralsn-300 flex-shrink-0" />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-medium text-mfneutralsn-500 leading-snug break-all">{fileName}</p>
              <p className="text-[11px] text-mfneutralsn-300 mt-0.5">{fileSize}</p>
            </div>
            <DownloadIcon className="w-5 h-5 text-mfneutralsn-300 flex-shrink-0" />
          </button>

          {/* Legal note — only when signed */}
          {status === "signed" && (
            <div className="flex items-start gap-2.5 px-4 py-3 bg-emerald-50 border-t border-emerald-100">
              <BookOpenIcon className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-emerald-800 leading-snug">
                This is a legally binding contract between all parties, and all signees have access.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Signees */}
      <div>
        <SectionLabel>Signees</SectionLabel>
        <div className="rounded-2xl border border-mfneutralsn-75 bg-white px-4 divide-y divide-mfneutralsn-75">
          {signees.map((s, i) => (
            <SigneeRow key={i} signee={s} />
          ))}
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-3 pb-2">
        <MetaRow label="Created on" value={createdOn} />
        <div>
          <p className="text-[13px] font-semibold text-mfneutralsn-500">Contract ID</p>
          <p className="text-[11px] text-mfneutralsn-300 mt-0.5 break-all font-mono">{contractId}</p>
        </div>
      </div>
    </div>

    {/* CTA — only for pending */}
    {status === "pending" && (
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-8 pt-3 bg-white border-t border-mfneutralsn-75">
        <button
          onClick={onViewDocument}
          className="w-full h-12 rounded-2xl bg-mfprimaryp-400 text-white text-[15px] font-semibold active:opacity-80 transition-opacity"
        >
          Review and sign
        </button>
      </div>
    )}
  </div>
);
