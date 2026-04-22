import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { BASE_PATH } from "../../../../constants";

export const ChildProfileInfo = (): JSX.Element => {
  return (
    <div className="flex items-center gap-4 px-4 py-4 bg-white border-b border-gray-100">
      {/* Avatar with white ring matching Figma */}
      <div className="flex-shrink-0 rounded-full ring-[6px] ring-white shadow-sm">
        <Avatar className="w-20 h-20">
          <AvatarImage
            src={`${BASE_PATH}pexels-daisy-anderson-5581091-1.png`}
            alt="Tobin Freedman"
            className="object-cover"
          />
          <AvatarFallback className="text-lg">TF</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col gap-1.5 min-w-0">
        {/* Enrolled badge — blue per Figma (B50 bg, B400 border) */}
        <span className="inline-flex self-start items-center px-2 py-0.5 rounded-full text-[11px] border whitespace-nowrap"
          style={{ backgroundColor: "#f5faff", borderColor: "#067aef", color: "#2d2d39" }}>
          Enrolled - starting Mar 21
        </span>

        {/* Name — 16px Medium, not 20px bold */}
        <h2 className="text-base font-semibold text-mfneutralsn-500 leading-snug">
          Tobin Freedman
        </h2>

        {/* Subtitle — 12px micro text */}
        <p className="text-xs text-mfneutralsn-300 leading-tight">
          Bunnies room, 1 year 4 months
        </p>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 mt-0.5">
          {/* SEND / EAL — filled gray pill per Figma (#E2E2E9) */}
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium text-mfneutralsn-500"
            style={{ backgroundColor: "#e2e2e9" }}>
            SEND
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium text-mfneutralsn-500"
            style={{ backgroundColor: "#e2e2e9" }}>
            EAL
          </span>
          {/* Lactose — yellow bordered pill per Figma */}
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border"
            style={{ backgroundColor: "#fffcf5", borderColor: "#fac12e", color: "#2d2d39" }}>
            Lactose
          </span>
        </div>
      </div>
    </div>
  );
};
