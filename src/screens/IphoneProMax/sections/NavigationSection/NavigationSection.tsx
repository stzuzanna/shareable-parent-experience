import { CalendarIcon, SparklesIcon, ArrowRightIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { BASE_PATH } from "../../../../constants";
import { PostBookmarkButton } from "../../../../components/PostBookmarkButton/PostBookmarkButton";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationSectionProps {
  onShowRSVP: () => void;
  isSaved: boolean;
  onToggleSaved: () => void;
  isV3?: boolean;
  rsvpState: {
    hasReplied: boolean;
    isAttending: boolean | null;
    attendeeCount: number;
    comment: string;
  };
}

const talkingPoints = [
  "How is Abby settling socially — any friendships forming?",
  "The maths observation this week stood out — is she showing strong number sense generally?",
  "She skipped snack on Thursday — is that a pattern or a one-off?",
  "What areas would you like us to focus on supporting at home?",
  "Are there any developmental milestones you're tracking right now?",
  "How does Abby respond when things don't go her way — is she building resilience?",
  "What's working really well in her day that we could mirror at home?",
];

const TalkingPointsSheet: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [input, setInput] = useState("");
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl flex flex-col max-h-[88%]"
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-mfneutralsn-75">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-mfprimaryp-50">
              <SparklesIcon className="w-3.5 h-3.5 text-mfprimaryp-400" />
            </span>
            <span className="text-[15px] font-semibold text-mfneutralsn-500">Talking points for Thursday</span>
          </div>
          <button onClick={onClose} className="text-mfneutralsn-300 active:text-mfneutralsn-400">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-[13px] text-mfneutralsn-300 mb-4">
            Based on Abby's logs, observations, and activity this week — here are questions worth raising:
          </p>
          <div className="flex flex-col gap-2.5">
            {talkingPoints.map((p, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-mfneutralsn-50 border border-mfneutralsn-100">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-mfprimaryp-100 text-mfprimaryp-400 text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <span className="text-[14px] text-mfneutralsn-500 leading-snug">{p}</span>
              </div>
            ))}
          </div>
          <div className="h-px bg-mfneutralsn-75 my-4" />
          <p className="text-[12px] text-mfneutralsn-300 mb-3">Want to refine these?</p>
          <div className="flex flex-col gap-2">
            {["Focus on development areas only", "Make them shorter and simpler", "Add questions about meals & sleep", "Save as a note"].map((p) => (
              <button key={p} className="flex items-center justify-between px-4 py-3 rounded-xl bg-mfneutralsn-50 border border-mfneutralsn-100 text-left active:bg-mfneutralsn-100 transition-colors">
                <span className="text-[14px] text-mfneutralsn-500">{p}</span>
                <ArrowRightIcon className="w-4 h-4 text-mfneutralsn-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 pb-6 pt-2 border-t border-mfneutralsn-75">
          <div className="flex items-center gap-2 px-3 h-11 rounded-full border border-mfneutralsn-200 bg-mfneutralsn-50">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Or add your own question…" className="flex-1 bg-transparent text-[14px] text-mfneutralsn-500 placeholder:text-mfneutralsn-300 outline-none" />
            <button className="flex items-center justify-center w-7 h-7 rounded-full bg-mfprimaryp-400 flex-shrink-0">
              <ArrowRightIcon className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const NavigationSection: React.FC<NavigationSectionProps> = ({
  onShowRSVP,
  rsvpState,
  isSaved,
  onToggleSaved,
  isV3 = false,
}): JSX.Element => {
  const [showTalkingPoints, setShowTalkingPoints] = useState(false);
  return (
    <>
    <Card className="relative w-full bg-white rounded-lg">
      <PostBookmarkButton
        isSaved={isSaved}
        onToggle={onToggleSaved}
        className="absolute top-4 right-4 z-10"
      />
      <CardContent className="flex flex-col items-start gap-4 p-6">
        <div className="flex flex-col items-start gap-4 w-full">
          <div className="flex items-start gap-2.5 w-full pr-10">
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

          {isV3 && (
            <button
              onClick={() => setShowTalkingPoints(true)}
              className="w-full flex items-center justify-center gap-2 h-11 rounded-lg border border-mfprimaryp-200 bg-mfprimaryp-50 active:bg-mfprimaryp-100 transition-colors"
            >
              <img src={`${BASE_PATH}sidekick-icon.svg`} alt="Sidekick" style={{ width: 20, height: 20 }} />
              <span className="text-[14px] font-medium text-mfprimaryp-400">Generate talking points</span>
            </button>
          )}

          <div className="font-MF-body-text-micro-text font-[number:var(--MF-body-text-micro-text-font-weight)] text-mfneutralsn-300 text-[length:var(--MF-body-text-micro-text-font-size)] tracking-[var(--MF-body-text-micro-text-letter-spacing)] leading-[var(--MF-body-text-micro-text-line-height)] [font-style:var(--MF-body-text-micro-text-font-style)]">
            Recipients: Sandbox Childcare
          </div>
        </div>
      </CardContent>
    </Card>

    <AnimatePresence>
      {showTalkingPoints && <TalkingPointsSheet onClose={() => setShowTalkingPoints(false)} />}
    </AnimatePresence>
    </>
  );
};