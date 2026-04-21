import React, { useState } from "react";
import { Button } from "../ui/button";
import { XIcon, ChevronDownIcon } from "lucide-react";

interface PaymentModalProps {
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onPaymentSuccess }): JSX.Element => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [autopayEnabled, setAutopayEnabled] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    onPaymentSuccess();
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-800">Pay balance</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="w-8 h-8"
        >
          <XIcon className="w-6 h-6" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex flex-col p-6 space-y-6">
        {/* Balance Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-700">Current balance</span>
            <span className="text-lg font-medium">$1,050.00</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-700">Fees</span>
            <span className="text-lg font-medium">$0.00</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-700">New balance</span>
            <span className="text-lg font-medium">$0.00</span>
          </div>
          
          <hr className="border-gray-200" />
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">To be paid:</span>
            <span className="text-lg font-semibold">$1,050.00</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full h-14 flex items-center justify-between px-4 bg-white border-gray-200 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">
                VISA
              </div>
              <span className="text-gray-800">Visa (Credit) •••• 4242</span>
            </div>
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          </Button>
        </div>

        {/* Autopay Section */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-800">Enable autopay</span>
            <button
              onClick={() => setAutopayEnabled(!autopayEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autopayEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autopayEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <p className="text-gray-600 text-sm">
            Get notified in advance and pay automatically. Cancel anytime.
          </p>
          
          <p className="text-gray-600 text-sm">
            There are fees associated with payments. Read more about payments and fees{' '}
            <span className="text-blue-600 underline cursor-pointer">here</span>.
          </p>
          
          <Button
            variant="ghost"
            className="text-left p-0 h-auto font-medium text-gray-800 hover:bg-transparent"
          >
            <div className="flex items-center gap-2">
              <span>Learn more</span>
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </Button>
        </div>
      </div>

      {/* Pay Button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full h-14 bg-mfprimaryp-400 hover:bg-mfprimaryp-400/90 text-white text-lg font-medium rounded-lg"
        >
          {isProcessing ? 'Processing...' : 'Pay $1,050.00'}
        </Button>
      </div>
    </div>
  );
};