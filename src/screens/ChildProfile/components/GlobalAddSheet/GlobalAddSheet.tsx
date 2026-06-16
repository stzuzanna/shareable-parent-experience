import React, { useEffect, useState } from "react";
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
  PhoneIcon,
  MicIcon,
  ArrowRightIcon,
} from "lucide-react";
import { useProfileVariant, setProfileVariant, type ProfileVariant } from "../../../../hooks/useProfileVariant";
import {
  useHomeTabsVariant,
  setHomeTabsVariant,
  type HomeTabsVariant,
} from "../../../../hooks/useHomeTabsVariant";
import { AddLeaveFormContent } from "../../../../components/AddLeaveSheet/AddLeaveSheet";
import { RequestCareFormContent } from "../../../../components/RequestCareSheet/RequestCareFormContent";
import { MealBookingsFormContent } from "../../../../components/MealBookingsSheet/MealBookingsFormContent";
import { PinCodesFormContent } from "../../../../components/PinCodesSheet/PinCodesFormContent";

type SheetStep = "actions" | "add-leave" | "request-care" | "meals" | "checkin-pin";

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

// Pills variant — matches Figma 1578-69490: top→bottom Request care, Show check in pin,
// Opt in and out of meals, Check out, Send message, Call childcare, Add leave. Each pill
// renders with its label on the left and a coloured circular icon on the right.
interface PillAction {
  id: string;
  icon: React.ElementType;
  label: string;
  iconBg: string;
  iconColor: string;
}

const pillActions: PillAction[] = [
  { id: "request-care", icon: CalendarIcon, label: "Request care", iconBg: "bg-mfprimaryp-50", iconColor: "text-mfprimaryp-400" },
  { id: "checkin-pin", icon: KeyRoundIcon, label: "Show check in pin", iconBg: "bg-mfprimaryp-50", iconColor: "text-mfprimaryp-400" },
  { id: "meals", icon: UtensilsIcon, label: "Opt in and out of meals", iconBg: "bg-mfyellowy-50", iconColor: "text-mfyellowy-400" },
  { id: "check-out", icon: CheckIcon, label: "Check out", iconBg: "bg-red-50", iconColor: "text-red-500" },
  { id: "message", icon: MessageSquareIcon, label: "Send message", iconBg: "bg-mfprimaryp-50", iconColor: "text-mfprimaryp-400" },
  { id: "call-childcare", icon: PhoneIcon, label: "Call childcare", iconBg: "bg-green-50", iconColor: "text-green-600" },
  { id: "add-leave", icon: CalendarX2Icon, label: "Add leave", iconBg: "bg-mfprimaryp-50", iconColor: "text-mfprimaryp-400" },
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
  const tabsVariant = useHomeTabsVariant();
  const isPills = tabsVariant === "pills";
  const [step, setStep] = useState<SheetStep>("actions");

  useEffect(() => {
    if (!isOpen) {
      setStep("actions");
    }
  }, [isOpen]);

  const handleClose = () => {
    setStep("actions");
    onClose();
  };

  // Slightly hidden switch into the third prototype version. Closes the GAB
  // first so we don't leave the sheet open behind the SidekickHome canvas.
  const openSidekick = () => {
    handleClose();
    setHomeTabsVariant("sidekick");
  };

  const handleActionClick = (actionId: string) => {
    if (actionId === "add-leave") {
      setStep("add-leave");
      return;
    }
    if (actionId === "request-care") {
      setStep("request-care");
      return;
    }
    if (actionId === "meals") {
      setStep("meals");
      return;
    }
    if (actionId === "checkin-pin") {
      setStep("checkin-pin");
      return;
    }
    handleClose();
    onAction(actionId);
  };

  // Floating-pills variant: when in pills home-tabs mode AND on the actions step,
  // render the actions as floating pills cascading from above the GAB sparkle
  // button rather than as a bottom sheet. Sub-form steps (add-leave, request-care…)
  // still fall through to the bottom-sheet flow below.
  if (isPills && step === "actions") {
    // Pills stacked bottom-to-top in the Figma; we reverse so the natural visual
    // top-to-bottom order (Request care → Add leave) matches the list above.
    const stackedPills = [...pillActions].reverse();
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`${pos} inset-0 bg-[rgba(78,22,156,0.5)] backdrop-blur-[2px] z-[70]`}
              onClick={handleClose}
            />

            {/* Floating pills cascading up from above the bottom nav, right-aligned.
                bottom-36 = lowest pill sits ~16px above the Ask Sidekick input
                (Sidekick at bottom-20 + h-12 → top edge at 128px). */}
            <div className={`${pos} bottom-36 right-4 z-[80] flex flex-col items-end gap-3 pointer-events-none`}>
              {stackedPills.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.button
                    key={p.id}
                    initial={{ opacity: 0, y: 16, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    transition={{ duration: 0.22, delay: 0.035 * i, type: "spring", damping: 22, stiffness: 320 }}
                    onClick={() => handleActionClick(p.id)}
                    className="pointer-events-auto flex items-center gap-3 pl-4 pr-1.5 h-11 rounded-full bg-white shadow-elevation-elevation-4 border border-mfneutralsn-75 active:bg-gray-50"
                  >
                    <span className="text-[14px] font-medium text-mfneutralsn-500 whitespace-nowrap">{p.label}</span>
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full ${p.iconBg}`}>
                      <Icon className={`w-4 h-4 ${p.iconColor}`} />
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* "Ask Sidekick for help" bar, sitting just above the bottom nav.
                Slightly hidden switch: tapping the bar (or its send button) opens
                the third "sidekick" version of the prototype, used for in-context
                sidekick explorations. */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, delay: 0.08 }}
              className={`${pos} bottom-20 left-3 right-3 z-[80] flex items-center gap-2 h-12 px-3 rounded-full bg-white shadow-elevation-elevation-4 border border-mfneutralsn-75`}
            >
              <button
                type="button"
                onClick={openSidekick}
                aria-label="Ask Sidekick for help"
                className="flex-1 flex items-center gap-2 min-w-0 text-left"
              >
                <MicIcon className="w-5 h-5 text-mfneutralsn-400 flex-shrink-0" />
                <span className="flex-1 truncate text-[14px] text-mfneutralsn-300">
                  Ask Sidekick for help
                </span>
              </button>
              <button
                onClick={openSidekick}
                aria-label="Send"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-mfprimaryp-400 text-white flex-shrink-0"
              >
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Floating GAB close (X) button — lifted above the backdrop so the
                rest of the bottom nav stays dimmed but the close affordance
                stays bright and tappable. Positioned to overlay the GAB
                sparkle slot in BottomNav (right-2 bottom-2, w-14 h-14 with the
                gradient outline). */}
            <div className={`${pos} bottom-2 right-2 z-[85] rounded-2xl p-[1.5px] bg-gradient-to-br from-mfprimaryp-400 via-pink-300 to-cyan-300`}>
              <button
                onClick={handleClose}
                aria-label="Close quick actions"
                className="flex items-center justify-center w-14 h-14 rounded-[14px] bg-white"
              >
                <XIcon className="w-5 h-5 text-mfneutralsn-500" />
              </button>
            </div>
          </>
        )}
      </AnimatePresence>
    );
  }

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
            onClick={handleClose}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className={`${pos} bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[80] max-h-[85%] overflow-hidden flex flex-col`}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {step === "actions" ? (
                <motion.div
                  key="actions"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-y-auto min-h-0 flex-1"
                >
                  <div className="flex items-center justify-between px-5 pt-2 pb-4">
                    <h2 className="text-[16px] font-medium text-mfneutralsn-500">Choose what to do</h2>
                    <button
                      onClick={handleClose}
                      aria-label="Close"
                      className="w-7 h-7 flex items-center justify-center text-mfneutralsn-400 active:bg-gray-50 rounded-full"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 px-4 pb-6">
                    {actions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.id}
                          className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-mfneutralsn-75 bg-white active:bg-gray-50 transition-colors text-left w-full"
                          onClick={() => {
                            if (action.id === "add-leave") {
                              setStep("add-leave");
                              return;
                            }
                            if (action.id === "request-care") {
                              setStep("request-care");
                              return;
                            }
                            if (action.id === "meals") {
                              setStep("meals");
                              return;
                            }
                            if (action.id === "checkin-pin") {
                              setStep("checkin-pin");
                              return;
                            }
                            handleClose();
                            onAction(action.id);
                          }}
                        >
                          <Icon className={`w-5 h-5 flex-shrink-0 ${action.iconColor ?? "text-mfneutralsn-400"}`} />
                          <span className="text-[14px] font-medium text-mfneutralsn-500">{action.label}</span>
                        </button>
                      );
                    })}

                    <button
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-mfprimaryp-400 bg-mfprimaryp-50 active:bg-mfprimaryp-100 transition-colors text-left w-full"
                      onClick={() => {
                        handleClose();
                        onAction("feedback");
                      }}
                    >
                      <SmileIcon className="w-5 h-5 text-mfprimaryp-400 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[14px] font-medium text-mfprimaryp-400">Let us know what you think</span>
                        <span className="text-[14px] text-mfprimaryp-300 mt-0.5">Your feedback helps us improve</span>
                      </div>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col min-h-0 overflow-y-auto"
                >
                  {step === "add-leave" && (
                    <AddLeaveFormContent onBack={() => setStep("actions")} onClose={handleClose} />
                  )}
                  {step === "request-care" && (
                    <RequestCareFormContent onBack={() => setStep("actions")} onClose={handleClose} />
                  )}
                  {step === "meals" && (
                    <MealBookingsFormContent onBack={() => setStep("actions")} onClose={handleClose} />
                  )}
                  {step === "checkin-pin" && (
                    <PinCodesFormContent onBack={() => setStep("actions")} onClose={handleClose} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const HomeTabsToggle: React.FC = () => {
  const variant = useHomeTabsVariant();
  const options: { id: HomeTabsVariant; label: string }[] = [
    { id: "underline", label: "Underline tabs" },
    { id: "pills", label: "Pills" },
    { id: "sidekick", label: "Sidekick" },
  ];
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[14px] text-mfneutralsn-400">Home tabs style</span>
      <div className="flex items-center gap-1 p-1 rounded-full bg-mfneutralsn-75 self-start">
        {options.map((opt) => {
          const isActive = variant === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setHomeTabsVariant(opt.id)}
              className={`px-4 py-1.5 rounded-full text-[14px] font-medium transition-colors ${
                isActive
                  ? "bg-white text-mfprimaryp-400 shadow-sm"
                  : "bg-transparent text-mfneutralsn-400"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const VariantDots: React.FC = () => {
  const variant = useProfileVariant();
  const variants: { id: ProfileVariant; label: string }[] = [
    { id: "v1", label: "About / Health and safety / Documents" },
    { id: "v2", label: "About / Bookings / Documents" },
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
      <span className="text-[14px] text-mfneutralsn-300">{variants.find((v) => v.id === variant)?.label}</span>
    </div>
  );
};
