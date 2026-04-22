import React, { useState } from "react";
import { ChevronRightIcon } from "lucide-react";
import { Invoice } from "../../../../components/Invoice/Invoice";
import { PaymentModal } from "../../../../components/PaymentModal/PaymentModal";
import { Toast } from "../../../../components/Toast/Toast";
import { useToast } from "../../../../hooks/useToast";

interface TodosWidgetProps {
  isPaid: boolean;
  onPaymentSuccess: () => void;
}

const InvoiceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const FormIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="9" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="9" y1="11" x2="15" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="9" y1="15" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface TodoCard {
  id: string;
  icon: React.ReactNode;
  meta: string;
  title: string;
  onClick?: () => void;
}

export const TodosWidget = ({ isPaid, onPaymentSuccess }: TodosWidgetProps): JSX.Element => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const handlePaymentSuccess = () => {
    showToast("Payment successful! Your balance has been updated.", "success");
    onPaymentSuccess();
  };

  const todos: TodoCard[] = [
    {
      id: "invoice",
      icon: <InvoiceIcon />,
      meta: `${isPaid ? "Invoice paid" : "Pay invoice"} · Sandbox Childcare`,
      title: isPaid ? "Invoice #15 · Paid" : "Invoice #15 · Due today",
      onClick: () => setShowInvoice(true),
    },
    {
      id: "form",
      icon: <FormIcon />,
      meta: "Fill out form · Raj",
      title: "Getting to know me (0–12 months)",
    },
    {
      id: "profile",
      icon: <ProfileIcon />,
      meta: "Profile completion · Raj",
      title: "Respond to child permissions",
    },
  ];

  return (
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}

      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-mfneutralsn-500">To-do's (3)</span>
          <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-300" />
        </div>

        {/* Horizontal scroll row — negative mx to bleed to edges, px to pad */}
        <div className="-mx-4 overflow-x-auto flex gap-3 px-4 pb-0.5 scrollbar-hide">
          {todos.map((todo) => {
            const Wrapper = todo.onClick ? "button" : "div";
            return (
              <Wrapper
                key={todo.id}
                onClick={todo.onClick}
                className="flex-shrink-0 w-[300px] flex items-stretch rounded-lg border border-mfneutralsn-75 overflow-hidden text-left active:opacity-80 transition-opacity"
              >
                {/* Icon strip */}
                <div className="w-10 bg-mfneutralsn-100 flex items-center justify-center flex-shrink-0 p-2 text-mfneutralsn-400">
                  {todo.icon}
                </div>
                {/* Text */}
                <div className="flex-1 bg-white pl-3 py-2 pr-2 min-w-0">
                  <p className="text-[11px] leading-tight text-mfneutralsn-300 whitespace-nowrap truncate">
                    {todo.meta}
                  </p>
                  <p className="text-sm text-mfneutralsn-500 truncate mt-0.5 leading-tight">
                    {todo.title}
                  </p>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>

      {showInvoice && (
        <Invoice onClose={() => setShowInvoice(false)} isPaid={isPaid} onPaymentSuccess={onPaymentSuccess} />
      )}
      {showPaymentModal && (
        <PaymentModal onClose={() => setShowPaymentModal(false)} onPaymentSuccess={handlePaymentSuccess} />
      )}
    </>
  );
};
