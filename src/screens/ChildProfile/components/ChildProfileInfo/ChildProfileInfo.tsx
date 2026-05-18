import React from "react";
import { SettingsIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { BASE_PATH } from "../../../../constants";

export const ChildProfileInfo = (): JSX.Element => {
  return (
    <div className="flex items-center gap-3 px-4 pt-4 pb-4">
      <Avatar className="w-[88px] h-[88px] flex-shrink-0">
        <AvatarImage
          src={`${BASE_PATH}pexels-daisy-anderson-5581091-1.png`}
          alt="Tobin Freedman"
          className="object-cover"
        />
        <AvatarFallback className="text-lg">TF</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div>
          <h2 className="text-[16px] font-medium text-mfneutralsn-500 leading-snug">
            Tobin Freedman
          </h2>
          <p className="text-[12px] text-mfneutralsn-300 leading-tight">
            Bunnies room, 1 year 4 months
          </p>
        </div>
        <div className="flex items-center">
          <span
            className="inline-flex items-center px-2 h-[18px] rounded-full text-[11px] leading-none border"
            style={{ backgroundColor: "#fffcf5", borderColor: "#fac12e", color: "#2d2d39" }}
          >
            Lactose
          </span>
        </div>
      </div>

      <button
        aria-label="Profile settings"
        className="w-12 h-12 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0 active:bg-gray-50"
      >
        <SettingsIcon className="w-5 h-5 text-mfneutralsn-400" />
      </button>
    </div>
  );
};
