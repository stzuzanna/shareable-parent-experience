import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsIcon,
  ClockIcon,
  CalendarX2Icon,
  SunIcon,
  ThermometerIcon,
  MessageSquareIcon,
  SmileIcon,
} from "lucide-react";

interface Action {
  id: string;
  icon: React.ElementType;
  label: string;
}

const actions: Action[] = [
  { id: "meals", icon: UtensilsIcon, label: "Opt in and out of meals" },
  { id: "checkout", icon: ClockIcon, label: "Plan check out time" },
  { id: "absence", icon: CalendarX2Icon, label: "Log absence" },
  { id: "vacation", icon: SunIcon, label: "Log vacation" },
  { id: "sickness", icon: ThermometerIcon, label: "Log sickness" },
  { id: "message", icon: MessageSquareIcon, label: "Send message to key teacher" },
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
  const pos = useAbsolute ? 'absolute' : 'fixed';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`${pos} inset-0 bg-black/40 z-[70]`}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className={`${pos} bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[80]`}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-4">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            {/* Action cards */}
            <div className="flex flex-col gap-3 px-4 pb-10">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-200 bg-white active:bg-gray-50 transition-colors text-left w-full"
                    onClick={() => onAction(action.id)}
                  >
                    <Icon className="w-5 h-5 text-mfneutralsn-400 flex-shrink-0" />
                    <span className="text-sm text-mfneutralsn-500">{action.label}</span>
                  </button>
                );
              })}

              {/* Divider with label */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[11px] text-mfneutralsn-300 uppercase tracking-wide">Testing this prototype?</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Feedback action */}
              <button
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-mfprimaryp-400 bg-mfprimaryp-50 active:bg-mfprimaryp-100 transition-colors text-left w-full"
                onClick={() => onAction("feedback")}
              >
                <SmileIcon className="w-5 h-5 text-mfprimaryp-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-mfprimaryp-400">Let us know what you think</span>
                  <span className="text-xs text-mfprimaryp-300 mt-0.5">Your feedback helps us improve</span>
                </div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
