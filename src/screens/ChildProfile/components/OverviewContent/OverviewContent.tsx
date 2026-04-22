import React from "react";
import { ChevronRightIcon } from "lucide-react";

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-2 rounded-2xl overflow-hidden border border-gray-100 bg-white">
    {children}
  </div>
);

const CardHeader = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between px-4 py-3">
    <span className="text-sm text-mfneutralsn-300">{title}</span>
    <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-200" />
  </div>
);

const Divider = () => <div className="h-px bg-gray-100 mx-4" />;

const InfoRow = ({ label, sublabel }: { label: string; sublabel: string }) => (
  <div className="px-4 py-3">
    <p className="text-sm font-semibold text-mfneutralsn-500">{label}</p>
    <p className="text-xs text-mfneutralsn-300 mt-0.5">{sublabel}</p>
  </div>
);

const BookingStatusIcon = ({ status }: { status: "pending" | "paid" }) => {
  if (status === "paid") {
    return (
      <div className="w-7 h-7 rounded-full border-2 border-green-500 flex items-center justify-center flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full border-2 border-orange-400 flex items-center justify-center flex-shrink-0">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#fb923c" strokeWidth="2" />
        <path d="M12 6v6l4 2" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};

const BookingRow = ({
  name,
  date,
  amount,
  status,
}: {
  name: string;
  date: string;
  amount: string;
  status: "pending" | "paid";
}) => (
  <div className="px-4 py-2.5 flex items-center justify-between gap-2">
    <p className="text-sm font-semibold text-mfneutralsn-500 flex-1 min-w-0 truncate">{name}</p>
    <div className="flex items-center gap-2 flex-shrink-0">
      <span className="text-xs text-mfneutralsn-300">{date}</span>
      <span className="text-sm text-mfneutralsn-400">{amount}</span>
      <BookingStatusIcon status={status} />
    </div>
  </div>
);

export const OverviewContent = (): JSX.Element => {
  return (
    <div className="flex flex-col bg-mfneutralsn-50 pt-4 pb-24 gap-4">
      {/* Childcare info */}
      <Card>
        <CardHeader title="Childcare info" />
        <Divider />
        <InfoRow label="Sarah Freedman" sublabel="Key person" />
        <Divider />
        <InfoRow label="11 NW Street NY" sublabel="Address" />
        <Divider />
        <InfoRow label="+12454646464" sublabel="Phone number" />
        <Divider />
        <InfoRow label="Gate code 1243" sublabel="About" />
      </Card>

      {/* Care */}
      <Card>
        <CardHeader title="Care" />
        <Divider />
        <div className="px-4 py-3">
          <p className="text-sm font-semibold text-mfneutralsn-500">Monthly full time</p>
          <p className="text-xs text-mfneutralsn-300 mt-0.5">$1,350/month · Aug 31 –</p>
        </div>
        <div className="px-4 pt-1 pb-1">
          <p className="text-xs font-medium text-mfneutralsn-300 uppercase tracking-wide">Upcoming bookings</p>
        </div>
        <BookingRow name="After School Care" date="Mar 7" amount="$50.00" status="pending" />
        <Divider />
        <BookingRow name="After School Care" date="Feb 1" amount="$50.00" status="paid" />
      </Card>

      {/* Family */}
      <Card>
        <CardHeader title="Family" />
        <Divider />
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-mfneutralsn-500">Sarah Freedman</p>
            <p className="text-xs text-mfneutralsn-300 mt-0.5">+1 (555) 123-4567 · Mother</p>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full border border-mfprimaryp-400 text-mfprimaryp-400 flex-shrink-0">Primary</span>
        </div>
        <Divider />
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-mfneutralsn-500">Michael Freedman</p>
            <p className="text-xs text-mfneutralsn-300 mt-0.5">+1 (555) 123-4567 · Father</p>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full border border-mfneutralsn-200 text-mfneutralsn-400 flex-shrink-0">Secondary</span>
        </div>
      </Card>

      {/* Basic info */}
      <Card>
        <CardHeader title="Basic info" />
        <Divider />
        <InfoRow label="1 Feb 2025" sublabel="Date of birth" />
      </Card>
    </div>
  );
};
