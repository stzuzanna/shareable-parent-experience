import React, { useState } from "react";
import { Button } from "../ui/button";
import { BASE_PATH } from "../../constants";
import { X as XIcon, CalendarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Toast } from "../Toast/Toast";
import { useToast } from "../../hooks/useToast";

type AbsenceType = "sick" | "vacation" | "absent";

interface AbsenceOverlayProps {
  onClose: () => void;
  type: AbsenceType;
}

const titleMap: Record<AbsenceType, string> = {
  sick: "Sick",
  vacation: "Vacation",
  absent: "Absent",
};

export const AbsenceOverlay: React.FC<AbsenceOverlayProps> = ({ onClose, type }): JSX.Element => {
  const todayStr = new Date().toLocaleDateString('en-CA');
  const [fromDate, setFromDate] = useState<string>(todayStr);
  const [toDate, setToDate] = useState<string>(todayStr);
  const { toasts, showToast, removeToast } = useToast();

  const handleSave = () => {
    showToast("Saved", "success");
    setTimeout(() => {
      onClose();
    }, 900);
  };
  return (
    <div className="absolute inset-0 z-50 bg-white">
      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
      {/* Header */}
      <div className="flex flex-col w-full items-start">
        <div className="flex items-end justify-center px-0 py-2 relative w-full bg-mfprimaryp-400">
          <div className="flex flex-col w-[106px] items-start justify-center gap-2 pl-5 pr-0 pt-0 pb-[3px] relative">
            <div className="relative w-[54px] h-[21px] rounded-3xl">
              <div className="absolute top-px left-[11px] [font-family:'Inter',Helvetica] font-medium text-mfneutralsn-0 text-base text-center tracking-[-0.32px] leading-[21px] whitespace-nowrap">9:41</div>
            </div>
          </div>

          <div className="flex flex-col h-8 items-center justify-center relative flex-1">
            <div className="relative flex-1 w-[108px] bg-mfneutralsn-0 rounded-[100px] opacity-0" />
          </div>

          <img className="relative w-[106px] h-full" alt="Right side" src={`${BASE_PATH}right-side.svg`} />
        </div>

        <nav className="flex h-12 items-center justify-between px-4 py-2 relative w-full bg-mfprimaryp-400">
          <Button variant="ghost" size="icon" onClick={onClose} className="w-6 h-6 p-0">
            <XIcon className="w-5 h-5 text-white" />
          </Button>
          <h1 className="font-MF-headings-h6-emphasis font-[number:var(--MF-headings-h6-emphasis-font-weight)] text-mfneutralsn-0 text-[length:var(--MF-headings-h6-emphasis-font-size)] leading-[var(--MF-headings-h6-emphasis-line-height)] tracking-[var(--MF-headings-h6-emphasis-letter-spacing)] [font-style:var(--MF-headings-h6-emphasis-font-style)]">
            {titleMap[type]}
          </h1>
          <div className="w-6 h-6" />
        </nav>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="space-y-1">
          <div className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-400 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
            Please let us know about your child's {titleMap[type].toLowerCase()}.
          </div>
          <div className="text-sm text-mfneutralsn-300">This is a demo overlay for preview purposes.</div>
        </div>

        {/* Date range inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm text-mfneutralsn-300">From</label>
            <div className="relative">
              <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input type="date" className="pl-9 h-10 rounded-lg border-gray-200" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-mfneutralsn-300">To</label>
            <div className="relative">
              <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input type="date" className="pl-9 h-10 rounded-lg border-gray-200" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 border-gray-200" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-mfprimaryp-400 hover:bg-mfprimaryp-400/90 text-white" onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};


