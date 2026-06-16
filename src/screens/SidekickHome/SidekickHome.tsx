import React, { useState } from "react";
import { motion } from "framer-motion";
import { SparklesIcon, ArrowLeftIcon, MicIcon, ArrowRightIcon } from "lucide-react";
import { BASE_PATH } from "../../constants";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { setHomeTabsVariant, useHomeTabsVariant, type HomeTabsVariant } from "../../hooks/useHomeTabsVariant";
import { BottomNav } from "../../components/BottomNav/BottomNav";

/**
 * SidekickHome — the third, slightly hidden version of the prototype.
 *
 * Reached by tapping the "Ask Sidekick for help" bar inside the pills GAB
 * (see GlobalAddSheet). It is intentionally a clean, self-contained canvas:
 * use it to build out in-context sidekick explorations. The "Back" control
 * returns to the pills version, and the testing-panel toggle also exposes it.
 */
export const SidekickHome = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const [draft, setDraft] = useState("");

  const tabsVariant = useHomeTabsVariant();
  const exitToPills = () => setHomeTabsVariant("pills");

  return (
    <div
      className={`flex flex-col bg-white ${shouldShowFrame ? "h-full" : "min-h-screen"} ${
        !shouldShowFrame ? "touch:h-screen" : ""
      }`}
    >
      {/* Status bar */}
      <div
        className={`flex items-center justify-between px-5 pt-2 pb-1 ${
          !shouldShowFrame ? "hidden" : ""
        }`}
      >
        <span className="[font-family:'Inter',Helvetica] font-semibold text-mfneutralsn-500 text-[15px] tracking-[-0.3px]">
          9:41
        </span>
        <img className="h-4" alt="Status icons" src={`${BASE_PATH}right-side.svg`} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-3 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={exitToPills}
            aria-label="Back"
            className="w-8 h-8 flex items-center justify-center rounded-full border border-mfneutralsn-200 text-mfneutralsn-500 active:bg-gray-50"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-mfprimaryp-50">
              <SparklesIcon className="w-4 h-4 text-mfprimaryp-400" />
            </span>
            <h1 className="text-[20px] font-bold text-mfneutralsn-500 tracking-tight leading-tight">
              Sidekick
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {([["underline", "1"], ["pills", "2"], ["sidekick", "3"]] as [HomeTabsVariant, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setHomeTabsVariant(id)}
              className={`w-5 h-5 rounded-full text-[11px] font-semibold transition-colors ${
                tabsVariant === id
                  ? "bg-mfprimaryp-400 text-white"
                  : "bg-mfneutralsn-100 text-mfneutralsn-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Exploration canvas — empty starting point to build on. */}
      <div className="flex-1 overflow-y-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-center justify-center text-center gap-3 py-16"
        >
          <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-mfprimaryp-50">
            <SparklesIcon className="w-7 h-7 text-mfprimaryp-400" />
          </span>
          <h2 className="text-[16px] font-semibold text-mfneutralsn-500">
            Sidekick exploration canvas
          </h2>
          <p className="text-[14px] text-mfneutralsn-300 max-w-[260px]">
            This is the third version of the prototype. Build your in-context
            sidekick explorations here.
          </p>
        </motion.div>
      </div>

      {/* Ask Sidekick composer */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 h-12 px-3 rounded-full bg-white shadow-elevation-elevation-4 border border-mfneutralsn-75">
          <MicIcon className="w-5 h-5 text-mfneutralsn-400 flex-shrink-0" />
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask Sidekick for help"
            className="flex-1 bg-transparent text-[14px] text-mfneutralsn-500 placeholder:text-mfneutralsn-300 focus:outline-none"
          />
          <button
            aria-label="Send"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-mfprimaryp-400 text-white flex-shrink-0"
          >
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation — same chrome as the pills version. */}
      <div className={!shouldShowFrame ? "sticky bottom-0 z-50" : ""}>
        <BottomNav />
      </div>
    </div>
  );
};
