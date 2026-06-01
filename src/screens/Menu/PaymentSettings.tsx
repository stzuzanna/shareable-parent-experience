import React, { useState } from "react";
import {
  ChevronLeftIcon,
  SearchIcon,
  MailIcon,
  PencilIcon,
  Trash2Icon,
  PlusIcon,
} from "lucide-react";
import { BASE_PATH } from "../../constants";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { BottomNav } from "../../components/BottomNav/BottomNav";

interface PaymentSettingsProps {
  onClose: () => void;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="px-4 pt-5 pb-3 text-[16px] font-medium text-mfneutralsn-500">{children}</p>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-4 rounded-2xl border border-mfneutralsn-75 bg-white p-4">{children}</div>
);

const PaymentMethodSection = () => (
  <>
    <SectionTitle>Payment methods</SectionTitle>
    <Card>
      <div className="flex items-center gap-3">
        <div className="w-9 h-6 rounded bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
          VISA
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-medium text-mfneutralsn-500">Visa (Credit) •••• 4242</p>
          <p className="text-[14px] text-mfneutralsn-300 mt-0.5">Exp. 12/2045</p>
        </div>
        <button
          aria-label="Edit payment method"
          className="w-9 h-9 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center flex-shrink-0 active:bg-gray-50"
        >
          <PencilIcon className="w-4 h-4 text-mfneutralsn-500" />
        </button>
      </div>
    </Card>
    <div className="px-4 pt-3">
      <button className="w-full h-11 rounded-lg bg-mfprimaryp-400 text-white text-[14px] font-medium flex items-center justify-center gap-2">
        <PlusIcon className="w-4 h-4" />
        Add payment method
      </button>
    </div>
  </>
);

const AutopaySection = () => (
  <>
    <SectionTitle>Mandatory autopay</SectionTitle>
    <Card>
      <p className="text-[14px] text-mfneutralsn-300 mb-3 leading-snug">
        These contacts are charged automatically when an invoice is issued.
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={`${BASE_PATH}avatar-2.png`} alt="Matt Freedman" />
              <AvatarFallback>MF</AvatarFallback>
            </Avatar>
            <p className="text-[14px] text-mfneutralsn-500 truncate">Matt Freedman</p>
          </div>
          <button
            aria-label="Remove from autopay"
            className="w-8 h-8 flex items-center justify-center text-mfneutralsn-400 active:bg-gray-50 rounded-full flex-shrink-0"
          >
            <Trash2Icon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  </>
);

const InvoiceRecipientsSection = () => (
  <>
    <SectionTitle>Invoice recipients</SectionTitle>
    <Card>
      <p className="text-[14px] text-mfneutralsn-300 mb-3 leading-snug">
        Contacts with access to all account information.
      </p>
      <div className="flex items-center gap-3">
        <Avatar className="w-9 h-9 flex-shrink-0">
          <AvatarImage src={`${BASE_PATH}avatar-2.png`} alt="Matt Freedman" />
          <AvatarFallback>MF</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-mfneutralsn-500 truncate">Matt Freedman</p>
          <p className="text-[14px] text-mfneutralsn-300">Abby (Parent)</p>
        </div>
      </div>
    </Card>
  </>
);

const PayerInfoSection = () => (
  <>
    <SectionTitle>Payer info</SectionTitle>
    <Card>
      <p className="text-[16px] font-medium text-mfneutralsn-500 leading-tight">Matt Freedman</p>
      <div className="mt-1 text-[14px] text-mfneutralsn-300 leading-snug">
        1010 15th St
        <br />
        Tyler
        <br />
        TX 49205
        <br />
        US
      </div>
      <p className="mt-2 text-[14px] text-mfprimaryp-400 break-all">matt.freedman@email.com</p>
    </Card>
    <div className="px-4 pt-3">
      <button className="w-full h-11 rounded-lg border border-mfneutralsn-200 bg-white text-[14px] font-medium text-mfneutralsn-500 flex items-center justify-center gap-2 active:bg-gray-50">
        <MailIcon className="w-4 h-4" />
        Contact your childcare to update info
      </button>
    </div>
  </>
);

export const PaymentSettings: React.FC<PaymentSettingsProps> = ({ onClose }): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();

  return (
    <div
      className={`flex flex-col bg-white ${
        shouldShowFrame ? "h-full" : "min-h-screen"
      } ${!shouldShowFrame ? "touch:h-screen" : ""}`}
    >
      {/* Header */}
      <header className={`flex flex-col w-full bg-white ${!shouldShowFrame ? "sticky top-0 z-50" : ""}`}>
        <div className={`flex items-center justify-between px-5 pt-2 pb-1 ${!shouldShowFrame ? "hidden" : ""}`}>
          <span className="font-semibold text-mfneutralsn-500 text-[15px] tracking-[-0.3px]">9:41</span>
          <img className="h-4" alt="Status icons" src={`${BASE_PATH}right-side.svg`} />
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onClose}
            aria-label="Back"
            className="w-7 h-7 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center"
          >
            <ChevronLeftIcon className="w-4 h-4 text-mfneutralsn-500" />
          </button>
          <h1 className="text-[20px] font-medium text-mfneutralsn-500">Payment settings</h1>
          <SearchIcon className="w-5 h-5 text-mfneutralsn-400" />
        </div>
      </header>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto bg-white ${!shouldShowFrame ? "touch:pb-20" : ""}`}>
        <PaymentMethodSection />
        <AutopaySection />
        <InvoiceRecipientsSection />
        <PayerInfoSection />
        <div className="pb-24" />
      </div>

      <div className={!shouldShowFrame ? "sticky bottom-0 z-50" : ""}>
        <BottomNav />
      </div>
    </div>
  );
};
