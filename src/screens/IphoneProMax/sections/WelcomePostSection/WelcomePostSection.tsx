import { BASE_PATH } from '../../../../constants';
import React from "react";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

export const WelcomePostSection: React.FC = (): JSX.Element => {
  const messageContent = [
    "Welcome to Sandbox Childcare!",
    "",
    "Here at Sandbox Childcare we use the Famly app to keep you and your family updated. We'll share important updates, photos of your child, upcoming events, and much more right here on your newsfeed.",
    "",
    "We hope you love using it!",
    "",
    "Best regards,",
    "",
    "Sandbox Childcare",
  ];

  return (
    <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] rounded-[0px_0px_12px_12px] shadow-elevation-elevation-1">
      <div className="flex flex-col h-[68px] items-start gap-1 relative self-stretch w-full">
        <div className="flex h-[68px] items-center justify-between pl-4 pr-0 py-4 relative self-stretch w-full bg-mfneutralsn-0 rounded-[12px_12px_0px_0px]">
          <div className="flex items-center gap-2 relative flex-1 self-stretch grow">
            <Avatar className="w-11 h-11">
              <AvatarImage src={`${BASE_PATH}nursery-logo-1.svg`} alt="Sandbox Childcare" />
            </Avatar>

            <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-mfneutralsn-400 text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] whitespace-nowrap [font-style:var(--MF-body-text-body-emphasis-font-style)]">
                Sandbox Childcare
              </div>
              <div className="relative w-[129.21px] font-MF-body-text-body-small font-[number:var(--MF-body-text-body-small-font-weight)] text-brandneutralsn-200 text-[length:var(--MF-body-text-body-small-font-size)] tracking-[var(--MF-body-text-body-small-letter-spacing)] leading-[var(--MF-body-text-body-small-line-height)] [font-style:var(--MF-body-text-body-small-font-style)]">
                21 July, 13:03
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="inline-flex items-center gap-2 p-3 relative self-stretch flex-[0_0_auto] h-auto"
          >
            <img
              className="relative w-6 h-6 mt-[-6.00px] mb-[-6.00px]"
              alt="Dual state icons"
              src={`${BASE_PATH}dual-state-icons.svg`}
            />
          </Button>
        </div>
      </div>

      <CardContent className="flex items-center justify-between p-4 relative self-stretch w-full flex-[0_0_auto] bg-mfneutralsn-0">
        <div className="flex items-center gap-2 relative flex-1 grow">
          <div className="flex flex-col w-[329px] items-start gap-0.5">
            {messageContent.map((line, index) => (
              <div
                key={index}
                className="self-stretch [font-family:'Roboto',Helvetica] font-normal text-mfneutralsn-400 text-sm leading-[16.8px] relative tracking-[0]"
              >
                <span className="[font-family:'Roboto',Helvetica] font-normal text-[#2c2c39] text-sm tracking-[0] leading-[16.8px]">
                  {line || <br />}
                  {line && <br />}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

  <div className={`relative self-stretch w-full h-[321px] rounded-[0px_0px_12px_12px] bg-[url(${BASE_PATH}image.svg)] bg-cover bg-[50%_50%]`} />
    </Card>
  );
};
