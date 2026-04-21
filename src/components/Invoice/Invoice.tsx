import { BASE_PATH } from '../../constants';
import React from "react";
import { useState } from "react";
import { Button } from "../ui/button";
import { PaymentModal } from "../PaymentModal/PaymentModal";
import { Toast } from "../Toast/Toast";
import { useToast } from "../../hooks/useToast";
import { XIcon } from "lucide-react";

interface InvoiceProps {
  onClose: () => void;
  isPaid: boolean;
  onPaymentSuccess: () => void;
}

export const Invoice: React.FC<InvoiceProps> = ({ onClose, isPaid, onPaymentSuccess }): JSX.Element => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const handlePaymentSuccess = () => {
    showToast("Payment successful! Your invoice has been paid.", "success");
    onPaymentSuccess();
    // Close the invoice after a short delay to show the toast
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const currentDate = new Date();
  const invoiceDate = new Date(2025, 7, 29); // August 29, 2025
  const dueDate = new Date(2025, 8, 1); // September 1, 2025
  
  // Upcoming month dates
  const upcomingMonth = currentDate.getMonth() + 1;
  const upcomingYear = upcomingMonth > 11 ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
  const adjustedMonth = upcomingMonth > 11 ? 0 : upcomingMonth;
  
  const startDate = new Date(upcomingYear, adjustedMonth, 1);
  const endDate = new Date(upcomingYear, adjustedMonth + 1, 0); // Last day of the month

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="absolute inset-0 bg-white z-50 overflow-y-auto">
      {/* Toast notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      {/* Header */}
      <div className="flex flex-col border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Invoice 4765</h1>
            <p className="text-blue-500 text-lg">Katie Smith</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-8 h-8"
          >
            <XIcon className="w-6 h-6" />
          </Button>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between px-4 pb-4 gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 px-6 py-3 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-600">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Download
          </Button>
          
          {!isPaid && (
            <Button
              className="flex items-center gap-2 px-6 py-3 bg-mfprimaryp-400 hover:bg-mfprimaryp-400/90 text-white flex-1"
              onClick={() => setShowPaymentModal(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Pay $1,050.00
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Content */}
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header Section with Famly logo and company info */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex items-center gap-4">
            <img src={`${BASE_PATH}nursery-logo-1.svg`} alt="Famly" className="w-16 h-16" />
          </div>
          <div className="text-right text-gray-600">
            <div className="font-semibold text-lg mb-2">Sandbox Childcare</div>
            <div>1100 15th St NW</div>
            <div>Floor 4</div>
            <div>Washington DC 20005</div>
            <div>USA</div>
            <div className="mt-2">EIN #</div>
            <div>(202) 810-0946</div>
            <div>finance@sandboxchildcare.co</div>
          </div>
        </div>

        <hr className="border-gray-300 mb-8" />

        {/* Customer and Invoice Info */}
        <div className="flex justify-between mb-12">
          <div className="text-gray-700">
            <div className="font-semibold text-lg mb-4">Katie Smith</div>
            <div>1010 15th St</div>
            <div>Tyler 49205</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-800 mb-4">Invoice</div>
            <div className="space-y-2">
              <div className="flex justify-between gap-8">
                <span className="font-semibold">Invoice No.</span>
                <span>4765</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="font-semibold">Invoice Date</span>
                <span>August 29, 2025</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="font-semibold">Due Date</span>
                <span>September 1, 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thank you message */}
        <div className="mb-12 text-gray-700 leading-relaxed">
          Thank you for being part of Sandbox Childcare! We appreciate every member of our community and what you do to support your child day in and day out. Please let us know if you have any questions on the below invoice.
        </div>

        {/* Service Details Table */}
        <div className="mb-8">
          <div className="border-b-2 border-gray-800 pb-2 mb-6">
            <div className="flex justify-between items-center">
              <div className="font-bold text-lg">Description</div>
              <div className="flex gap-24">
                <div className="font-bold text-lg">Hours</div>
                <div className="font-bold text-lg">Total Price</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-semibold text-gray-800 mb-2">Amanda Freedman</div>
                <div className="text-gray-600 mb-1">
                  Planned Attendance for {formatDate(startDate)} - {formatDate(endDate)}
                </div>
                <div className="text-gray-600 mb-2">
                  {formatDate(startDate)} - {formatDate(endDate)}
                </div>
                <div className="text-gray-600 ml-4">5 x Full week session</div>
              </div>
              <div className="flex gap-24 items-start">
                <div className="text-right">50h 0m</div>
                <div className="text-right font-semibold">$1,050.00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="border-t-2 border-gray-800 pt-6">
          <div className="flex justify-end">
            <div className="w-80 space-y-3">
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total for {formatDate(startDate)} - {formatDate(endDate)}</span>
                <span className="font-semibold">$1,050.00</span>
              </div>
              <div className="flex justify-between text-xl border-t border-gray-300 pt-3">
                <span className="font-bold">Invoice Total</span>
                <span className="font-bold">$1,050.00</span>
              </div>
              <div className="flex justify-between text-xl border-t-2 border-gray-800 pt-3">
                <span className="font-bold">Payment Due</span>
                <span className="font-bold">$1,050.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <div className="flex items-center justify-center gap-2">
            <img src={`${BASE_PATH}nursery-logo-1.svg`} alt="Famly" className="w-6 h-6" />
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal 
          onClose={() => setShowPaymentModal(false)} 
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};