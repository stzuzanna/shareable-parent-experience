import React from "react";
import { MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { useDeviceDetection } from "../../../../hooks/useDeviceDetection";
import { BASE_PATH } from "../../../../constants";

const KEY_PERSON_NAME = "Olivia Wilson";
const KEY_PERSON_AVATAR =
  "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400";

export const ChildProfileHeader = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();

  return (
    <div className="flex flex-col items-center bg-white px-4 pt-4 pb-5">
      {/* Status bar — only inside device frame */}
      {shouldShowFrame && (
        <div className="flex items-center justify-between w-full px-1 mb-3">
          <span className="font-semibold text-mfneutralsn-500 text-[15px] tracking-[-0.3px]">
            9:41
          </span>
          <img className="h-4" alt="Status icons" src={`${BASE_PATH}right-side.svg`} />
        </div>
      )}

      {/* Avatar with check-in badge */}
      <div className="relative mb-4">
        <Avatar className="w-[88px] h-[88px]">
          <AvatarImage
            src={`${BASE_PATH}pexels-daisy-anderson-5581091-1.png`}
            alt="Abby Freedman"
            className="object-cover"
          />
          <AvatarFallback className="text-lg">AF</AvatarFallback>
        </Avatar>
        <div className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Name */}
      <h2 className="text-[22px] font-semibold text-mfneutralsn-500 leading-tight text-center">
        Abby Freedman
      </h2>

      {/* Room + age */}
      <p className="text-[14px] text-mfneutralsn-300 mt-1 text-center">
        Bunnies room · 1 year 4 months
      </p>

      {/* Tags: key person + allergy */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
        <div className="flex items-center gap-1.5 pl-1 pr-3 h-7 rounded-full border border-mfneutralsn-200 bg-white">
          <Avatar className="w-5 h-5">
            <AvatarImage src={KEY_PERSON_AVATAR} alt={KEY_PERSON_NAME} />
            <AvatarFallback className="text-[10px]">OW</AvatarFallback>
          </Avatar>
          <span className="text-[13px] text-mfneutralsn-500 leading-none">{KEY_PERSON_NAME}</span>
        </div>
        <span
          className="inline-flex items-center px-2.5 h-7 rounded-full text-[13px] leading-none border"
          style={{ backgroundColor: "#fffcf5", borderColor: "#fac12e", color: "#2d2d39" }}
        >
          Lactose
        </span>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center text-mfneutralsn-400">
          <MoreHorizontalIcon className="w-4 h-4" />
        </button>
        <button className="h-9 px-5 rounded-full bg-mfprimaryp-400 flex items-center gap-1.5 text-white text-[14px] font-medium">
          <PlusIcon className="w-4 h-4" />
          Add
        </button>
      </div>
    </div>
  );
};
