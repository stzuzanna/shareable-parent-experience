import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { BASE_PATH } from "../../../../constants";

const KEY_PERSON_NAME = "Olivia Wilson";
const KEY_PERSON_AVATAR =
  "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400";

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
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center px-2 h-[22px] rounded-full text-[14px] leading-none border"
            style={{ backgroundColor: "#fffcf5", borderColor: "#fac12e", color: "#2d2d39" }}
          >
            Lactose
          </span>
          <span className="inline-flex items-center gap-1.5 pl-1 pr-2.5 h-[26px] rounded-full bg-white border border-mfneutralsn-200">
            <Avatar className="w-5 h-5">
              <AvatarImage src={KEY_PERSON_AVATAR} alt={KEY_PERSON_NAME} />
              <AvatarFallback className="text-[10px]">OW</AvatarFallback>
            </Avatar>
            <span className="text-[14px] text-mfneutralsn-500 leading-none">{KEY_PERSON_NAME}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
