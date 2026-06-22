import React, { useState } from "react";
import { ChevronLeftIcon, ShieldCheckIcon, KeyRoundIcon, HashIcon, EyeIcon, EyeOffIcon, CheckIcon } from "lucide-react";
import { BASE_PATH } from "../../constants";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";

interface SecuritySettingsProps {
  onClose: () => void;
}

// ─── Shared ───────────────────────────────────────────────────────────────────

const SectionHeader = ({ icon: Icon, title, subtitle, badge }: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-2xl bg-mfprimaryp-50 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-5 h-5 text-mfprimaryp-400" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className="text-[16px] font-semibold text-mfneutralsn-500">{title}</h2>
        {badge}
      </div>
      <p className="text-[13px] text-mfneutralsn-300 mt-0.5 leading-snug">{subtitle}</p>
    </div>
  </div>
);

const PasswordInput: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-medium text-mfneutralsn-300 uppercase tracking-wide">{label}</label>
      <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-mfneutralsn-200 bg-mfneutralsn-50 focus-within:border-mfprimaryp-400 transition-colors">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-[14px] text-mfneutralsn-500 outline-none placeholder:text-mfneutralsn-200"
          placeholder="••••••••"
        />
        <button onClick={() => setShow((v) => !v)} className="text-mfneutralsn-300 active:text-mfneutralsn-400 flex-shrink-0">
          {show ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

const PinDot: React.FC<{ filled: boolean }> = ({ filled }) => (
  <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${filled ? "bg-mfprimaryp-400 border-mfprimaryp-400" : "border-mfneutralsn-200"}`} />
);

// ─── MFA section ──────────────────────────────────────────────────────────────

const MFASection = () => {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="mx-4 rounded-2xl border border-mfneutralsn-75 p-4 flex flex-col gap-4">
      <SectionHeader
        icon={ShieldCheckIcon}
        title="Two-factor authentication"
        subtitle="Add an extra layer of security. You'll need your password and a one-time code from your phone to sign in."
        badge={
          <span className={`inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-medium ${enabled ? "bg-emerald-50 text-emerald-700" : "bg-mfneutralsn-50 text-mfneutralsn-300"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${enabled ? "bg-emerald-500" : "bg-mfneutralsn-300"}`} />
            {enabled ? "Active" : "Available"}
          </span>
        }
      />
      <button
        onClick={() => setEnabled((v) => !v)}
        className={`w-full h-11 rounded-xl text-[14px] font-semibold transition-colors ${
          enabled
            ? "border border-mfneutralsn-200 text-mfneutralsn-400 active:bg-mfneutralsn-50"
            : "bg-mfprimaryp-400 text-white active:opacity-80"
        }`}
      >
        {enabled ? "Disable 2FA" : "Set up 2FA"}
      </button>
    </div>
  );
};

// ─── Password section ─────────────────────────────────────────────────────────

const PasswordSection = () => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saved, setSaved] = useState(false);

  const valid = current.length >= 6 && next.length >= 6 && next === confirm;

  const handleSave = () => {
    if (!valid) return;
    setSaved(true);
    setOpen(false);
    setCurrent(""); setNext(""); setConfirm("");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-4 rounded-2xl border border-mfneutralsn-75 p-4 flex flex-col gap-4">
      <SectionHeader
        icon={KeyRoundIcon}
        title="Password"
        subtitle="Keep your account safe with a strong, unique password."
      />

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full h-11 rounded-xl border border-mfneutralsn-200 text-[14px] font-medium text-mfneutralsn-500 flex items-center justify-center gap-2 active:bg-mfneutralsn-50 transition-colors"
        >
          {saved ? <><CheckIcon className="w-4 h-4 text-emerald-500" /> Password updated</> : "Change password"}
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <PasswordInput label="Current password" value={current} onChange={setCurrent} />
          <PasswordInput label="New password" value={next} onChange={setNext} />
          <PasswordInput label="Confirm new password" value={confirm} onChange={setConfirm} />
          {next.length > 0 && confirm.length > 0 && next !== confirm && (
            <p className="text-[12px] text-red-500">Passwords don't match</p>
          )}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 h-10 rounded-xl border border-mfneutralsn-200 text-[14px] text-mfneutralsn-400 active:bg-mfneutralsn-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!valid}
              className={`flex-1 h-10 rounded-xl text-[14px] font-semibold transition-colors ${valid ? "bg-mfprimaryp-400 text-white active:opacity-80" : "bg-mfneutralsn-100 text-mfneutralsn-300"}`}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── PIN section ──────────────────────────────────────────────────────────────

const PIN_LENGTH = 4;
const PIN_PAD = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

const PINSection = () => {
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [saved, setSaved] = useState(false);

  const handleKey = (k: string) => {
    if (k === "⌫") { setPin((p) => p.slice(0, -1)); return; }
    if (k === "") return;
    if (pin.length < PIN_LENGTH) setPin((p) => p + k);
  };

  const handleSave = () => {
    if (pin.length !== PIN_LENGTH) return;
    setSaved(true);
    setOpen(false);
    setPin("");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-4 rounded-2xl border border-mfneutralsn-75 p-4 flex flex-col gap-4">
      <SectionHeader
        icon={HashIcon}
        title="PIN"
        subtitle="Use a 4-digit PIN for quick access to the app without typing your full password."
      />

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full h-11 rounded-xl border border-mfneutralsn-200 text-[14px] font-medium text-mfneutralsn-500 flex items-center justify-center gap-2 active:bg-mfneutralsn-50 transition-colors"
        >
          {saved ? <><CheckIcon className="w-4 h-4 text-emerald-500" /> PIN updated</> : "Change PIN"}
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-[13px] text-mfneutralsn-300 text-center">Enter your new {PIN_LENGTH}-digit PIN</p>

          {/* Dots */}
          <div className="flex items-center justify-center gap-4">
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <PinDot key={i} filled={i < pin.length} />
            ))}
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-2">
            {PIN_PAD.map((k, i) => (
              <button
                key={i}
                onClick={() => handleKey(k)}
                className={`h-12 rounded-xl text-[18px] font-medium text-mfneutralsn-500 transition-colors ${
                  k === "" ? "" : "bg-mfneutralsn-50 active:bg-mfneutralsn-100"
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => { setOpen(false); setPin(""); }}
              className="flex-1 h-10 rounded-xl border border-mfneutralsn-200 text-[14px] text-mfneutralsn-400 active:bg-mfneutralsn-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={pin.length !== PIN_LENGTH}
              className={`flex-1 h-10 rounded-xl text-[14px] font-semibold transition-colors ${pin.length === PIN_LENGTH ? "bg-mfprimaryp-400 text-white active:opacity-80" : "bg-mfneutralsn-100 text-mfneutralsn-300"}`}
            >
              Save PIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onClose }) => {
  const { shouldShowFrame } = useDeviceDetection();

  return (
    <div className={`flex flex-col bg-white ${shouldShowFrame ? "h-full" : "min-h-screen"}`}>
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
          <h1 className="text-[18px] font-semibold text-mfneutralsn-500 flex-1">Password & sign in</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 py-4">
          <MFASection />
          <PasswordSection />
          <PINSection />
        </div>
      </div>
    </div>
  );
};
