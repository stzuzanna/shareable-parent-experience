import React, { useState } from "react";
import { SparklesIcon, XIcon, ArrowRightIcon, ChevronRightIcon, ChevronDownIcon, CalendarDaysIcon, BookOpenIcon, UtensilsIcon, TrendingUpIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BASE_PATH } from "../../../../constants";

// ─── SidekickAvatar ───────────────────────────────────────────────────────────
// The official Sidekick character icon — use wherever Sidekick is suggesting.

const SidekickAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = "" }) => (
  <img
    src={`${BASE_PATH}sidekick-icon.svg`}
    alt="Sidekick"
    className={`flex-shrink-0 ${className}`}
    style={{ width: size, height: size }}
  />
);

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
          <SidekickAvatar size={28} className="mt-0.5" />
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

export const SidekickObservationSuggestion: React.FC<{ areas: string[]; postId: string }> = ({ areas }) => {
  const [dismissed, setDismissed] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  if (dismissed) return null;

  const match = areas.find((a) => suggestionsByArea[a]);
  const content = match ? suggestionsByArea[match] : fallbackSuggestion;
  const areaLabel = match ?? areas[0] ?? "this area";

  if (!expanded) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 px-0.5 py-1.5 mt-0.5"
      >
        <SidekickAvatar size={20} />
        <span className="text-[12px] text-mfprimaryp-400 font-medium flex-1 min-w-0 truncate">
          Support {areaLabel} at home
        </span>
        <button
          onClick={() => setExpanded(true)}
          className="flex-shrink-0 px-2.5 py-1 rounded-full bg-mfprimaryp-50 border border-mfprimaryp-100 text-[11px] font-semibold text-mfprimaryp-400 active:bg-mfprimaryp-100 transition-colors"
        >
          Show ideas
        </button>
        <button onClick={() => setDismissed(true)} className="flex-shrink-0 p-0.5">
          <XIcon className="w-3.5 h-3.5 text-mfneutralsn-300" />
        </button>
      </motion.div>
    );
  }

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
            <div className="px-2.5 py-2 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-semibold text-mfneutralsn-500 leading-tight">{col.label}</p>
                <p className="text-[11px] text-mfneutralsn-300">{col.count} photos</p>
              </div>
              <SidekickAvatar size={20} />
            </div>
          </button>
        ))}

        {/* This year so far — opens Sidekick memories mode */}
        <button
          onClick={() => setOpenChat(true)}
          className="flex-shrink-0 w-[130px] rounded-2xl overflow-hidden border border-violet-100 bg-violet-50 active:bg-violet-100 transition-colors text-left"
        >
          <div className="h-[76px] flex items-center justify-center">
            <SidekickAvatar size={44} />
          </div>
          <div className="px-2.5 py-2">
            <p className="text-[12px] font-semibold text-mfprimaryp-400 leading-tight">This year so far</p>
            <p className="text-[11px] text-mfprimaryp-300">Ask Sidekick</p>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {openChat && (
          <SidekickChatSheet
            title="Collect memories"
            prompts={[]}
            onClose={() => setOpenChat(false)}
            initialMode="memories"
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
  home: ["What should I ask at pickup?", "Draft a message to the team", "What's new since yesterday?", "Any patterns this week?"],
  activity: ["Spot any patterns this week?", "How does sleep compare to last week?", "Any missed meals?", "Write a note to the teacher"],
  photos: ["Make a memory from this week", "This year so far", "Write captions for today", "Create a garden album"],
  learning: ["Questions to ask at pickup", "What's Abby working on?", "Explain this observation", "How can I support this at home?"],
  saved: ["Summarise what I've saved", "Share my saved posts", "What topics keep coming up?"],
};

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

// ─── Sidekick Recap Card (below reel, home tab) ───────────────────────────────

export const SidekickRecapCard: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Card trigger */}
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <SidekickAvatar size={28} />
          <div className="text-left">
            <p className="text-[14px] font-semibold text-mfneutralsn-500 leading-tight">Sidekick recap</p>
            <p className="text-[11px] text-mfprimaryp-400 leading-tight">Week of 2–6 Sep · Abby</p>
          </div>
        </div>
        <ChevronRightIcon className="w-4 h-4 text-mfprimaryp-300 flex-shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <SidekickChatSheet
            title="Sidekick recap"
            response={<WeeklySummaryContent />}
            prompts={["Show me the monthly view", "Where might Abby need more support?", "Draft a message to educators", "Save this as a note"]}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export const SidekickPromptSeeds: React.FC<{ tab: string }> = ({ tab }) => {
  const [expanded, setExpanded] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  // Photos tab has SidekickCollectionsStrip; home tab has SidekickRecapCard;
  // activity tab has SidekickNoticedBanner — all handled separately
  if (tab === "photos" || tab === "home" || tab === "activity") return null;

  const prompts = promptsByTab[tab] ?? promptsByTab["home"];
  const teaserPrompt = prompts[0];

  const handlePrompt = (p: string) => {
    setExpanded(false);
    setSelectedPrompt(p);
    setOpenChat(true);
  };

  return (
    <>
      {/* Bar — violet-tinted so it reads as Sidekick, not nav */}
      <div className="border-t border-violet-100 bg-violet-50/80">
        {/* Collapsed row — always visible */}
        <div className="flex items-center gap-2 px-3 py-2">
          {/* Sidekick identity pill */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 flex-shrink-0"
          >
            <SidekickAvatar size={24} />
            <span className="text-[12px] font-semibold text-mfprimaryp-400 leading-none">Sidekick</span>
          </button>

          {/* Teaser — one prompt shown when collapsed */}
          <AnimatePresence initial={false}>
            {!expanded && (
              <motion.button
                key="teaser"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                onClick={() => handlePrompt(teaserPrompt)}
                className="flex-1 min-w-0 text-left px-3 py-1.5 rounded-full text-[12px] font-medium bg-white/90 text-mfneutralsn-500 border border-violet-100 active:bg-white transition-colors truncate shadow-sm"
              >
                {teaserPrompt}
              </motion.button>
            )}
          </AnimatePresence>

          {/* Expand / collapse chevron */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center ml-auto"
            aria-label={expanded ? "Collapse Sidekick" : "See more prompts"}
          >
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDownIcon className="w-4 h-4 text-mfprimaryp-300" />
            </motion.div>
          </button>
        </div>

        {/* Expanded prompts row */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="prompts"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 px-3 pb-2.5 overflow-x-auto no-scrollbar">
                {prompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePrompt(p)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium bg-white text-mfneutralsn-500 border border-violet-100 active:bg-violet-50 transition-colors whitespace-nowrap shadow-sm"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
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
            <SidekickAvatar size={18} />
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
  /** Pre-filled message shown as a sent bubble */
  sentMessage?: string;
  /** Open directly into a focused mode */
  initialMode?: NonNullable<FocusedMode>;
}

// ─── Focused mode content ────────────────────────────────────────────────────

type FocusedMode = "bedtime" | "activities" | "memories" | null;

const focusedModes: Record<NonNullable<FocusedMode>, {
  emoji: string;
  title: string;
  subtitle: string;
  promptLabel: string;
  options: { label: string; emoji: string; description: string }[];
}> = {
  bedtime: {
    emoji: "🌙",
    title: "Bedtime stories",
    subtitle: "What should the story be about?",
    promptLabel: "Pick a theme to explore together",
    options: [
      { label: "Animals & nature", emoji: "🦊", description: "Forest friends, talking animals, seasonal adventures" },
      { label: "Space adventures", emoji: "🚀", description: "Rockets, planets, friendly aliens and stargazing" },
      { label: "Fairy tales & magic", emoji: "✨", description: "Wizards, enchanted forests and brave little heroes" },
      { label: "Abby's day", emoji: "🏫", description: "A story starring Abby and what happened at nursery" },
      { label: "Ocean & sea", emoji: "🐠", description: "Mermaids, coral reefs, treasure and deep-sea friends" },
    ],
  },
  activities: {
    emoji: "🎨",
    title: "Activities at home",
    subtitle: "What kind of activity?",
    promptLabel: "Choose a type to get ideas",
    options: [
      { label: "Rainy day crafts", emoji: "🎨", description: "Paper, glue, paint — make something together indoors" },
      { label: "Garden play", emoji: "🌱", description: "Planting, bug spotting, mud kitchens and water play" },
      { label: "Cooking together", emoji: "🍳", description: "Simple recipes Abby can help make and eat" },
      { label: "Building & making", emoji: "🔨", description: "Blocks, cardboard boxes, dens and engineering" },
      { label: "Music & movement", emoji: "🎵", description: "Songs, rhythm games and dancing at home" },
    ],
  },
  memories: {
    emoji: "📸",
    title: "Collect memories",
    subtitle: "What would you like to make?",
    promptLabel: "Choose a format",
    options: [
      { label: "This week's highlights", emoji: "⭐", description: "Pull together the best moments from this week" },
      { label: "Garden adventures", emoji: "🌿", description: "Abby's outdoor moments from the last month" },
      { label: "Photo book", emoji: "📖", description: "A printable keepsake from photos this term" },
      { label: "Write captions", emoji: "✍️", description: "Add words to today's photos to share with family" },
      { label: "Milestone reel", emoji: "🎬", description: "A short video of Abby's biggest moments so far" },
    ],
  },
};

const FocusedModeView: React.FC<{ mode: NonNullable<FocusedMode>; onBack: () => void }> = ({ mode, onBack }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const data = focusedModes[mode];

  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] text-mfprimaryp-400 font-medium self-start">
        <ChevronRightIcon className="w-3.5 h-3.5 rotate-180" /> Back
      </button>

      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-mfprimaryp-50 flex items-center justify-center text-[20px]">{data.emoji}</div>
        <div>
          <p className="text-[15px] font-semibold text-mfneutralsn-500">{data.title}</p>
          <p className="text-[12px] text-mfneutralsn-300">{data.subtitle}</p>
        </div>
      </div>

      <p className="text-[12px] font-medium text-mfneutralsn-300 uppercase tracking-wide">{data.promptLabel}</p>

      <div className="flex flex-col gap-2">
        {data.options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => setSelected(opt.label)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-colors ${
              selected === opt.label
                ? "border-mfprimaryp-300 bg-mfprimaryp-50"
                : "border-mfneutralsn-100 bg-mfneutralsn-50 active:bg-mfneutralsn-100"
            }`}
          >
            <span className="text-[20px] flex-shrink-0">{opt.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-[13px] font-semibold leading-tight ${selected === opt.label ? "text-mfprimaryp-400" : "text-mfneutralsn-500"}`}>{opt.label}</p>
              <p className="text-[11px] text-mfneutralsn-300 leading-snug mt-0.5">{opt.description}</p>
            </div>
            {selected === opt.label && <div className="w-4 h-4 rounded-full bg-mfprimaryp-400 flex items-center justify-center flex-shrink-0"><div className="w-1.5 h-1.5 rounded-full bg-white" /></div>}
          </button>
        ))}
      </div>

      {selected && (
        <motion.button
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full h-12 rounded-2xl bg-mfprimaryp-400 text-white text-[14px] font-semibold active:opacity-80 transition-opacity"
        >
          Let's go with {selected} →
        </motion.button>
      )}
    </div>
  );
};

// ─── Top mode grid ────────────────────────────────────────────────────────────

const ModeGrid: React.FC<{ onSelect: (mode: NonNullable<FocusedMode>) => void }> = ({ onSelect }) => (
  <div className="mb-5">
    <p className="text-[11px] font-medium text-mfneutralsn-300 uppercase tracking-wide mb-2.5">Explore with Sidekick</p>
    <div className="grid grid-cols-3 gap-2">
      {(["bedtime", "activities", "memories"] as NonNullable<FocusedMode>[]).map((mode) => {
        const d = focusedModes[mode];
        return (
          <button
            key={mode}
            onClick={() => onSelect(mode)}
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-mfneutralsn-50 border border-mfneutralsn-100 active:bg-mfprimaryp-50 active:border-mfprimaryp-100 transition-colors"
          >
            <span className="text-[22px]">{d.emoji}</span>
            <span className="text-[11px] font-semibold text-mfneutralsn-500 text-center leading-tight">{d.title}</span>
          </button>
        );
      })}
    </div>
  </div>
);

// ─── Quick pills ──────────────────────────────────────────────────────────────

const QUICK_PILLS = ["Drop off questions", "Summarise week", "Ask about the day"];

export const SidekickChatSheet: React.FC<SidekickChatSheetProps> = ({ title, prompts, onClose, response, sentMessage, initialMode }) => {
  const [input, setInput] = useState("");
  const [focusedMode, setFocusedMode] = useState<FocusedMode>(initialMode ?? null);
  const [activePill, setActivePill] = useState<string | null>(null);

  const handlePill = (pill: string) => setActivePill(pill);
  const handleSend = () => { if (input.trim()) setActivePill(input.trim()); };

  const showDefault = !response && !sentMessage && !activePill && !focusedMode;
  const showSent = !response && (!!sentMessage || !!activePill) && !focusedMode;
  const activeMessage = activePill ?? sentMessage ?? "";

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
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-mfneutralsn-75 flex-shrink-0">
          <div className="flex items-center gap-2">
            <SidekickAvatar size={28} />
            <span className="text-[15px] font-semibold text-mfneutralsn-500">
              {focusedMode ? focusedModes[focusedMode].title : title}
            </span>
          </div>
          <button onClick={onClose} className="text-mfneutralsn-300 active:text-mfneutralsn-400">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {focusedMode ? (
            <FocusedModeView mode={focusedMode} onBack={() => setFocusedMode(null)} />
          ) : response ? (
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
          ) : showSent ? (
            <>
              <div className="flex justify-end mb-4">
                <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-sm bg-mfprimaryp-400 text-white text-[14px] leading-snug">
                  {activeMessage}
                </div>
              </div>
              <div className="flex items-start gap-2.5 mb-5">
                <SidekickAvatar size={28} className="mt-0.5" />
                <div className="flex-1 text-[14px] text-mfneutralsn-500 leading-snug">
                  On it! Here are some ways I can help with that:
                </div>
              </div>
              <div className="flex flex-col gap-2">
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
              {/* Mode grid */}
              <ModeGrid onSelect={setFocusedMode} />

              {/* Greeting — below cards */}
              <div className="flex items-start gap-2.5 mt-4">
                <SidekickAvatar size={28} className="mt-0.5" />
                <div className="flex-1 text-[14px] text-mfneutralsn-500 leading-snug">
                  Hi! I'm Sidekick. What can I help you with today?
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick pills + input */}
        <div className="px-4 pb-6 pt-2 border-t border-mfneutralsn-75 flex-shrink-0">
          {/* Pills — always visible when not in a focused mode */}
          {!focusedMode && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2.5">
              {QUICK_PILLS.map((pill) => (
                <button
                  key={pill}
                  onClick={() => handlePill(pill)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium bg-white text-mfprimaryp-400 border border-mfprimaryp-200 active:bg-mfprimaryp-50 transition-colors whitespace-nowrap shadow-sm"
                >
                  {pill}
                </button>
              ))}
            </div>
          )}
          {/* Input bar */}
          <div className="flex items-center gap-2 px-3 h-11 rounded-full border border-mfneutralsn-200 bg-mfneutralsn-50">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
              placeholder="Or type something…"
              className="flex-1 bg-transparent text-[14px] text-mfneutralsn-500 placeholder:text-mfneutralsn-300 outline-none"
            />
            <button onClick={handleSend} className="flex items-center justify-center w-7 h-7 rounded-full bg-mfprimaryp-400 flex-shrink-0">
              <ArrowRightIcon className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
