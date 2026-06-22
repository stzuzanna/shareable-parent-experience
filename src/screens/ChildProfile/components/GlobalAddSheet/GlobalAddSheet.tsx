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
import { useGabVariant, setGabVariant, type GabVariant } from "../../../../hooks/useGabVariant";
import { SidekickChatSheet } from "../../../IphoneProMax/sections/SidekickInContext/SidekickInContext";
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
  const isPills = tabsVariant === "pills" || tabsVariant === "sidekick";
  const isV3 = tabsVariant === "sidekick";
  const gabVariant = useGabVariant();
  const [step, setStep] = useState<SheetStep>("actions");
  const [sidekickInput, setSidekickInput] = useState("");
  const [sidekickChatOpen, setSidekickChatOpen] = useState(false);

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
    if (tabsVariant !== "sidekick") setHomeTabsVariant("sidekick");
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

  // ─── Stable Sidekick input bar (defined here so it never remounts on re-render)
  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const sendSidekickFromBar = () => setSidekickChatOpen(true);
  const handleQuickPill = (pill: string) => { setSelectedPill(pill); setSidekickChatOpen(true); };

  const QUICK_PILLS = ["Drop off questions", "Summarise week", "Ask about the day"];

  const SidekickQuickPills = () => (
    <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2.5">
      {QUICK_PILLS.map((pill) => (
        <button
          key={pill}
          onClick={() => handleQuickPill(pill)}
          className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-white text-mfprimaryp-400 border border-mfprimaryp-200 active:bg-mfprimaryp-50 transition-colors whitespace-nowrap shadow-sm"
        >
          {pill}
        </button>
      ))}
    </div>
  );

  const SidekickInputBar = ({ className = "", showPills = true }: { className?: string; showPills?: boolean }) => (
    <div>
      {showPills && <SidekickQuickPills />}
      <div className={`flex items-center gap-2 h-12 px-3 rounded-full bg-white border border-mfneutralsn-75 shadow-elevation-elevation-4 ${className}`}>
        <MicIcon className="w-5 h-5 text-mfneutralsn-400 flex-shrink-0" />
        <input
          value={sidekickInput}
          onChange={(e) => setSidekickInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendSidekickFromBar(); }}
          placeholder="Ask Sidekick for help"
          className="flex-1 bg-transparent text-[14px] text-mfneutralsn-500 placeholder:text-mfneutralsn-300 outline-none min-w-0"
          autoComplete="off"
        />
        <button
          onClick={sendSidekickFromBar}
          aria-label="Send"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-mfprimaryp-400 text-white flex-shrink-0 active:opacity-80"
        >
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // ─── Floating overlay variants (list-sheet / grid / pills) ─────────────────
  // All three share: purple backdrop + sub-form steps fall through to the
  // bottom-sheet flow below.
  const activeGab = isV3 ? gabVariant : "pills";

  if (isPills && step === "actions") {

    // Grid: 3×2 tiles in a bottom sheet
    const gridItems = pillActions.slice(0, 6);

    // Pills: original floating pill list
    const stackedPills = [...pillActions].reverse();

    // Shared "Ask Sidekick" floating bar (pills variant)
    const SidekickBar = () => (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2, delay: 0.08 }}
        className={`${pos} bottom-20 left-3 right-3 z-[80]`}
      >
        <SidekickInputBar showPills={false} />
      </motion.div>
    );

    const sendSidekick = () => {
      setSidekickChatOpen(true);
    };

    // Inline variant switcher — rendered at the top of each variant's content
    const GabSwitcher = ({ dark = false }: { dark?: boolean }) => isV3 ? (
      <div className={`flex items-center gap-1.5 ${dark ? "" : "self-end"}`}>
        {([["arc", "List"], ["grid", "Grid"], ["pills", "Stacked"]] as [GabVariant, string][]).map(([v, label]) => (
          <button
            key={v}
            onClick={(e) => { e.stopPropagation(); setGabVariant(v); }}
            className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
              activeGab === v
                ? dark ? "bg-white text-mfneutralsn-500" : "bg-mfprimaryp-400 text-white"
                : dark ? "bg-white/20 text-white/70" : "bg-mfneutralsn-100 text-mfneutralsn-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    ) : null;

    // Shared floating GAB close button
    const GabClose = () => (
      <div className={`${pos} bottom-2 right-2 z-[85] rounded-2xl p-[1.5px] bg-gradient-to-br from-mfprimaryp-400 via-pink-300 to-cyan-300`}>
        <button
          onClick={handleClose}
          aria-label="Close quick actions"
          className="flex items-center justify-center w-14 h-14 rounded-[14px] bg-white"
        >
          <XIcon className="w-5 h-5 text-mfneutralsn-500" />
        </button>
      </div>
    );

    return (
      <>
      <AnimatePresence>
        {isOpen && !sidekickChatOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`${pos} inset-0 bg-[rgba(78,22,156,0.5)] backdrop-blur-[2px] z-[70]`}
              onClick={handleClose}
            />

            {/* ── A: Grouped list sheet ────────────────────────────────────── */}
            {activeGab === "arc" && (() => {
              type ListAction = { id: string; icon: React.ElementType; label: string; iconBg: string; iconColor: string };
              const groups: ListAction[][] = [
                [
                  { id: "checkin-pin", icon: KeyRoundIcon,     label: "Show check in pin",       iconBg: "bg-violet-100", iconColor: "text-violet-500" },
                  { id: "check-out",   icon: CheckIcon,         label: "Check out",               iconBg: "bg-red-100",    iconColor: "text-red-500"    },
                  { id: "request-care",icon: CalendarIcon,      label: "Request care",            iconBg: "bg-violet-100", iconColor: "text-violet-500" },
                ],
                [
                  { id: "meals",       icon: UtensilsIcon,      label: "Opt in and out of meals", iconBg: "bg-amber-100",  iconColor: "text-amber-500"  },
                  { id: "add-leave",   icon: CalendarX2Icon,    label: "Add leave",               iconBg: "bg-violet-100", iconColor: "text-violet-500" },
                ],
                [
                  { id: "message",     icon: MessageSquareIcon, label: "Send message",            iconBg: "bg-violet-100", iconColor: "text-violet-500" },
                  { id: "call-childcare", icon: PhoneIcon,      label: "Call childcare",          iconBg: "bg-green-100",  iconColor: "text-green-600"  },
                ],
              ];
              return (
                <>
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 28, stiffness: 350 }}
                    className={`${pos} bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[80] overflow-hidden flex flex-col`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Switcher + status line */}
                    <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                      <p className="text-[13px] text-mfneutralsn-300">Abby is checked in today</p>
                      <GabSwitcher />
                    </div>

                    {/* Grouped rows */}
                    <div className="flex flex-col overflow-y-auto">
                      {groups.map((group, gi) => (
                        <React.Fragment key={gi}>
                          {gi > 0 && <div className="h-px bg-gray-200 mx-5 my-1" />}
                          {group.map((p) => {
                            const Icon = p.icon;
                            return (
                              <button key={p.id} onClick={() => handleActionClick(p.id)}
                                className="flex items-center gap-4 px-5 py-3 active:bg-mfneutralsn-50 transition-colors text-left w-full">
                                <span className={`flex items-center justify-center w-9 h-9 rounded-xl ${p.iconBg} flex-shrink-0`}>
                                  <Icon className={`w-[18px] h-[18px] ${p.iconColor}`} />
                                </span>
                                <span className="text-[15px] text-mfneutralsn-500">{p.label}</span>
                              </button>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Ask Sidekick input bar */}
                    <div className="px-4 pt-3 pb-6 border-t border-gray-200 mt-1">
                      <SidekickInputBar />
                    </div>
                  </motion.div>
                </>
              );
            })()}

            {/* ── B: Grid sheet ────────────────────────────────────────────── */}
            {activeGab === "grid" && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 350 }}
                className={`${pos} bottom-0 left-0 right-0 z-[80] bg-white rounded-t-3xl`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-gray-200" />
                </div>
                <div className="px-5 pt-3 pb-8">
                  <div className="flex items-center justify-between mb-4">
                    <GabSwitcher />
                    <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center text-mfneutralsn-300 active:bg-mfneutralsn-50 rounded-full">
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {gridItems.map((p, i) => {
                      const Icon = p.icon;
                      return (
                        <motion.button
                          key={p.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.16, delay: 0.03 * i, type: "spring", damping: 20, stiffness: 360 }}
                          onClick={() => handleActionClick(p.id)}
                          className="flex flex-col items-center gap-2.5 py-5 rounded-2xl bg-mfneutralsn-50 active:bg-mfneutralsn-100 transition-colors"
                        >
                          <span className={`flex items-center justify-center w-12 h-12 rounded-2xl ${p.iconBg}`}>
                            <Icon className={`w-5 h-5 ${p.iconColor}`} />
                          </span>
                          <span className="text-[11px] font-semibold text-mfneutralsn-400 text-center leading-tight px-2">{p.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                  {/* Ask Sidekick input */}
                  <div className="mt-3">
                    <SidekickInputBar />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── C: Floating pills (original) ─────────────────────────────── */}
            {activeGab === "pills" && (
              <div className={`${pos} bottom-36 right-4 z-[80] flex flex-col items-end gap-3 pointer-events-none`}>
                {/* Variant switcher at top of stack */}
                {isV3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="pointer-events-auto flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1.5"
                  >
                    {([["arc", "List"], ["grid", "Grid"], ["pills", "Stacked"]] as [GabVariant, string][]).map(([v, label]) => (
                      <button
                        key={v}
                        onClick={(e) => { e.stopPropagation(); setGabVariant(v); }}
                        className={`px-2.5 py-1 rounded-full text-[12px] font-medium transition-colors ${
                          activeGab === v ? "bg-white text-mfneutralsn-500" : "text-white/70 active:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
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
            )}

            {/* "Ask Sidekick" bar + GAB close — pills variant only
                (list-sheet and grid handle these inline) */}
            {activeGab === "pills" && <SidekickBar />}
            {activeGab === "pills" && <GabClose />}
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sidekickChatOpen && (
          <SidekickChatSheet
            title="Sidekick"
            sentMessage={selectedPill ?? (sidekickInput.trim() || undefined)}
            prompts={selectedPill || sidekickInput.trim() ? [
              "Tell me more about this",
              "What should I do next?",
              "Draft a message about this",
              "Any patterns related to this?",
            ] : [
              "What should I ask at pickup today?",
              "Summarise Abby's week",
              "Draft a message to the key person",
              "What activities can I try at home?",
              "How is Abby doing with meals?",
            ]}
            onClose={() => { setSidekickChatOpen(false); setSidekickInput(""); setSelectedPill(null); }}
          />
        )}
      </AnimatePresence>
    </>
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
