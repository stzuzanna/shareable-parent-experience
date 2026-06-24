import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";

export type EditFieldType = "text" | "textarea" | "select" | "date";

export interface EditFieldConfig {
  title: string;
  subtitle?: string;
  type: EditFieldType;
  value: string;
  placeholder?: string;
  options?: string[];
}

interface EditFieldSheetProps {
  isOpen: boolean;
  field: EditFieldConfig | null;
  onClose: () => void;
  onSave: (value: string) => void;
  useAbsolute?: boolean;
}

export const EditFieldSheet: React.FC<EditFieldSheetProps> = ({
  isOpen,
  field,
  onClose,
  onSave,
  useAbsolute = false,
}) => {
  const pos = useAbsolute ? "absolute" : "fixed";
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (isOpen && field) setDraft(field.value);
  }, [isOpen, field]);

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  const inputClass =
    "w-full h-11 px-3 rounded-lg border border-mfneutralsn-200 bg-white text-[14px] text-mfneutralsn-500 focus:outline-none focus:border-mfprimaryp-400";

  return (
    <AnimatePresence>
      {isOpen && field && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`${pos} inset-0 bg-black/40 z-[250]`}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className={`${pos} bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[260] max-h-[85%] overflow-hidden flex flex-col`}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="flex items-start justify-between px-5 pt-1 pb-2 gap-2">
              <div className="flex flex-col min-w-0">
                <h2 className="text-[16px] font-medium text-mfneutralsn-500 leading-tight">{field.title}</h2>
                {field.subtitle && (
                  <p className="text-[14px] text-mfneutralsn-300 mt-1 leading-snug">{field.subtitle}</p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-7 h-7 flex items-center justify-center text-mfneutralsn-400 active:bg-gray-50 rounded-full flex-shrink-0"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 pt-3 pb-4 overflow-y-auto">
              {field.type === "text" && (
                <input
                  autoFocus
                  value={draft}
                  placeholder={field.placeholder}
                  onChange={(e) => setDraft(e.target.value)}
                  className={inputClass}
                />
              )}
              {field.type === "textarea" && (
                <textarea
                  autoFocus
                  value={draft}
                  placeholder={field.placeholder}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg border border-mfneutralsn-200 bg-white text-[14px] text-mfneutralsn-500 focus:outline-none focus:border-mfprimaryp-400 resize-none"
                />
              )}
              {field.type === "date" && (
                <input
                  type="date"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className={inputClass}
                />
              )}
              {field.type === "select" && (
                <select value={draft} onChange={(e) => setDraft(e.target.value)} className={inputClass}>
                  {(field.options ?? []).map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center gap-3 px-5 pt-2 pb-6">
              <button
                onClick={onClose}
                className="flex-1 h-11 rounded-lg border border-mfneutralsn-200 bg-white text-[14px] text-mfneutralsn-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 h-11 rounded-lg bg-mfprimaryp-400 text-white text-[14px] font-medium"
              >
                Save changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
