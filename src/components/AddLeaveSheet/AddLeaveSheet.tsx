import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, ChevronLeftIcon, CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useAppToast } from "../../contexts/ToastContext";

const LEAVE_TYPES = ["Sick", "Holiday", "Absence"] as const;
type LeaveType = (typeof LEAVE_TYPES)[number];

interface AddLeaveFormContentProps {
  onClose: () => void;
  onBack?: () => void;
  onSaved?: () => void;
}

export const AddLeaveFormContent: React.FC<AddLeaveFormContentProps> = ({
  onClose,
  onBack,
  onSaved,
}) => {
  const todayStr = new Date().toLocaleDateString("en-CA");
  const [leaveType, setLeaveType] = useState<LeaveType>("Sick");
  const [fromDate, setFromDate] = useState(todayStr);
  const [toDate, setToDate] = useState(todayStr);
  const { showToast } = useAppToast();

  const handleSave = () => {
    showToast("Leave added", "success");
    onSaved?.();
    onClose();
  };

  return (
    <>
      <div className="flex items-center gap-2 px-5 pt-2 pb-4">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="w-8 h-8 flex items-center justify-center rounded-full border border-mfneutralsn-200 text-mfneutralsn-500 active:bg-gray-50 flex-shrink-0"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
        ) : null}
        <div className="flex-1 min-w-0">
          <h2 className="text-[16px] font-medium text-mfneutralsn-500">Add leave</h2>
          <p className="text-[14px] text-mfneutralsn-300 mt-0.5 leading-snug">
            Let the nursery know when your child won&apos;t attend
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-mfneutralsn-400 flex-shrink-0"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 pb-10 flex flex-col gap-5">
        <div className="space-y-1.5">
          <label className="text-[14px] text-mfneutralsn-300">Leave type</label>
          <div className="relative">
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              className="w-full h-10 pl-3 pr-9 rounded-lg border border-mfneutralsn-200 bg-white text-[14px] text-mfneutralsn-500 appearance-none focus:outline-none focus:border-mfprimaryp-400"
            >
              {LEAVE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="w-4 h-4 text-mfneutralsn-300 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[14px] text-mfneutralsn-300">From</label>
            <div className="relative">
              <CalendarIcon className="w-4 h-4 text-mfneutralsn-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="date"
                className="pl-9 h-10 rounded-lg border-mfneutralsn-200 text-[14px]"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[14px] text-mfneutralsn-300">To</label>
            <div className="relative">
              <CalendarIcon className="w-4 h-4 text-mfneutralsn-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="date"
                className="pl-9 h-10 rounded-lg border-mfneutralsn-200 text-[14px]"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack ?? onClose}
            className="flex-1 h-11 rounded-lg border border-mfneutralsn-200 bg-white text-[14px] font-medium text-mfneutralsn-500 active:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 h-11 rounded-lg bg-mfprimaryp-400 text-white text-[14px] font-medium active:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

interface AddLeaveSheetProps {
  isOpen: boolean;
  onClose: () => void;
  useAbsolute?: boolean;
}

export const AddLeaveSheet: React.FC<AddLeaveSheetProps> = ({
  isOpen,
  onClose,
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
            className={`${pos} inset-0 bg-black/40 z-[90]`}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className={`${pos} bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[95] max-h-[85%] overflow-y-auto`}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>
            <AddLeaveFormContent onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
