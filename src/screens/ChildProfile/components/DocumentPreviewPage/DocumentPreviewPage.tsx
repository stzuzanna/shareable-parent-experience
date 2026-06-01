import React from "react";
import { ArrowLeftIcon } from "lucide-react";

const SkeletonBar = ({ className }: { className: string }) => (
  <div className={`rounded-full bg-mfneutralsn-75 ${className}`} />
);

const FormFieldSkeleton = ({
  labelWidth = "w-28",
  fieldHeight = "h-10",
  fullWidth = true,
}: {
  labelWidth?: string;
  fieldHeight?: string;
  fullWidth?: boolean;
}) => (
  <div className={fullWidth ? "w-full" : "flex-1 min-w-0"}>
    <SkeletonBar className={`h-2.5 ${labelWidth} mb-2`} />
    <div className={`${fieldHeight} w-full rounded-lg border border-mfneutralsn-75 bg-mfneutralsn-50`} />
  </div>
);

const CheckboxRowSkeleton = () => (
  <div className="flex items-start gap-2.5">
    <div className="w-4 h-4 rounded border border-mfneutralsn-200 bg-mfneutralsn-50 flex-shrink-0 mt-0.5" />
    <SkeletonBar className="h-2.5 flex-1 max-w-[240px]" />
  </div>
);

const FormPageSkeleton = () => (
  <div className="rounded-xl border border-mfneutralsn-75 bg-white p-5 shadow-sm">
    <SkeletonBar className="h-4 w-3/5 mb-2" />
    <SkeletonBar className="h-2.5 w-full mb-1" />
    <SkeletonBar className="h-2.5 w-11/12 mb-6" />

    <div className="space-y-5">
      <div className="flex gap-3">
        <FormFieldSkeleton labelWidth="w-20" fullWidth={false} />
        <FormFieldSkeleton labelWidth="w-24" fullWidth={false} />
      </div>

      <FormFieldSkeleton labelWidth="w-32" />
      <FormFieldSkeleton labelWidth="w-36" fieldHeight="h-10" />

      <div>
        <SkeletonBar className="h-2.5 w-40 mb-3" />
        <div className="space-y-2.5">
          <CheckboxRowSkeleton />
          <CheckboxRowSkeleton />
          <CheckboxRowSkeleton />
        </div>
      </div>

      <div className="pt-1 border-t border-mfneutralsn-75">
        <SkeletonBar className="h-3 w-36 mt-4 mb-4" />
        <FormFieldSkeleton labelWidth="w-28" fieldHeight="h-10" />
        <div className="mt-4">
          <FormFieldSkeleton labelWidth="w-24" fieldHeight="h-20" />
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <FormFieldSkeleton labelWidth="w-16" fullWidth={false} />
        <FormFieldSkeleton labelWidth="w-20" fullWidth={false} />
        <FormFieldSkeleton labelWidth="w-14" fullWidth={false} />
      </div>

      <div className="pt-2">
        <SkeletonBar className="h-2.5 w-32 mb-2" />
        <div className="h-14 w-full rounded-lg border border-dashed border-mfneutralsn-200 bg-mfneutralsn-50 flex items-center justify-center">
          <SkeletonBar className="h-2.5 w-24" />
        </div>
      </div>
    </div>
  </div>
);

export interface DocumentPreviewPageProps {
  title: string;
  subtitle?: string;
  /** When set, shows note text instead of the form skeleton */
  bodyText?: string;
  onBack: () => void;
}

export const DocumentPreviewPage: React.FC<DocumentPreviewPageProps> = ({
  title,
  subtitle,
  bodyText,
  onBack,
}) => (
  <div className="flex flex-col bg-mfneutralsn-50 min-h-full pb-24">
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-mfneutralsn-75">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0 active:bg-gray-50"
      >
        <ArrowLeftIcon className="w-4 h-4 text-mfneutralsn-500" />
      </button>
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-mfneutralsn-500 truncate">{title}</h1>
        {subtitle ? (
          <p className="text-[14px] text-mfneutralsn-300 mt-0.5 truncate">{subtitle}</p>
        ) : null}
      </div>
    </div>

    <div className="px-4 pt-4 pb-2">
      {bodyText ? (
        <div className="rounded-xl border border-mfneutralsn-75 bg-white p-5 shadow-sm">
          <p className="text-[14px] text-mfneutralsn-500 leading-relaxed whitespace-pre-line">{bodyText}</p>
        </div>
      ) : (
        <FormPageSkeleton />
      )}
    </div>
  </div>
);
