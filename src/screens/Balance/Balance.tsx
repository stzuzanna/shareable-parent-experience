import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  CreditCardIcon,
  BarChart3Icon,
  UserCircleIcon,
  UsersIcon,
  FileTextIcon,
} from "lucide-react";
import { BASE_PATH } from "../../constants";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { useToast } from "../../hooks/useToast";
import { usePaymentState, setPaid } from "../../hooks/usePaymentState";
import { Button } from "../../components/ui/button";
import { Invoice } from "../../components/Invoice/Invoice";
import { Toast } from "../../components/Toast/Toast";
import { BottomNav } from "../../components/BottomNav/BottomNav";

type Transaction = {
  date: string;
  type: "Payment" | "Invoice 3";
  amount: string;
  positive: boolean;
};

const TRANSACTIONS: Transaction[] = [
  { date: "Nov 15, 25", type: "Payment", amount: "1024.88", positive: true },
  { date: "Nov 13, 25", type: "Invoice 3", amount: "1024.88", positive: false },
  { date: "Oct 15, 25", type: "Payment", amount: "1024.88", positive: true },
  { date: "Oct 13, 25", type: "Invoice 3", amount: "1024.88", positive: false },
  { date: "Sep 15, 25", type: "Payment", amount: "1024.88", positive: true },
  { date: "Sep 13, 25", type: "Invoice 3", amount: "1024.88", positive: false },
];

const OUTSTANDING_AMOUNT = "1024.88";

export const Balance = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();
  const isPaid = usePaymentState();
  const [showInvoice, setShowInvoice] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const handlePaymentSuccess = () => {
    setPaid(true);
  };

  const comingSoon = () => showToast("Coming soon", "info");

  return (
    <div className={`flex flex-col bg-white ${shouldShowFrame ? "h-full" : "min-h-screen"} ${!shouldShowFrame ? "touch:h-screen" : ""}`}>
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}

      {/* Header */}
      <header className={`flex flex-col w-full bg-white ${!shouldShowFrame ? "sticky top-0 z-50" : ""}`}>
        {/* Fake status bar — only inside the device frame so it clears the Dynamic Island */}
        <div className={`flex items-center justify-between px-5 pt-2 pb-1 ${!shouldShowFrame ? "hidden" : ""}`}>
          <span className="font-semibold text-mfneutralsn-500 text-[15px] tracking-[-0.3px]">9:41</span>
          <img className="h-4" alt="Status icons" src={`${BASE_PATH}right-side.svg`} />
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate("/menu")}
            aria-label="Back"
            className="w-7 h-7 rounded-full border border-mfneutralsn-200 bg-white flex items-center justify-center"
          >
            <ChevronLeftIcon className="w-4 h-4 text-mfneutralsn-500" />
          </button>
          <h1 className="text-[20px] font-medium text-mfneutralsn-500">Payments</h1>
          <SearchIcon className="w-5 h-5 text-mfneutralsn-400" />
        </div>
      </header>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto bg-white ${!shouldShowFrame ? "touch:pb-20" : ""}`}>
        <div className="px-4 pt-6 pb-12 space-y-8">
          {/* Balance */}
          <div className="space-y-2">
            <div className="text-[16px] font-medium text-mfneutralsn-500">Your balance</div>
            <div className={`text-[32px] leading-none ${isPaid ? "text-mfneutralsn-500" : "text-mfredr-400"}`}>
              {isPaid ? "$0" : `$ -${OUTSTANDING_AMOUNT}`}
            </div>
            <div className="text-[14px] text-mfneutralsn-300">
              {isPaid ? "Everything's settled. You don't owe anything." : "You owe money to the centre."}
            </div>
          </div>

          {/* Status pill OR Pay now flow */}
          {isPaid ? (
            <div className="inline-flex items-center gap-2 px-3 h-6 rounded-full bg-[#f6fefb] border border-[#1cb072]">
              <span className="w-2 h-2 rounded-full bg-[#1cb072]" />
              <span className="text-[14px] text-mfneutralsn-500">You're set up to pay automatically</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-mfneutralsn-50 rounded-lg px-3 py-2">
                <div className="w-9 h-9 rounded-md bg-white border border-mfneutralsn-75 flex items-center justify-center flex-shrink-0">
                  <FileTextIcon className="w-4 h-4 text-mfneutralsn-400" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-mfneutralsn-300 leading-tight">
                    Latest invoice • Charged on Nov 24
                  </span>
                  <span className="text-[14px] text-mfneutralsn-500 leading-tight">Invoice for $1024.00</span>
                </div>
              </div>
              <Button
                onClick={() => setShowInvoice(true)}
                className="w-full h-12 bg-mfprimaryp-400 hover:bg-mfprimaryp-400/90 text-white rounded-lg font-medium"
              >
                Pay now
              </Button>
            </div>
          )}

          {/* 2x2 quick-action grid */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={comingSoon}
              className="flex flex-col items-start justify-between h-[77px] bg-white border border-mfneutralsn-75 rounded-lg p-2 hover:bg-gray-50"
            >
              <CreditCardIcon className="w-6 h-6 text-mfneutralsn-400" />
              <span className="text-[14px] text-mfneutralsn-500">Payment methods</span>
            </button>
            <button
              onClick={comingSoon}
              className="flex flex-col items-start justify-between h-[77px] bg-white border border-mfneutralsn-75 rounded-lg p-2 hover:bg-gray-50"
            >
              <BarChart3Icon className="w-[18px] h-[18px] text-mfneutralsn-400" />
              <span className="text-[14px] text-mfneutralsn-500">Annual statement</span>
            </button>
            <button
              onClick={comingSoon}
              className="flex flex-col items-start justify-between h-[77px] bg-white border border-mfneutralsn-75 rounded-lg p-2 hover:bg-gray-50"
            >
              <UserCircleIcon className="w-[18px] h-[18px] text-mfneutralsn-400" />
              <span className="text-[14px] text-mfneutralsn-500">Payer info</span>
            </button>
            <button
              onClick={comingSoon}
              className="flex flex-col items-start justify-between h-[77px] bg-white border border-mfneutralsn-75 rounded-lg p-2 hover:bg-gray-50"
            >
              <UsersIcon className="w-[18px] h-[18px] text-mfneutralsn-400" />
              <span className="text-[14px] text-mfneutralsn-500">Invoice recipients</span>
            </button>
          </div>

          {/* Transactions */}
          <div className="space-y-3">
            <div className="text-[16px] font-medium text-mfneutralsn-500">Transactions</div>
            <div className="space-y-1">
              {TRANSACTIONS.map((tx, idx) => (
                <button
                  key={idx}
                  onClick={comingSoon}
                  className="w-full flex items-center justify-between gap-2 h-[58px] bg-white border border-mfneutralsn-75 rounded-xl px-4 hover:bg-gray-50"
                >
                  <span className="text-[14px] text-mfneutralsn-500 w-[72px] text-left">{tx.date}</span>
                  <span className="text-[14px] text-mfneutralsn-500 flex-1 text-left">{tx.type}</span>
                  <span
                    className={`text-[14px] tabular-nums whitespace-nowrap ${
                      tx.positive ? "text-[#1cb072]" : "text-mfneutralsn-500"
                    }`}
                  >
                    $ {tx.amount}
                  </span>
                  <ChevronRightIcon className="w-5 h-5 text-mfneutralsn-300" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={!shouldShowFrame ? "sticky bottom-0 z-50" : ""}>
        <BottomNav />
      </div>

      {showInvoice && (
        <Invoice
          onClose={() => setShowInvoice(false)}
          isPaid={isPaid}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
