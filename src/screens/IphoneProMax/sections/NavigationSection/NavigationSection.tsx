import { CalendarIcon } from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { BASE_PATH } from "../../../../constants";

interface NavigationSectionProps {
  onShowRSVP: () => void;
  rsvpState: {
    hasReplied: boolean;
    isAttending: boolean | null;
    attendeeCount: number;
    comment: string;
  };
}

export const NavigationSection: React.FC<NavigationSectionProps> = ({ onShowRSVP, rsvpState }): JSX.Element => {
  return (
    <Card className="w-full bg-white rounded-lg">
      <CardContent className="flex flex-col items-start gap-4 p-6">
        <div className="flex flex-col items-start gap-4 w-full">
          <div className="flex items-start gap-2.5 w-full">
            <Avatar className="w-11 h-11">
              <AvatarImage
                src={`${BASE_PATH}avatar---rounded---xl.png`}
                alt="Claire Potter"
              />
              <AvatarFallback>CP</AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start">
              <div className="[font-family:'Matter-SemiBold',Helvetica] font-normal text-mfneutralsn-400 text-base tracking-[0] leading-4">
                <span className="font-semibold leading-[19.2px]">
                  Claire Potter{" "}
                </span>
                <span className="font-modern-famly-body-text-body leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)] font-[number:var(--modern-famly-body-text-body-font-weight)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] text-[length:var(--modern-famly-body-text-body-font-size)]">
                  invited you to an event
                </span>
                <span className="font-semibold leading-[19.2px]">. </span>
              </div>

              <div className="w-[129.21px] font-MF-body-text-body-small font-[number:var(--MF-body-text-body-small-font-weight)] text-brandneutralsn-200 text-[length:var(--MF-body-text-body-small-font-size)] tracking-[var(--MF-body-text-body-small-letter-spacing)] leading-[var(--MF-body-text-body-small-line-height)] [font-style:var(--MF-body-text-body-small-font-style)]">
                5 hours ago
              </div>
            </div>
          </div>

          <div className="w-full">
            <Card className="bg-mfneutralsn-50 rounded-md">
              <CardContent className="p-4 relative">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarIcon className="w-4 h-4" />
                  <div className="font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-black text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] [font-style:var(--MF-body-text-body-emphasis-font-style)]">
                    Parent teacher conference
                  </div>
                </div>

                <div className="mb-2 font-MF-body-text-body-small font-[number:var(--MF-body-text-body-small-font-weight)] text-brandneutralsn-200 text-[length:var(--MF-body-text-body-small-font-size)] tracking-[var(--MF-body-text-body-small-letter-spacing)] leading-[var(--MF-body-text-body-small-line-height)] [font-style:var(--MF-body-text-body-small-font-style)]">
                  Thu, 4th Sep 11:30am
                </div>

                <div className="font-MF-body-text-body-small font-[number:var(--MF-body-text-body-small-font-weight)] text-mfneutralsn-500 text-[length:var(--MF-body-text-body-small-font-size)] tracking-[var(--MF-body-text-body-small-letter-spacing)] leading-[var(--MF-body-text-body-small-line-height)] [font-style:var(--MF-body-text-body-small-font-style)]">
                  RSVP: Wed, 3rd Sep
                </div>
              </CardContent>
            </Card>
          </div>

          <Button 
            onClick={onShowRSVP}
            variant={rsvpState.hasReplied ? "outline" : "default"}
            className={`w-full h-12 rounded-lg font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)] ${
              rsvpState.hasReplied 
                ? 'bg-mfneutralsn-0 border-[#efeff4] text-mfneutralsn-400 hover:bg-gray-50' 
                : 'bg-mfprimaryp-400 text-mfneutralsn-0 hover:bg-mfprimaryp-400/90'
            }`}
          >
            {rsvpState.hasReplied ? 'Edit reply' : 'Show and RSVP'}
          </Button>

          <div className="font-MF-body-text-micro-text font-[number:var(--MF-body-text-micro-text-font-weight)] text-mfneutralsn-300 text-[length:var(--MF-body-text-micro-text-font-size)] tracking-[var(--MF-body-text-micro-text-letter-spacing)] leading-[var(--MF-body-text-micro-text-line-height)] [font-style:var(--MF-body-text-micro-text-font-style)]">
            Recipients: Sandbox Childcare
          </div>
        </div>
      </CardContent>
    </Card>
  );
};