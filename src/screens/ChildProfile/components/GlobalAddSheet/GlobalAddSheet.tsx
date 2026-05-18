import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsIcon,
  CalendarIcon,
  CalendarX2Icon,
  MessageSquareIcon,
  SmileIcon,
  XIcon,
  KeyRoundIcon,
  CheckIcon,
} from "lucide-react";
import { useProfileVariant, setProfileVariant, type ProfileVariant } from "../../../../hooks/useProfileVariant";

interface Action {
  id: string;
  icon: React.ElementType;
  iconColor?: string;
  label: string;
}

const actions: Action[] = [
  { id: "checkin-pin", icon: KeyRoundIcon, label: "Show check in pin" },
  { id: "add-leave", icon: CalendarX2Icon, label: "Add leave" },
  { id: "request-care", icon: CalendarIcon, label: "Request care" },
  { id: "meals", icon: UtensilsIcon, label: "Opt in and out of meals" },
  { id: "check-out", icon: CheckIcon, iconColor: "text-red-500", label: "Check out" },
  { id: "message", icon: MessageSquareIcon, label: "Send message to key person" },
];

interface GlobalAddSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (actionId: string) => void;
  /** Use absolute positioning (inside scaled device frame) instead of fixed (mobile viewport) */
  useAbsolute?: boolean;
}

export const GlobalAddSheet: React.FC<GlobalAddSheetProps> = ({
  isOpen,
  onClose,
  onAction,
  useAbsolute = false,
}) => {
  const pos = useAbsolute ? "absolute" : "fixed";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`${pos} inset-0 bg-black/40 z-[70]`}
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className={`${pos} bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[80]`}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            {/* Title row */}
            <div className="flex items-center justify-between px-5 pt-2 pb-4">
              <h2 className="text-[16px] font-medium text-mfneutralsn-500">Choose what to do</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-7 h-7 flex items-center justify-center text-mfneutralsn-400 active:bg-gray-50 rounded-full"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Action cards */}
            <div className="flex flex-col gap-2 px-4 pb-6">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-mfneutralsn-75 bg-white active:bg-gray-50 transition-colors text-left w-full"
                    onClick={() => onAction(action.id)}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${action.iconColor ?? "text-mfneutralsn-400"}`} />
                    <span className="text-[14px] font-medium text-mfneutralsn-500">{action.label}</span>
                  </button>
                );
              })}

              {/* Divider with label */}
              <div className="flex items-center gap-3 pt-4">
                <div className="flex-1 h-px bg-mfneutralsn-75" />
                <span className="text-[10px] text-mfneutralsn-300 uppercase tracking-wide">Testing this prototype?</span>
                <div className="flex-1 h-px bg-mfneutralsn-75" />
              </div>

              {/* Feedback action */}
              <button
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-mfprimaryp-400 bg-mfprimaryp-50 active:bg-mfprimaryp-100 transition-colors text-left w-full"
                onClick={() => onAction("feedback")}
              >
                <SmileIcon className="w-5 h-5 text-mfprimaryp-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-mfprimaryp-400">Let us know what you think</span>
                  <span className="text-[11px] text-mfprimaryp-300 mt-0.5">Your feedback helps us improve</span>
                </div>
              </button>

              {/* Variant switcher dots */}
              <VariantDots />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const VariantDots: React.FC = () => {
  const variant = useProfileVariant();
  const variants: { id: ProfileVariant; label: string }[] = [
    { id: "v1", label: "About / Health and safety / Documents" },
    { id: "v2", label: "About / Bookings / Paperwork" },
  ];
  return (
    <div className="flex flex-col items-center gap-2 pt-3">
      <div className="flex items-center gap-2">
        {variants.map((v) => (
          <button
            key={v.id}
            aria-label={`Switch to ${v.label}`}
            onClick={() => setProfileVariant(v.id)}
            className={`rounded-full transition-all ${
              variant === v.id
                ? "w-2.5 h-2.5 bg-mfprimaryp-400"
                : "w-2 h-2 bg-mfneutralsn-200 hover:bg-mfneutralsn-300"
            }`}
          />
        ))}
      </div>
      <span className="text-[11px] text-mfneutralsn-300">{variants.find((v) => v.id === variant)?.label}</span>
    </div>
  );
};
