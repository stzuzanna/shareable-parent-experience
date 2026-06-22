import React, { useState } from "react";
import { ChevronLeftIcon, BellOffIcon, ClockIcon, UsersIcon, ShieldOffIcon } from "lucide-react";
import { BASE_PATH } from "../../constants";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";

interface NotificationSettingsProps {
  onClose: () => void;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Channel = "push" | "email" | "inApp" | "sms";

interface NotifRow {
  id: string;
  label: string;
  channels: Partial<Record<Channel, boolean>>;
}

const INITIAL_ROWS: NotifRow[] = [
  { id: "new_post",      label: "Receive a new post",              channels: { push: true,  inApp: true,  sms: true  } },
  { id: "comment",       label: "New comment on a post I follow",  channels: { push: true,  inApp: true               } },
  { id: "private_msg",   label: "Get a private message",           channels: { push: true,  sms: true                } },
  { id: "calendar",      label: "New calendar invitation",         channels: { inApp: true                           } },
  { id: "check_in",      label: "My child is checked in or out",   channels: { push: true                            } },
  { id: "sleeps",        label: "My child sleeps",                  channels: {}                                       },
  { id: "sick",          label: "My child is sick or on vacation",  channels: { inApp: true                           } },
  { id: "details",       label: "My child details updated",         channels: { inApp: true                           } },
  { id: "todo",          label: "Receive new to-dos and reminders", channels: { push: true,  email: true, inApp: true  } },
];

const ALL_CHANNELS: { key: Channel; label: string }[] = [
  { key: "push",  label: "Push"     },
  { key: "email", label: "Email"    },
  { key: "inApp", label: "In-app"   },
  { key: "sms",   label: "SMS"      },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button
    role="checkbox"
    aria-checked={checked}
    onClick={onChange}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ${
      checked ? "bg-mfprimaryp-400 border-mfprimaryp-400" : "bg-mfneutralsn-100 border-mfneutralsn-100"
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
        checked ? "translate-x-4" : "translate-x-0"
      }`}
    />
  </button>
);

const Radio: React.FC<{ checked: boolean; onChange: () => void; label: string }> = ({ checked, onChange, label }) => (
  <button onClick={onChange} className="flex items-center gap-2.5 w-full py-1 text-left">
    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
      checked ? "border-mfprimaryp-400" : "border-mfneutralsn-200"
    }`}>
      {checked && <span className="w-2.5 h-2.5 rounded-full bg-mfprimaryp-400" />}
    </span>
    <span className="text-[14px] text-mfneutralsn-500 leading-snug">{label}</span>
  </button>
);

const Checkbox: React.FC<{ checked: boolean; onChange: () => void; label: string }> = ({ checked, onChange, label }) => (
  <button onClick={onChange} className="flex items-center gap-2.5 w-full py-1 text-left">
    <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
      checked ? "border-mfprimaryp-400 bg-mfprimaryp-400" : "border-mfneutralsn-200 bg-white"
    }`}>
      {checked && (
        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
    <span className="text-[14px] text-mfneutralsn-500 leading-snug">{label}</span>
  </button>
);

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="px-4 pt-6 pb-3">
    <h2 className="text-[16px] font-semibold text-mfneutralsn-500">{title}</h2>
    {subtitle && <p className="text-[13px] text-mfneutralsn-300 mt-0.5">{subtitle}</p>}
  </div>
);

const Divider = () => <div className="h-px bg-mfneutralsn-75 mx-4" />;

// ─── Notification matrix ──────────────────────────────────────────────────────

const NotificationsSection = () => {
  const [rows, setRows] = useState<NotifRow[]>(INITIAL_ROWS);

  const toggle = (rowId: string, ch: Channel) =>
    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? { ...r, channels: { ...r.channels, [ch]: !r.channels[ch] } }
          : r
      )
    );

  return (
    <section>
      <SectionHeader
        title="Notifications"
        subtitle="Choose how you want to be notified."
      />
      <div className="mx-4 rounded-2xl border border-mfneutralsn-75 overflow-hidden">
        {/* Column headers */}
        <div className="flex items-center px-4 py-2.5 bg-mfneutralsn-50 border-b border-mfneutralsn-75">
          <span className="flex-1 text-[12px] font-semibold text-mfneutralsn-300 uppercase tracking-wide" />
          {ALL_CHANNELS.map((ch) => (
            <span key={ch.key} className="w-12 text-center text-[11px] font-semibold text-mfneutralsn-300 uppercase tracking-wide">
              {ch.label}
            </span>
          ))}
        </div>

        {rows.map((row, i) => (
          <div
            key={row.id}
            className={`flex items-center px-4 py-3 ${i < rows.length - 1 ? "border-b border-mfneutralsn-75" : ""}`}
          >
            <span className="flex-1 text-[13px] text-mfneutralsn-500 pr-2 leading-snug">{row.label}</span>
            {ALL_CHANNELS.map((ch) => (
              <div key={ch.key} className="w-12 flex items-center justify-center">
                <Toggle
                  checked={!!row.channels[ch.key]}
                  onChange={() => toggle(row.id, ch.key)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── Quiet hours ──────────────────────────────────────────────────────────────

const QuietHoursSection = () => {
  const [mode, setMode] = useState<"allday" | "hours">("allday");
  const [noWeekends, setNoWeekends] = useState(false);

  return (
    <section>
      <SectionHeader
        title="Quiet hours"
        subtitle="Limit when push notifications are delivered."
      />
      <div className="mx-4 rounded-2xl border border-mfneutralsn-75 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-mfneutralsn-75">
          <div className="w-8 h-8 rounded-full bg-mfprimaryp-50 flex items-center justify-center flex-shrink-0">
            <BellOffIcon className="w-4 h-4 text-mfprimaryp-400" />
          </div>
          <div className="flex-1">
            <Radio checked={mode === "allday"} onChange={() => setMode("allday")} label="All day — no limits" />
            <Radio checked={mode === "hours"}  onChange={() => setMode("hours")}  label="Only during certain hours" />
          </div>
        </div>

        {mode === "hours" && (
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-mfneutralsn-75">
            <div className="w-8 h-8 rounded-full bg-mfprimaryp-50 flex items-center justify-center flex-shrink-0">
              <ClockIcon className="w-4 h-4 text-mfprimaryp-400" />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1 h-9 rounded-lg border border-mfneutralsn-200 bg-mfneutralsn-50 flex items-center justify-center text-[14px] text-mfneutralsn-500 font-medium">
                07:00
              </div>
              <span className="text-[13px] text-mfneutralsn-300">to</span>
              <div className="flex-1 h-9 rounded-lg border border-mfneutralsn-200 bg-mfneutralsn-50 flex items-center justify-center text-[14px] text-mfneutralsn-500 font-medium">
                21:00
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="w-8 h-8 flex-shrink-0" />
          <div className="flex-1">
            <Checkbox
              checked={noWeekends}
              onChange={() => setNoWeekends((v) => !v)}
              label="Don't send push notifications on weekends"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Conversation settings ────────────────────────────────────────────────────

const ConversationSection = () => {
  const [msgPref, setMsgPref] = useState<0 | 1 | 2>(0);

  const options = [
    "Allow other parents with children in this setting to message me privately",
    "Only allow parents from the same classrooms as my children to message me privately",
    "Do not allow parents of other children to message me privately",
  ] as const;

  return (
    <section>
      <SectionHeader
        title="Conversation settings"
        subtitle="Control who can send you private messages."
      />
      <div className="mx-4 rounded-2xl border border-mfneutralsn-75 overflow-hidden">
        <div className="flex items-start gap-3 px-4 py-3.5">
          <div className="w-8 h-8 rounded-full bg-mfprimaryp-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <UsersIcon className="w-4 h-4 text-mfprimaryp-400" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            {options.map((opt, i) => (
              <Radio
                key={i}
                checked={msgPref === i}
                onChange={() => setMsgPref(i as 0 | 1 | 2)}
                label={opt}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Blocked users ────────────────────────────────────────────────────────────

const BlockedUsersSection = () => (
  <section>
    <SectionHeader
      title="Blocked users"
      subtitle="Manage users you've blocked from messaging you."
    />
    <div className="mx-4 rounded-2xl border border-mfneutralsn-75 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="w-8 h-8 rounded-full bg-mfneutralsn-50 flex items-center justify-center flex-shrink-0">
          <ShieldOffIcon className="w-4 h-4 text-mfneutralsn-300" />
        </div>
        <p className="text-[14px] text-mfneutralsn-300">You haven't blocked anyone yet.</p>
      </div>
    </div>
  </section>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onClose }) => {
  const { shouldShowFrame } = useDeviceDetection();

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
          <h1 className="text-[18px] font-semibold text-mfneutralsn-500 flex-1">Notifications & messaging</h1>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-10">
        <NotificationsSection />
        <Divider />
        <QuietHoursSection />
        <Divider />
        <ConversationSection />
        <Divider />
        <BlockedUsersSection />
        <div className="h-8" />
      </div>
    </div>
  );
};
