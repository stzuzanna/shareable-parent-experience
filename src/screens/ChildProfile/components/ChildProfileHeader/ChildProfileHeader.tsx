import { BASE_PATH } from '../../../../constants';
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";

export const ChildProfileHeader = (): JSX.Element => {
  const navigate = useNavigate();
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="w-6 h-6 p-0"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>

        <h1 className="font-MF-headings-h6-emphasis font-[number:var(--MF-headings-h6-emphasis-font-weight)] text-mfneutralsn-0 text-[length:var(--MF-headings-h6-emphasis-font-size)] leading-[var(--MF-headings-h6-emphasis-line-height)] tracking-[var(--MF-headings-h6-emphasis-letter-spacing)] [font-style:var(--MF-headings-h6-emphasis-font-style)]">
          Child profile
        </h1>

        <div className="w-6 h-6" />
      </nav>
    </header>
  );
};