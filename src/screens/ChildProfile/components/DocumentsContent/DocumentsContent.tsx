import React from "react";
import { ChevronRightIcon } from "lucide-react";

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-4 rounded-2xl overflow-hidden border border-gray-100 bg-white">
    {children}
  </div>
);

const CardHeader = ({ title, count }: { title: string; count?: number }) => (
  <div className="flex items-center justify-between px-4 py-3 bg-mfneutralsn-50">
    <span className="text-sm text-mfneutralsn-300">{title}</span>
    <div className="flex items-center gap-1.5">
      {count !== undefined && (
        <span className="text-sm text-mfneutralsn-300">{count}</span>
      )}
      <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-200" />
    </div>
  </div>
);

const Divider = () => <div className="h-px bg-gray-100 mx-4" />;

const SignBadge = () => (
  <span className="text-xs px-2.5 py-0.5 rounded-full border border-mforangeo-400 text-mforangeo-400">
    Sign
  </span>
);

const SignedBadge = () => (
  <span className="text-xs px-2.5 py-0.5 rounded-full border border-green-500 text-green-600 flex items-center gap-1">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    Signed
  </span>
);

const AnswerBadge = () => (
  <span className="text-xs px-2.5 py-0.5 rounded-full border border-mforangeo-400 text-mforangeo-400">
    Answer
  </span>
);

const YesBadge = () => (
  <span className="text-xs px-2.5 py-0.5 rounded-full border border-green-500 text-green-600">
    Yes
  </span>
);

export const DocumentsContent = (): JSX.Element => {
  return (
    <div className="flex flex-col bg-mfneutralsn-50 pt-4 pb-24 gap-3">
      {/* Notes */}
      <Card>
        <CardHeader title="Notes" count={1} />
        <div className="px-4 py-3">
          <p className="text-sm font-semibold text-mfneutralsn-500">Tobin has been really active lately...</p>
          <p className="text-xs text-mfneutralsn-300 mt-0.5">Feb 21</p>
        </div>
      </Card>

      {/* Forms and contracts */}
      <Card>
        <CardHeader title="Forms and contracts" count={6} />
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-mfneutralsn-500">About me form</p>
            <p className="text-xs text-mfneutralsn-300 mt-0.5">21 Feb 2026 · 111MB</p>
          </div>
          <div className="flex items-center gap-2">
            <SignBadge />
            <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-200" />
          </div>
        </div>
        <Divider />
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-mfneutralsn-500">Merchandise</p>
            <p className="text-xs text-mfneutralsn-300 mt-0.5">1 Jan 2026 · 10MB</p>
          </div>
          <div className="flex items-center gap-2">
            <SignedBadge />
            <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-200" />
          </div>
        </div>
        <Divider />
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-mfneutralsn-500">Updated care contract</p>
            <p className="text-xs text-mfneutralsn-300 mt-0.5">Feb 21</p>
          </div>
          <div className="flex items-center gap-2">
            <SignedBadge />
            <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-200" />
          </div>
        </div>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader title="Permissions" count={6} />
        <div className="px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-mfneutralsn-500">Can use sunscreen</p>
          <div className="flex items-center gap-2">
            <AnswerBadge />
            <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-200" />
          </div>
        </div>
        <Divider />
        <div className="px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-mfneutralsn-500">Can be in photos</p>
          <div className="flex items-center gap-2">
            <YesBadge />
            <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-200" />
          </div>
        </div>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader title="Resources" count={0} />
      </Card>
    </div>
  );
};
