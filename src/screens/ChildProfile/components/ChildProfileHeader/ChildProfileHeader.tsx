import { BASE_PATH } from '../../../../constants';
import React from "react";
import { SearchIcon } from "lucide-react";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";

export const ChildProfileHeader = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();

  return (
    <header className={`flex flex-col w-full bg-mfneutralsn-50 ${!shouldShowFrame ? 'sticky top-0 z-50' : ''}`}>
      {/* Status bar — only shown inside device frame */}
      <div className={`flex items-center justify-between px-5 pt-2 pb-1 ${!shouldShowFrame ? 'hidden' : ''}`}>
        <span className="[font-family:'Inter',Helvetica] font-semibold text-mfneutralsn-500 text-[15px] tracking-[-0.3px]">
          9:41
        </span>
        <img
          className="h-4"
          alt="Status icons"
          src={`${BASE_PATH}right-side.svg`}
        />
      </div>

      {/* Title row */}
      <div className="flex items-center justify-between px-5 pt-3 pb-4">
        <h1 className="text-[26px] font-bold text-mfneutralsn-500 tracking-tight leading-tight">
          Child profile
        </h1>
        <SearchIcon className="w-5 h-5 text-mfneutralsn-400" />
      </div>
    </header>
  );
};
