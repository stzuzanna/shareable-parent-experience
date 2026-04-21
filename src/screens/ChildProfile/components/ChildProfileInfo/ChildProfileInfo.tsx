import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { BASE_PATH } from "../../../../constants";

export const ChildProfileInfo = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-8 bg-white">
      <Avatar className="w-32 h-32">
        <AvatarImage
          src={`${BASE_PATH}infant--girl--profile-picture--caucasian--dark-hair.png`}
          alt="Amanda Freedman"
          className="object-cover"
        />
        <AvatarFallback className="text-2xl">AF</AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-center gap-2">
        <h2 className="font-MF-headings-h4 font-[number:var(--MF-headings-h4-font-weight)] text-mfneutralsn-500 text-[length:var(--MF-headings-h4-font-size)] tracking-[var(--MF-headings-h4-letter-spacing)] leading-[var(--MF-headings-h4-line-height)] [font-style:var(--MF-headings-h4-font-style)]">
          Amanda Freedman
        </h2>
        
        <div className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-300 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
          Bunnies room, 1 years 4 months
        </div>
      </div>
    </div>
  );
};