import React, { useState } from "react";
import {
  ChevronLeftIcon,
  PlusIcon,
  Trash2Icon,
  MessageCircleIcon,
} from "lucide-react";
import { BASE_PATH } from "../../constants";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

interface PaymentSettingsProps {
  onClose: () => void;
}

// ─── Payment methods ──────────────────────────────────────────────────────────

const PAYMENT_METHODS = [
  { id: "visa4242", brand: "Visa", type: "Credit", last4: "4242", expiry: "12/2045", autopay: true },
];

const VisaLogo = () => (
  <div className="w-10 h-7 rounded-md bg-[#1A1F71] flex items-center justify-center flex-shrink-0">
    <span className="text-white text-[10px] font-extrabold italic tracking-wide">VISA</span>
  </div>
);

const PaymentMethodsSection = () => {
  const [methods, setMethods] = useState(PAYMENT_METHODS);
  return (
    <section>
      <h2 className="text-[13px] font-semibold text-mfneutralsn-300 uppercase tracking-wider px-4 pt-6 pb-2">
        Payment methods
      </h2>
      <div className="mx-4 rounded-2xl border border-mfneutralsn-75 bg-mfneutralsn-50 overflow-hidden">
        {methods.map((m, i) => (
          <div key={m.id} className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? "border-t border-mfneutralsn-75" : ""}`}>
            <VisaLogo />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-mfneutralsn-500">
                {m.brand} ({m.type}) •••• {m.last4}
              </p>
              <p className="text-[13px] text-mfneutralsn-300 mt-0.5">Exp. {m.expiry}</p>
              {m.autopay && (
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-[11px] font-medium text-emerald-700">Autopay active</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setMethods((ms) => ms.filter((x) => x.id !== m.id))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-mfneutralsn-300 active:bg-red-50 active:text-red-500 transition-colors flex-shrink-0"
              aria-label="Remove card"
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="px-4 pt-2.5">
        <button className="w-full h-11 rounded-xl border border-dashed border-mfneutralsn-200 bg-white text-[14px] font-medium text-mfprimaryp-400 flex items-center justify-center gap-2 active:bg-mfneutralsn-50 transition-colors">
          <PlusIcon className="w-4 h-4" />
          Add payment method
        </button>
      </div>
    </section>
  );
};

// ─── Payer info ────────────────────────────────────────────────────────────────

const PayerInfoSection = () => (
  <section>
    <h2 className="text-[13px] font-semibold text-mfneutralsn-300 uppercase tracking-wider px-4 pt-6 pb-2">
      Payer info
    </h2>
    <div className="mx-4 rounded-2xl border border-mfneutralsn-75 bg-mfneutralsn-50 px-4 py-4">
      <p className="text-[16px] font-semibold text-mfneutralsn-500">Martha Freedman</p>
      <div className="mt-2 flex flex-col gap-0.5 text-[14px] text-mfneutralsn-300 leading-snug">
        <span>1010 15th St</span>
        <span>Tyler, TX 49205</span>
        <span>US</span>
      </div>
      <p className="mt-2 text-[14px] text-mfprimaryp-400">martha.freedman@email.com</p>
    </div>
    <div className="px-4 pt-2.5">
      <ContactButton />
    </div>
  </section>
);

// ─── Invoice recipients ───────────────────────────────────────────────────────

const InvoiceRecipientsSection = () => (
  <section>
    <h2 className="text-[13px] font-semibold text-mfneutralsn-300 uppercase tracking-wider px-4 pt-6 pb-2">
      Invoice recipients
    </h2>
    <div className="mx-4 rounded-2xl border border-mfneutralsn-75 bg-mfneutralsn-50 px-4 py-4">
      <p className="text-[13px] text-mfneutralsn-300 leading-snug mb-3">
        Contacts with access to all account information.
      </p>
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={`${BASE_PATH}avatar-2.png`} alt="Martha Freedman" />
          <AvatarFallback>MF</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-mfneutralsn-500">Martha Freedman</p>
          <p className="text-[13px] text-mfneutralsn-300">Abby (Parent)</p>
        </div>
      </div>
    </div>
    <div className="px-4 pt-2.5">
      <ContactButton />
    </div>
  </section>
);

// ─── Shared tertiary contact button ──────────────────────────────────────────

const ContactButton = () => (
  <button className="w-full flex items-center justify-center gap-1.5 h-9 text-[13px] font-medium text-mfneutralsn-400 active:text-mfneutralsn-500 transition-colors">
    <MessageCircleIcon className="w-3.5 h-3.5 flex-shrink-0" />
    Contact Sunflower Nursery to update info
  </button>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export const PaymentSettings: React.FC<PaymentSettingsProps> = ({ onClose }): JSX.Element => {
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
          <h1 className="text-[18px] font-semibold text-mfneutralsn-500 flex-1">Payer preferences</h1>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-10">
        <PaymentMethodsSection />
        <PayerInfoSection />
        <InvoiceRecipientsSection />
        <div className="h-8" />
      </div>
    </div>
  );
};
