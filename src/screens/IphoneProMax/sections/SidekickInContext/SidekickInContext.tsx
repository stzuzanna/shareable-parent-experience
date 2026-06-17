import React, { useState } from "react";
import { SparklesIcon, XIcon, ArrowRightIcon, ChevronRightIcon, CalendarDaysIcon, BookOpenIcon, UtensilsIcon, TrendingUpIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── ConceptBadge ─────────────────────────────────────────────────────────────
// Small letter badge to identify which ideation concept each element belongs to.

const ConceptBadge: React.FC<{ letter: string }> = ({ letter }) => (
  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-mfprimaryp-400 text-white text-[9px] font-bold flex-shrink-0">
    {letter}
  </span>
);

// ─── SidekickContextCard ──────────────────────────────────────────────────────
// Reusable primitive for any in-context Sidekick suggestion.
// Drop it anywhere in the app: observations, meal logs, photos, activities, etc.

export interface SidekickAction {
  label: string;
  primary?: boolean;
}

export interface SidekickContextCardProps {
  message: string;
  actions: SidekickAction[];
  chatTitle?: string;
  chatPrompts?: string[];
  /** Optional concept letter badge (A–D) shown for prototype testing */
  conceptBadge?: string;
  /** Override label for the "Sidekick noticed" eyebrow. Defaults to "Sidekick noticed" */
  eyebrow?: string;
  onDismiss?: () => void;
  className?: string;
}

export const SidekickContextCard: React.FC<SidekickContextCardProps> = ({
  message,
  actions,
  chatTitle = "Sidekick",
  chatPrompts = [],
  conceptBadge,
  eyebrow = "Sidekick noticed",
  onDismiss,
  className = "",
}) => {
  const [openChat, setOpenChat] = useState(false);

  return (
    <>
      <div className={`rounded-2xl bg-gradient-to-br from-mfprimaryp-50 to-white border border-mfprimaryp-100 p-3.5 ${className}`}>
        <div className="flex items-start gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-mfprimaryp-100 flex-shrink-0 mt-0.5">
            <SparklesIcon className="w-3.5 h-3.5 text-mfprimaryp-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[11px] font-semibold text-mfprimaryp-400 uppercase tracking-wide">
                {eyebrow}
              </span>
              {conceptBadge && <ConceptBadge letter={conceptBadge} />}
            </div>
            <p className="text-[13px] text-mfneutralsn-500 leading-snug">{message}</p>
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              {actions.map((a, i) => (
                <button
                  key={a.label}
                  onClick={() => setOpenChat(true)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                    a.primary ?? i === 0
                      ? "bg-mfprimaryp-400 text-white active:bg-mfprimaryp-500"
                      : "bg-white border border-mfprimaryp-200 text-mfprimaryp-400 active:bg-mfprimaryp-50"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          {onDismiss && (
            <button onClick={onDismiss} className="text-mfneutralsn-300 active:text-mfneutralsn-400 -mt-0.5 -mr-0.5 flex-shrink-0">
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {openChat && (
          <SidekickChatSheet
            title={chatTitle}
            prompts={chatPrompts.length ? chatPrompts : actions.map((a) => a.label)}
            onClose={() => setOpenChat(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Observation suggestions ─────────────────────────────────────────────────
// Shown below each learning/observation post in v3.
// Suggestions are contextual based on the post's development areas.

const suggestionsByArea: Record<string, { message: string; prompts: string[] }> = {
  Mathematics: {
    message: "Abby is exploring early maths — here are some home activities to keep it going.",
    prompts: ["Counting games to try at home", "Maths in everyday routines", "Board games for number sense", "How to talk about shapes on a walk"],
  },
  Literacy: {
    message: "Abby is building literacy skills — want ideas for reading time at home?",
    prompts: ["Books to read together this week", "Games that build phonics", "How to make storytime interactive", "Writing activities for toddlers"],
  },
  "Communication & language": {
    message: "Abby is growing her communication — here are ways to spark more conversation at home.",
    prompts: ["Conversation starters for little ones", "Songs that build vocabulary", "How to extend play narratives", "Questions to ask after nursery"],
  },
  "Physical development": {
    message: "Abby is building physical skills — try these at home to support her development.",
    prompts: ["Outdoor activities for gross motor skills", "Fine motor activities with household items", "Movement games for indoors", "How much active play does she need?"],
  },
  "Personal, social & emotional": {
    message: "Abby is working on social and emotional skills — here are ways to support her at home.",
    prompts: ["Helping with big feelings", "Role play games for empathy", "How to talk about friendships", "Calming strategies for toddlers"],
  },
};

const fallbackSuggestion = {
  message: "Sidekick has some ideas to help you support this at home.",
  prompts: ["Activities to try this week", "How to talk about what happened today", "Ask about this at pickup", "What to look for next"],
};

export const SidekickObservationSuggestion: React.FC<{ areas: string[]; postId: string }> = ({ areas, postId }) => {
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) return null;

  const match = areas.find((a) => suggestionsByArea[a]);
  const content = match ? suggestionsByArea[match] : fallbackSuggestion;
  const areaLabel = match ?? areas[0] ?? "this area";

  return (
    <SidekickContextCard
      eyebrow="Try this at home"
      message={content.message}
      actions={[{ label: `Ideas for ${areaLabel}`, primary: true }, { label: "Ask something else" }]}
      chatTitle={`Supporting ${areaLabel}`}
      chatPrompts={content.prompts}
      conceptBadge="D"
      onDismiss={() => setDismissed(true)}
      className="mt-1"
    />
  );
};

// ─── A: Proactive Collections Strip (Photos tab) ──────────────────────────────

const photoCollections = [
  {
    id: "garden",
    label: "In the garden",
    count: 8,
    thumbs: [
      "https://images.pexels.com/photos/8613264/pexels-photo-8613264.jpeg?auto=compress&cs=tinysrgb&w=200",
      "https://images.pexels.com/photos/8613097/pexels-photo-8613097.jpeg?auto=compress&cs=tinysrgb&w=200",
      "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=200",
    ],
  },
  {
    id: "animals",
    label: "With animals",
    count: 5,
    thumbs: [
      "https://images.pexels.com/photos/8613082/pexels-photo-8613082.jpeg?auto=compress&cs=tinysrgb&w=200",
      "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=200",
      "https://images.pexels.com/photos/8613264/pexels-photo-8613264.jpeg?auto=compress&cs=tinysrgb&w=200",
    ],
  },
  {
    id: "art",
    label: "Art time",
    count: 4,
    thumbs: [
      "https://images.pexels.com/photos/8613097/pexels-photo-8613097.jpeg?auto=compress&cs=tinysrgb&w=200",
      "https://images.pexels.com/photos/8613082/pexels-photo-8613082.jpeg?auto=compress&cs=tinysrgb&w=200",
      "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=200",
    ],
  },
];

export const SidekickCollectionsStrip: React.FC = () => {
  const [openChat, setOpenChat] = useState(false);

  return (
    <div className="px-3 pt-3 pb-1">
      <div className="flex items-center gap-1.5 mb-2.5 px-0.5">
        <SparklesIcon className="w-3.5 h-3.5 text-mfprimaryp-400" />
        <span className="text-[12px] font-semibold text-mfprimaryp-400 tracking-wide uppercase">
          Sidekick collections
        </span>
        <ConceptBadge letter="A" />
      </div>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {photoCollections.map((col) => (
          <button
            key={col.id}
            className="flex-shrink-0 w-[130px] rounded-2xl overflow-hidden border border-mfneutralsn-100 bg-white shadow-sm active:scale-95 transition-transform text-left"
          >
            <div className="relative h-[76px] bg-mfneutralsn-75">
              {col.thumbs.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  style={{
                    transform: `rotate(${(i - 1) * 4}deg) scale(${0.82 - i * 0.04})`,
                    zIndex: col.thumbs.length - i,
                    borderRadius: 8,
                  }}
                />
              ))}
            </div>
            <div className="px-2.5 py-2">
              <p className="text-[12px] font-semibold text-mfneutralsn-500 leading-tight">{col.label}</p>
              <p className="text-[11px] text-mfneutralsn-300">{col.count} photos</p>
            </div>
          </button>
        ))}

        <button
          onClick={() => setOpenChat(true)}
          className="flex-shrink-0 w-[120px] rounded-2xl border border-dashed border-mfprimaryp-300 bg-mfprimaryp-50 flex flex-col items-center justify-center gap-1.5 px-3 py-4 active:bg-mfprimaryp-100 transition-colors"
        >
          <SparklesIcon className="w-5 h-5 text-mfprimaryp-400" />
          <p className="text-[12px] font-semibold text-mfprimaryp-400 text-center leading-tight">Make memories</p>
        </button>
      </div>

      <AnimatePresence>
        {openChat && (
          <SidekickChatSheet
            title="Make a memory"
            prompts={["Create a 'Garden Adventures' album", "Make a slideshow for the week", "Pick the best 5 photos to share", "Write captions for today's photos"]}
            onClose={() => setOpenChat(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── B: "Sidekick noticed" banners — built on SidekickContextCard ─────────────

const bannerContent = {
  photos: {
    message: "Abby had 8 outdoor photos this week — want to save them as a memory?",
    actions: [{ label: "Save collection", primary: true }, { label: "Tell me more" }],
    chatTitle: "Save a collection",
    chatPrompts: ["Create a garden collection", "Pick the best 8 photos", "Write a caption for the week", "Share with family"],
  },
  activity: {
    message: "Abby slept less than usual 3 days this week. Worth a note to the team?",
    actions: [{ label: "Send note", primary: true }, { label: "See pattern" }],
    chatTitle: "Sleep pattern",
    chatPrompts: ["Write a note to the team", "Show me the sleep chart", "What's normal for this age?", "Tips to improve sleep"],
  },
  learning: {
    message: "2 new observations added since your last visit — Sidekick has some questions for pickup.",
    actions: [{ label: "See questions", primary: true }, { label: "Explore" }],
    chatTitle: "Pickup questions",
    chatPrompts: ["What should I ask today?", "Explain the latest observation", "How can I support this at home?", "What is Abby working on?"],
  },
};

export const SidekickNoticedBanner: React.FC<{ tab: "photos" | "activity" | "learning" }> = ({ tab }) => {
  const [visible, setVisible] = useState(true);
  const content = bannerContent[tab];

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="mx-3 mt-3"
    >
      <SidekickContextCard
        {...content}
        conceptBadge="B"
        onDismiss={() => setVisible(false)}
      />
    </motion.div>
  );
};

// ─── C: Prompt seeds bar ──────────────────────────────────────────────────────

const promptsByTab: Record<string, string[]> = {
  home: ["Summarise Abby's week", "What should I ask at pickup?", "Draft a message to the team", "What's new since yesterday?"],
  activity: ["Spot any patterns this week?", "How does sleep compare to last week?", "Any missed meals?", "Write a note to the teacher"],
  photos: ["Make a memory from this week", "This year so far", "Write captions for today", "Create a garden album"],
  learning: ["Questions to ask at pickup", "What's Abby working on?", "Explain this observation", "How can I support this at home?"],
  saved: ["Summarise what I've saved", "Share my saved posts", "What topics keep coming up?"],
};

const WEEKLY_SUMMARY_PROMPT = "Summarise Abby's week";

const weekPhotos = [
  "https://images.pexels.com/photos/8613264/pexels-photo-8613264.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/8613097/pexels-photo-8613097.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/8613082/pexels-photo-8613082.jpeg?auto=compress&cs=tinysrgb&w=400",
];

const WeeklySummaryContent: React.FC = () => {
  const days = [
    { label: "M", attended: true },
    { label: "T", attended: true },
    { label: "W", attended: true },
    { label: "T", attended: false },
    { label: "F", attended: true },
  ];
  const areas = [
    { label: "Mathematics", color: "bg-blue-100 text-blue-700" },
    { label: "Literacy", color: "bg-rose-100 text-rose-600" },
    { label: "Personal & social", color: "bg-pink-100 text-pink-600" },
  ];
  return (
    <div className="flex flex-col gap-5">
      {/* Header — light, not bold */}
      <div>
        <p className="text-[11px] text-mfneutralsn-300 mb-0.5">Week of 2–6 September</p>
        <p className="text-[18px] font-medium text-mfneutralsn-500 leading-snug">A busy, creative week for Abby</p>
      </div>

      {/* Photos strip */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
        {weekPhotos.map((url, i) => (
          <div key={i} className={`flex-shrink-0 rounded-xl overflow-hidden ${i === 0 ? "w-[120px] h-[88px]" : "w-[72px] h-[88px]"}`}>
            <img src={url} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="flex-shrink-0 w-[56px] h-[88px] rounded-xl bg-mfprimaryp-50 border border-mfprimaryp-100 flex flex-col items-center justify-center gap-1">
          <span className="text-[13px] font-semibold text-mfprimaryp-400">+12</span>
          <span className="text-[9px] text-mfprimaryp-300 text-center leading-tight">more photos</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: CalendarDaysIcon, value: "4 / 5", label: "Days in",       color: "text-violet-500", bg: "bg-violet-50" },
          { icon: BookOpenIcon,     value: "3",     label: "Observations",  color: "text-blue-500",   bg: "bg-blue-50"   },
          { icon: UtensilsIcon,     value: "11/12", label: "Meals eaten",   color: "text-amber-500",  bg: "bg-amber-50"  },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-mfneutralsn-50 border border-mfneutralsn-100">
              <span className={`flex items-center justify-center w-7 h-7 rounded-lg ${s.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${s.color}`} />
              </span>
              <span className={`text-[16px] font-semibold ${s.color}`}>{s.value}</span>
              <span className="text-[10px] text-mfneutralsn-300 text-center leading-tight">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Attendance dots */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-medium text-mfneutralsn-300 uppercase tracking-wide">Attendance</p>
        <div className="flex items-center gap-2">
          {days.map((d, i) => (
            <div key={i} className={`flex-1 h-8 rounded-lg flex items-center justify-center text-[12px] font-medium ${
              d.attended
                ? "bg-violet-100 text-violet-600"
                : "bg-mfneutralsn-75 text-mfneutralsn-300 border border-dashed border-mfneutralsn-200"
            }`}>
              {d.label}
            </div>
          ))}
        </div>
      </div>

      {/* Narrative */}
      <p className="text-[13px] text-mfneutralsn-500 leading-relaxed">
        Abby had a great time in the garden on Tuesday — educators noted lovely counting play with wooden blocks. She skipped snack on Thursday but otherwise meals were strong.
      </p>

      {/* Development area chips */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-medium text-mfneutralsn-300 uppercase tracking-wide">Areas observed</p>
        <div className="flex flex-wrap gap-1.5">
          {areas.map((a) => (
            <span key={a.label} className={`px-2.5 py-1 rounded-full text-[12px] font-medium ${a.color}`}>{a.label}</span>
          ))}
        </div>
      </div>

      {/* Share CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-100 p-4 flex items-center gap-3">
        <div className="flex -space-x-2 flex-shrink-0">
          {["👩", "👨", "👵"].map((e, i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-white flex items-center justify-center text-[14px] shadow-sm">{e}</div>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-mfneutralsn-500">Share with loved ones</p>
          <p className="text-[12px] text-mfneutralsn-300 leading-tight">Send this summary to family</p>
        </div>
        <button className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-mfprimaryp-400 text-white text-[12px] font-semibold active:opacity-80 transition-opacity">
          Share
        </button>
      </div>

      <div className="h-px bg-mfneutralsn-100" />
      <p className="text-[12px] text-mfneutralsn-300">What would you like to explore next?</p>
    </div>
  );
};

export const SidekickPromptSeeds: React.FC<{ tab: string }> = ({ tab }) => {
  const [openChat, setOpenChat] = useState(false);
  const [openWeeklySummary, setOpenWeeklySummary] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const prompts = promptsByTab[tab] ?? promptsByTab["home"];

  const handlePrompt = (p: string) => {
    if (p === WEEKLY_SUMMARY_PROMPT) {
      setOpenWeeklySummary(true);
    } else {
      setSelectedPrompt(p);
      setOpenChat(true);
    }
  };

  return (
    <>
      <div className="border-t border-mfneutralsn-75 bg-white">
        <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 flex-shrink-0">
            <SparklesIcon className="w-3.5 h-3.5 text-mfprimaryp-400" />
            <ConceptBadge letter="C" />
          </div>
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => handlePrompt(p)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium bg-mfneutralsn-75 text-mfneutralsn-500 border border-mfneutralsn-100 active:bg-mfneutralsn-100 transition-colors whitespace-nowrap"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openWeeklySummary && (
          <SidekickChatSheet
            title="Abby's week summary"
            response={<WeeklySummaryContent />}
            prompts={["Show me the monthly view", "Where might Abby need more support?", "Draft a message to educators", "Save this as a note"]}
            onClose={() => setOpenWeeklySummary(false)}
          />
        )}
        {openChat && (
          <SidekickChatSheet
            title={selectedPrompt ?? "Ask Sidekick"}
            prompts={prompts.filter((p) => p !== selectedPrompt)}
            onClose={() => { setOpenChat(false); setSelectedPrompt(null); }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ─── D: "Made for you" feed card ──────────────────────────────────────────────

export const SidekickMadeForYouCard: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl border border-mfprimaryp-100 overflow-hidden bg-white shadow-sm"
      >
        <div className="relative h-[100px] bg-mfprimaryp-50 flex overflow-hidden">
          {[
            "https://images.pexels.com/photos/8613264/pexels-photo-8613264.jpeg?auto=compress&cs=tinysrgb&w=400",
            "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=400",
            "https://images.pexels.com/photos/8613097/pexels-photo-8613097.jpeg?auto=compress&cs=tinysrgb&w=400",
          ].map((url, i) => (
            <img key={i} src={url} alt="" className="flex-1 object-cover" style={{ filter: i === 1 ? "none" : "brightness(0.7)" }} />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-3">
            <p className="text-white text-[14px] font-semibold">Garden week ✨</p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center"
          >
            <XIcon className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        <div className="px-4 py-3">
          <div className="flex items-center gap-1.5 mb-1">
            <SparklesIcon className="w-3.5 h-3.5 text-mfprimaryp-400" />
            <span className="text-[11px] font-semibold text-mfprimaryp-400 uppercase tracking-wide">Made for you</span>
            <ConceptBadge letter="D" />
          </div>
          <p className="text-[13px] text-mfneutralsn-500 leading-snug">
            I put together a garden week memory from Abby's photos — want to save or share it?
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setOpenChat(true)} className="px-3.5 py-1.5 rounded-full text-[12px] font-medium bg-mfprimaryp-400 text-white active:bg-mfprimaryp-500 transition-colors">
                Open memory
              </button>
              <button onClick={() => setOpenChat(true)} className="px-3.5 py-1.5 rounded-full text-[12px] font-medium border border-mfneutralsn-200 text-mfneutralsn-400 active:bg-gray-50 transition-colors">
                Share
              </button>
            </div>
            <button onClick={() => setOpenChat(true)} className="flex items-center gap-1 text-[12px] text-mfprimaryp-400 font-medium">
              Edit <ChevronRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {openChat && (
          <SidekickChatSheet
            title="Garden week memory"
            prompts={["Save this memory", "Share with family", "Add more photos", "Write a caption", "Make it a reel"]}
            onClose={() => setOpenChat(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Shared: Sidekick chat bottom sheet ───────────────────────────────────────

interface SidekickChatSheetProps {
  title: string;
  prompts: string[];
  onClose: () => void;
  /** Optional rich response shown above the follow-up prompts */
  response?: React.ReactNode;
}

const SidekickChatSheet: React.FC<SidekickChatSheetProps> = ({ title, prompts, onClose, response }) => {
  const [input, setInput] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90]"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
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
            <span className="text-[15px] font-semibold text-mfneutralsn-500">{title}</span>
          </div>
          <button onClick={onClose} className="text-mfneutralsn-300 active:text-mfneutralsn-400">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {response ? (
            <>
              {response}
              <div className="flex flex-col gap-2 mt-2">
                {prompts.map((p) => (
                  <button key={p} className="flex items-center justify-between px-4 py-3 rounded-xl bg-mfneutralsn-50 border border-mfneutralsn-100 text-left active:bg-mfneutralsn-100 transition-colors">
                    <span className="text-[14px] text-mfneutralsn-500">{p}</span>
                    <ArrowRightIcon className="w-4 h-4 text-mfneutralsn-300 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-[13px] text-mfneutralsn-300 mb-4">What would you like to do?</p>
              <div className="flex flex-col gap-2">
                {prompts.map((p) => (
                  <button key={p} className="flex items-center justify-between px-4 py-3 rounded-xl bg-mfneutralsn-50 border border-mfneutralsn-100 text-left active:bg-mfneutralsn-100 transition-colors">
                    <span className="text-[14px] text-mfneutralsn-500">{p}</span>
                    <ArrowRightIcon className="w-4 h-4 text-mfneutralsn-300 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="px-4 pb-6 pt-2 border-t border-mfneutralsn-75">
          <div className="flex items-center gap-2 px-3 h-11 rounded-full border border-mfneutralsn-200 bg-mfneutralsn-50">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Or type something…"
              className="flex-1 bg-transparent text-[14px] text-mfneutralsn-500 placeholder:text-mfneutralsn-300 outline-none"
            />
            <button className="flex items-center justify-center w-7 h-7 rounded-full bg-mfprimaryp-400 flex-shrink-0">
              <ArrowRightIcon className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
