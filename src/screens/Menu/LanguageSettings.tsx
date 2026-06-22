import React, { useState } from "react";
import { ChevronLeftIcon, GlobeIcon, LanguagesIcon, SearchIcon, CheckIcon, ChevronRightIcon } from "lucide-react";
import { BASE_PATH } from "../../constants";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";

interface LanguageSettingsProps {
  onClose: () => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLATFORM_LANGUAGES = [
  "English (UK)",
  "English (US)",
  "Deutsch",
  "Schwizerdütsch",
  "Dansk",
  "Español",
  "Français",
  "Italiano",
  "Nederlands",
  "Norsk",
  "Svenska",
  "Suomi",
  "Polski",
  "Português",
];

const TRANSLATION_LANGUAGES = [
  "None (show original)",
  "English (UK)",
  "English (US)",
  "Español – Spanish",
  "Français – French",
  "Deutsch – German",
  "Italiano – Italian",
  "Português – Portuguese",
  "Nederlands – Dutch",
  "Polski – Polish",
  "Svenska – Swedish",
  "Norsk – Norwegian",
  "Dansk – Danish",
  "日本語 – Japanese",
  "中文 – Chinese",
  "العربية – Arabic",
];

// ─── Language picker sheet ────────────────────────────────────────────────────

const LanguageSheet: React.FC<{
  title: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}> = ({ title, options, selected, onSelect, onClose }) => {
  const [query, setQuery] = useState("");
  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl flex flex-col max-h-[80%]">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-mfneutralsn-100" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-mfneutralsn-75 flex-shrink-0">
          <h3 className="text-[16px] font-semibold text-mfneutralsn-500">{title}</h3>
          <button onClick={onClose} className="text-[14px] font-medium text-mfprimaryp-400 active:opacity-70">Done</button>
        </div>
        {/* Search */}
        <div className="px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-mfneutralsn-50 border border-mfneutralsn-100">
            <SearchIcon className="w-4 h-4 text-mfneutralsn-300 flex-shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a language…"
              className="flex-1 bg-transparent text-[14px] text-mfneutralsn-500 placeholder:text-mfneutralsn-200 outline-none"
            />
          </div>
        </div>
        {/* List */}
        <div className="flex-1 overflow-y-auto px-2 pb-6">
          {filtered.map((opt) => (
            <button
              key={opt}
              onClick={() => { onSelect(opt); onClose(); }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors ${
                opt === selected ? "bg-mfprimaryp-50" : "active:bg-mfneutralsn-50"
              }`}
            >
              <span className={`text-[15px] ${opt === selected ? "font-semibold text-mfprimaryp-400" : "text-mfneutralsn-500"}`}>
                {opt}
              </span>
              {opt === selected && <CheckIcon className="w-4 h-4 text-mfprimaryp-400 flex-shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Setting row ──────────────────────────────────────────────────────────────

const LanguageRow: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  value: string;
  onEdit: () => void;
}> = ({ icon: Icon, title, description, value, onEdit }) => (
  <div className="mx-4 rounded-2xl border border-mfneutralsn-75 p-4">
    <div className="flex items-start gap-3 mb-4">
      <div className="w-10 h-10 rounded-2xl bg-mfprimaryp-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-mfprimaryp-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-[15px] font-semibold text-mfneutralsn-500">{title}</h2>
        <p className="text-[13px] text-mfneutralsn-300 mt-0.5 leading-snug">{description}</p>
      </div>
    </div>
    <button
      onClick={onEdit}
      className="w-full flex items-center justify-between h-11 px-4 rounded-xl bg-mfneutralsn-50 border border-mfneutralsn-100 active:bg-mfneutralsn-100 transition-colors"
    >
      <span className="text-[14px] font-semibold text-mfneutralsn-500">{value}</span>
      <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-300 flex-shrink-0" />
    </button>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export const LanguageSettings: React.FC<LanguageSettingsProps> = ({ onClose }) => {
  const { shouldShowFrame } = useDeviceDetection();
  const [platformLang, setPlatformLang] = useState("English (US)");
  const [translationLang, setTranslationLang] = useState("Español – Spanish");
  const [sheet, setSheet] = useState<"platform" | "translation" | null>(null);

  return (
    <div className={`flex flex-col bg-white ${shouldShowFrame ? "h-full" : "min-h-screen"}`}>
      {/* Header */}
      <header className="flex flex-col w-full bg-white border-b border-mfneutralsn-75">
        {shouldShowFrame && (
          <div className="flex items-center justify-between px-5 pt-2 pb-1">
            <span className="font-semibold text-mfneutralsn-500 text-[15px]">9:41</span>
            <img className="h-4" alt="Status icons" src={`${BASE_PATH}right-side.svg`} />
          </div>
        )}
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-mfneutralsn-100 flex items-center justify-center active:bg-mfneutralsn-50 transition-colors flex-shrink-0"
          >
            <ChevronLeftIcon className="w-4 h-4 text-mfneutralsn-400" />
          </button>
          <h1 className="text-[18px] font-semibold text-mfneutralsn-500 flex-1">Language</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 py-4">
          <LanguageRow
            icon={GlobeIcon}
            title="Platform language"
            description="The language used across the entire app interface."
            value={platformLang}
            onEdit={() => setSheet("platform")}
          />
          <LanguageRow
            icon={LanguagesIcon}
            title="Translation language"
            description="News feed posts and observations will be automatically translated into this language."
            value={translationLang}
            onEdit={() => setSheet("translation")}
          />
        </div>
      </div>

      {/* Sheets */}
      {sheet === "platform" && (
        <LanguageSheet
          title="Platform language"
          options={PLATFORM_LANGUAGES}
          selected={platformLang}
          onSelect={setPlatformLang}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === "translation" && (
        <LanguageSheet
          title="Translation language"
          options={TRANSLATION_LANGUAGES}
          selected={translationLang}
          onSelect={setTranslationLang}
          onClose={() => setSheet(null)}
        />
      )}
    </div>
  );
};
