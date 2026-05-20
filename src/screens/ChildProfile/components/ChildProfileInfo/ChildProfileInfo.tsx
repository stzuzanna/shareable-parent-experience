import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { BASE_PATH } from "../../../../constants";

export const ChildProfileInfo = (): JSX.Element => {
  return (
    <div className="flex items-center gap-3 px-4 pt-4 pb-4">
      <Avatar className="w-[88px] h-[88px] flex-shrink-0">
        <AvatarImage
          src={`${BASE_PATH}pexels-daisy-anderson-5581091-1.png`}
          alt="Abby Freedman"
          className="object-cover"
        />
        <AvatarFallback className="text-lg">AF</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div>
          <h2 className="text-[20px] font-medium text-mfneutralsn-500 leading-tight">
            Abby Freedman
          </h2>
          <p className="text-[14px] text-mfneutralsn-300 leading-snug mt-0.5">
            Bunnies room, 1 year 4 months
          </p>
        </div>
        <div className="flex items-center">
          <span
            className="inline-flex items-center px-2 h-[20px] rounded-full text-[12px] leading-none border"
            style={{ backgroundColor: "#fffcf5", borderColor: "#fac12e", color: "#2d2d39" }}
          >
            Lactose
          </span>
        </div>
      </div>
    </div>
  );
};
