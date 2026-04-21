import { BASE_PATH } from '../../../../constants';
import React from "react";
import { useState } from "react";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Invoice } from "../../../../components/Invoice/Invoice";
import { PaymentModal } from "../../../../components/PaymentModal/PaymentModal";
import { Toast } from "../../../../components/Toast/Toast";
import { useToast } from "../../../../hooks/useToast";

interface CommentSectionProps {
  isPaid: boolean;
  onPaymentSuccess: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ isPaid, onPaymentSuccess }): JSX.Element => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const handlePaymentSuccess = () => {
    showToast("Payment successful! Your balance has been updated.", "success");
    onPaymentSuccess();
  };

  const actionButtons = [
    {
      variant: "outline" as const,
      className: "h-12 bg-mfneutralsn-0 border-[#efeff4] text-mfneutralsn-400",
  icon: `${BASE_PATH}left-icon-1.svg`,
      text: "Invoice",
      onClick: () => setShowInvoice(true),
    },
    !isPaid && {
      variant: "default" as const,
      className:
        "h-12 bg-mfprimaryp-400 text-mfneutralsn-0 hover:bg-mfprimaryp-400",
  icon: `${BASE_PATH}left-icon-2.svg`,
      text: "Pay",
      onClick: () => setShowPaymentModal(true),
    },
  ].filter(Boolean);

  return (
    <div>
      {/* Toast notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <Card className="h-56 w-full bg-white rounded-lg border-0 shadow-none">
        <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-4">
          <div className="inline-flex items-start gap-2.5 relative flex-[0_0_auto]">
            <Avatar className="w-11 h-11">
              <AvatarImage src={`${BASE_PATH}nursery-logo-1.svg`} alt="Nursery logo" />
            </Avatar>

            <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-mfneutralsn-400 text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] whitespace-nowrap [font-style:var(--MF-body-text-body-emphasis-font-style)]">
                Sandbox Childcare
              </div>

              <div className="relative w-[129.21px] font-MF-body-text-body-small font-[number:var(--MF-body-text-body-small-font-weight)] text-brandneutralsn-200 text-[length:var(--MF-body-text-body-small-font-size)] tracking-[var(--MF-body-text-body-small-letter-spacing)] leading-[var(--MF-body-text-body-small-line-height)] [font-style:var(--MF-body-text-body-small-font-style)]">
                Today
              </div>
            </div>
          </div>

          <div className="relative w-[310px] h-[18px] font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-brandneutralsn-400 text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] whitespace-nowrap [font-style:var(--MF-body-text-body-emphasis-font-style)]">
            Please find attached Invoice #15
          </div>

          <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto] mb-[-14.00px]">
            {actionButtons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant}
                onClick={button.onClick}
                className={`${button.className} flex items-center justify-center gap-2 px-4 py-2 relative self-stretch w-full rounded-lg`}
              >
                <img
                  className="relative w-5 h-5"
                  alt="Left icon"
                  src={button.icon}
                />
                <span className="relative w-fit font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] whitespace-nowrap [font-style:var(--modern-famly-body-text-body-font-style)]">
                  {button.text}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {showInvoice && <Invoice onClose={() => setShowInvoice(false)} isPaid={isPaid} onPaymentSuccess={onPaymentSuccess} />}
      {showPaymentModal && (
        <PaymentModal 
          onClose={() => setShowPaymentModal(false)} 
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};