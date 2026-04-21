import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { BASE_PATH } from "../../../../constants";

const tags = [
  { label: "SEND", color: "bg-mfneutralsn-100 text-mfneutralsn-400" },
  { label: "EAL", color: "bg-mfneutralsn-100 text-mfneutralsn-400" },
  { label: "Lactose", color: "bg-mforangeo-100 text-mforangeo-500 border border-mforangeo-300" },
];

export const ChildProfileInfo = (): JSX.Element => {
  return (
    <div className="flex items-center gap-4 px-4 py-4 bg-white border-b border-gray-100">
      <Avatar className="w-20 h-20 flex-shrink-0">
        <AvatarImage
          src={`${BASE_PATH}infant--girl--profile-picture--caucasian--dark-hair.png`}
          alt="Tobin Freedman"
          className="object-cover"
        />
        <AvatarFallback className="text-xl">TF</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1 min-w-0">
        <span className="inline-flex self-start items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-mfprimaryp-300 text-mfprimaryp-500 bg-mfprimaryp-50 whitespace-nowrap">
          Enrolled · starting Mar 21
        </span>

        <h2 className="font-MF-headings-h4 font-[number:var(--MF-headings-h4-font-weight)] text-mfneutralsn-500 text-[length:var(--MF-headings-h4-font-size)] tracking-[var(--MF-headings-h4-letter-spacing)] leading-[var(--MF-headings-h4-line-height)] [font-style:var(--MF-headings-h4-font-style)]">
          Tobin Freedman
        </h2>

        <p className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-300 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
          Bunnies room, 1 year 4 months
        </p>

        <div className="flex flex-wrap gap-1 mt-0.5">
          {tags.map((tag) => (
            <span
              key={tag.label}
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${tag.color}`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
