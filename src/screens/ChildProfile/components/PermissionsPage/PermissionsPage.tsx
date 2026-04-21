import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import { DeviceFrame } from "../../../../components/DeviceFrame/DeviceFrame";
import { Button } from "../../../../components/ui/button";
import { BASE_PATH } from "../../../../constants";
import { CheckCircle2, XCircle, HelpCircle, X as XIcon, FileText, ChevronRight } from "lucide-react";

interface PermissionItem {
  id: string;
  label: string;
  answer: "yes" | "no" | null;
  lastChanged?: string;
  attachmentName?: string;
}

export const PermissionsPage = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();

  const [items, setItems] = useState<PermissionItem[]>([
    { id: "photos", label: "Can your child be photographed?", answer: null },
    { id: "field-trip", label: "Can go on a field trip", answer: "yes", attachmentName: "permission-slip.pdf", lastChanged: "01/02/2025" },
    { id: "animals", label: "Can play with animals", answer: "yes", lastChanged: "06/10/2024" },
    { id: "sunscreen", label: "Sunscreen", answer: "yes", lastChanged: "05/06/2024" },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const setAnswer = (id: string, answer: "yes" | "no") => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, answer } : it)));
    setEditingId(null);
  };

  const renderStatusIcon = (answer: "yes" | "no" | null) => {
    if (answer === "yes") {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    if (answer === "no") {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    return <HelpCircle className="w-5 h-5 text-mfprimaryp-400" />;
  };

  const Header = (
    <header className={`flex flex-col w-full items-start relative ${!shouldShowFrame ? 'sticky top-0 z-50' : ''}`}>
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
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="w-6 h-6 p-0">
          <XIcon className="w-5 h-5 text-white" />
        </Button>
        <h1 className="font-MF-headings-h6-emphasis font-[number:var(--MF-headings-h6-emphasis-font-weight)] text-mfneutralsn-0 text-[length:var(--MF-headings-h6-emphasis-font-size)] leading-[var(--MF-headings-h6-emphasis-line-height)] tracking-[var(--MF-headings-h6-emphasis-letter-spacing)] [font-style:var(--MF-headings-h6-emphasis-font-style)]">
          Permissions
        </h1>
        <div className="w-6 h-6" />
      </nav>
    </header>
  );

  const page = (
    <div className="flex flex-col bg-white min-h-screen">
      {Header}

      <div className="flex-1 bg-white">
        <div className="flex flex-col">
          {items.map((item, idx) => (
            <div key={item.id} className="flex flex-col border-b border-gray-100">
              <div className="flex items-start gap-3 px-6 py-4">
                <div className="pt-0.5">{renderStatusIcon(item.answer)}</div>
                <div className="flex-1">
                  <div className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-400 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
                    {item.label}
                  </div>

                  {/* Attachment / Details / Last changed (for field trip example) */}
                  {item.attachmentName && (
                    <div className="mt-3 ml-0">
                      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-mfneutralsn-400">
                        <FileText className="w-4 h-4" />
                        {item.attachmentName}
                      </div>
                    </div>
                  )}
                  {item.id === "field-trip" && (
                    <div className="mt-3 text-mfprimaryp-400 text-sm">Details</div>
                  )}
                  {item.lastChanged && (
                    <div className="mt-1 text-[13px] text-brandneutralsn-200">Last changed by Olivia Wilson on {item.lastChanged}</div>
                  )}
                </div>

                {/* Inline actions */}
                {(item.id === "photos" && item.answer === null) || editingId === item.id ? (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" className="px-3 h-8 rounded-md border border-gray-200" onClick={() => setAnswer(item.id, "yes")}>Yes</Button>
                    <Button variant="ghost" className="px-3 h-8 rounded-md border border-gray-200" onClick={() => setAnswer(item.id, "no")}>No</Button>
                  </div>
                ) : (
                  <Button variant="ghost" className="px-3 h-8 rounded-md border border-gray-200" onClick={() => setEditingId(item.id)}>
                    Edit
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <DeviceFrame showFrame={shouldShowFrame}>
      {page}
    </DeviceFrame>
  );
};


