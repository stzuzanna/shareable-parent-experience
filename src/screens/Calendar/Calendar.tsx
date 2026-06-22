import React from "react";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { BottomNav } from "../../components/BottomNav/BottomNav";
import { BASE_PATH } from "../../constants";
import { CalendarIcon } from "lucide-react";

export const Calendar = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();

  return (
    <div className={`flex flex-col bg-white ${shouldShowFrame ? "h-full" : "min-h-screen"}`}>
      {/* Header */}
      <header className="flex flex-col w-full bg-white border-b border-mfneutralsn-75">
        {shouldShowFrame && (
          <div className="flex items-center justify-between px-5 pt-2 pb-1">
            <span className="font-semibold text-mfneutralsn-500 text-[15px]">9:41</span>
            <img className="h-4" alt="Status icons" src={`${BASE_PATH}right-side.svg`} />
          </div>
        )}
        <div className="flex items-center px-4 py-3">
          <h1 className="text-[22px] font-bold text-mfneutralsn-500 tracking-tight">Calendar</h1>
        </div>
      </header>

      {/* Empty state */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 pb-20">
        <div className="w-14 h-14 rounded-2xl bg-mfprimaryp-50 flex items-center justify-center">
          <CalendarIcon className="w-7 h-7 text-mfprimaryp-400" />
        </div>
        <p className="text-[16px] font-semibold text-mfneutralsn-500">Coming soon</p>
        <p className="text-[13px] text-mfneutralsn-300 text-center leading-snug">
          Your calendar will show upcoming events, bookings, and important dates.
        </p>
      </div>

      <div className={!shouldShowFrame ? "sticky bottom-0 z-50" : ""}>
        <BottomNav />
      </div>
    </div>
  );
};
