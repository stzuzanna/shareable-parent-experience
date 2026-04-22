import React, { useState } from "react";
import { Invoice } from "../../../../components/Invoice/Invoice";
import { PaymentModal } from "../../../../components/PaymentModal/PaymentModal";
import { Toast } from "../../../../components/Toast/Toast";
import { useToast } from "../../../../hooks/useToast";
import { ChevronRightIcon } from "lucide-react";

interface CommentSectionProps {
  isPaid: boolean;
  onPaymentSuccess: () => void;
}

const InvoiceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const CommentSection: React.FC<CommentSectionProps> = ({ isPaid, onPaymentSuccess }): JSX.Element => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const handlePaymentSuccess = () => {
    showToast("Payment successful! Your balance has been updated.", "success");
    onPaymentSuccess();
  };

  return (
    <div>
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}

      <button
        onClick={() => setShowInvoice(true)}
        className="w-full bg-white rounded-2xl border border-gray-100 overflow-hidden text-left active:bg-gray-50 transition-colors"
      >
        <div className="px-4 py-3 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isPaid ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-400'}`}>
            <InvoiceIcon />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-mfneutralsn-500">
              {isPaid ? 'Invoice #15 paid' : 'Pay invoice #15'}
            </p>
            <p className="text-xs text-mfneutralsn-300 mt-0.5">
              Sandbox Childcare · {isPaid ? 'Paid' : 'Due today'}
            </p>
          </div>
          {!isPaid && (
            <span className="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-orange-50 text-orange-500 border border-orange-200">
              Due
            </span>
          )}
          {isPaid && (
            <span className="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-200">
              Paid
            </span>
          )}
          <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-200 flex-shrink-0" />
        </div>
      </button>

      {showInvoice && (
        <Invoice
          onClose={() => setShowInvoice(false)}
          isPaid={isPaid}
          onPaymentSuccess={onPaymentSuccess}
        />
      )}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};