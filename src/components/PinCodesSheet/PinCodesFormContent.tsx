import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, ChevronLeftIcon, RefreshCwIcon, Loader2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BASE_PATH } from "../../constants";
import { useAppToast } from "../../contexts/ToastContext";

interface PinCodesFormContentProps {
  onClose: () => void;
  onBack?: () => void;
}

const ROOM = {
  name: "Explorers",
  avatar: `${BASE_PATH}frame-12.png`,
  fallback: "EX",
};

const generatePin = () => String(Math.floor(1000 + Math.random() * 9000));

export const PinCodesFormContent: React.FC<PinCodesFormContentProps> = ({ onClose, onBack }) => {
  const [pin, setPin] = useState("4751");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { showToast } = useAppToast();

  const pinDigits = useMemo(() => pin.split(""), [pin]);

  const handleResetConfirm = async () => {
    setIsResetting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setPin(generatePin());
    setIsResetting(false);
    setShowResetConfirm(false);
    showToast("Sign-in code updated", "success");
  };

  return (
    <div className="relative flex flex-col max-h-[min(75vh,520px)] min-h-0">
      <div className="flex items-center gap-2 px-5 pt-2 pb-4 flex-shrink-0">
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
        <h2 className="flex-1 text-[16px] font-semibold text-mfneutralsn-500">Pin codes</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-mfneutralsn-400 flex-shrink-0"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-5 pb-6">
        <div className="rounded-2xl bg-mfneutralsn-75 border border-mfneutralsn-75 p-4">
          <div className="flex items-center gap-2.5 mb-4">
            <Avatar className="w-9 h-9 border border-white shadow-sm">
              <AvatarImage src={ROOM.avatar} alt={ROOM.name} />
              <AvatarFallback className="text-[12px] bg-mfprimaryp-100 text-mfprimaryp-400">
                {ROOM.fallback}
              </AvatarFallback>
            </Avatar>
            <span className="text-[14px] font-medium text-mfneutralsn-500">{ROOM.name}</span>
          </div>

          <div className="flex items-center justify-between gap-3 mb-4">
            <div
              className="flex items-center gap-2"
              aria-label={`Sign-in code ${pin.split("").join(" ")}`}
            >
              {pinDigits.map((digit, index) => (
                <span
                  key={`${pin}-${index}`}
                  className="text-[36px] font-semibold leading-none text-mfneutralsn-500 tabular-nums tracking-wide"
                >
                  {digit}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              disabled={isResetting}
              aria-label="Reset sign-in code"
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full border border-mfneutralsn-200 bg-white text-mfneutralsn-400 active:bg-gray-50 disabled:opacity-50"
            >
              {isResetting ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCwIcon className="w-4 h-4" />
              )}
            </button>
          </div>

          <p className="text-[14px] text-mfneutralsn-400 text-center leading-snug px-1">
            This code can be used to check yourself or your child in and out.
          </p>
        </div>

        <p className="text-[14px] text-mfneutralsn-300 text-center mt-6 leading-snug px-2">
          The pincodes are personal and should not be shared.
        </p>
      </div>

      <AnimatePresence>
        {showResetConfirm && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Dismiss"
              className="absolute inset-0 z-10 bg-black/40 rounded-t-3xl"
              onClick={() => setShowResetConfirm(false)}
            />
            <motion.div
              role="dialog"
              aria-labelledby="reset-pin-title"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-2xl px-5 pt-4 pb-8 shadow-[0_-8px_32px_rgba(0,0,0,0.12)]"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 id="reset-pin-title" className="text-[16px] font-semibold text-mfneutralsn-500 pr-2">
                  Reset sign-in code?
                </h3>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  aria-label="Close"
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-mfneutralsn-400 active:bg-gray-50"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[14px] text-mfneutralsn-400 leading-snug mb-6">
                Your current sign-in code will be replaced with a new one. You can only reset your code once
                every 30 days.
              </p>
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={handleResetConfirm}
                  className="w-full h-11 rounded-xl bg-mfprimaryp-400 text-white text-[14px] font-medium active:opacity-90 disabled:opacity-60"
                >
                  {isResetting ? "Resetting…" : "Reset code"}
                </button>
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full h-11 rounded-xl border border-mfneutralsn-200 bg-white text-[14px] font-medium text-mfneutralsn-500 active:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
