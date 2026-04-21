import { BASE_PATH } from '../../../../constants';
import React from "react";

import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";

export const PostFeedSection = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();

  return (
    <header className={`flex flex-col w-full items-start relative ${!shouldShowFrame ? 'sticky top-0 z-50' : ''}`}>
      <div className={`flex items-end justify-center px-0 py-2 relative w-full bg-mfprimaryp-400 ${!shouldShowFrame ? 'hidden' : ''}`}>
        <div className="flex flex-col w-[106px] items-start justify-center gap-2 pl-5 pr-0 pt-0 pb-[3px] relative">
          <div className="relative w-[54px] h-[21px] rounded-3xl">
            <div className="absolute top-px left-[11px] [font-family:'Inter',Helvetica] font-medium text-mfneutralsn-0 text-base text-center tracking-[-0.32px] leading-[21px] whitespace-nowrap">
              9:41
            </div>
          </div>
        </div>

        <div className="flex flex-col h-8 items-center justify-center relative flex-1">
          <div className="relative flex-1 w-[108px] bg-mfneutralsn-0 rounded-[100px] opacity-0" />
        </div>

        <img
          className="relative w-[106px] h-full"
          alt="Right side"
          src={`${BASE_PATH}right-side.svg`}
        />
      </div>

      <nav className="flex h-12 items-center justify-between px-4 py-2 relative w-full bg-mfprimaryp-400">
        <div className="flex w-[192.5px] items-center gap-1 relative">
          <h1 className="w-fit mt-[-1.00px] font-MF-headings-h6-emphasis font-[number:var(--MF-headings-h6-emphasis-font-weight)] text-mfneutralsn-0 text-[length:var(--MF-headings-h6-emphasis-font-size)] leading-[var(--MF-headings-h6-emphasis-line-height)] whitespace-nowrap relative tracking-[var(--MF-headings-h6-emphasis-letter-spacing)] [font-style:var(--MF-headings-h6-emphasis-font-style)]">
            Newsfeed
          </h1>
        </div>

        <img
          className="relative flex-[0_0_auto]"
          alt="Frame"
          src={`${BASE_PATH}frame-1000003760.svg`}
        />
      </nav>
    </header>
  );
};
