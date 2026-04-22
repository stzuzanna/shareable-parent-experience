import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { BASE_PATH } from "../../../../constants";

const tags = [
  { label: "SEND", className: "border border-mfneutralsn-300 text-mfneutralsn-400" },
  { label: "EAL", className: "border border-mfneutralsn-300 text-mfneutralsn-400" },
  { label: "Lactose", className: "border border-mfyellowy-400 text-mfyellowy-400" },
];

export const ChildProfileInfo = (): JSX.Element => {
  return (
    <div className="flex items-center gap-4 px-4 py-4 bg-mfneutralsn-50 border-b border-gray-100">
      <Avatar className="w-24 h-24 flex-shrink-0">
        <AvatarImage
          src={`${BASE_PATH}pexels-daisy-anderson-5581091-1.png`}
          alt="Tobin Freedman"
          className="object-cover"
        />
        <AvatarFallback className="text-xl">TF</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1.5 min-w-0">
        <span className="inline-flex self-start items-center px-3 py-0.5 rounded-full text-xs font-medium border border-mfprimaryp-400 text-mfprimaryp-400 bg-transparent whitespace-nowrap">
          Enrolled - starting Mar 21
        </span>

        <h2 className="text-xl font-bold text-mfneutralsn-500 leading-tight">
          Tobin Freedman
        </h2>

        <p className="text-sm text-mfneutralsn-300">
          Bunnies room, 1 year 4 months
        </p>

        <div className="flex flex-wrap gap-1.5 mt-0.5">
          {tags.map((tag) => (
            <span
              key={tag.label}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-transparent ${tag.className}`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
