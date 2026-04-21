import React, { useState } from "react";
import { ChevronRightIcon } from "lucide-react";

const SectionHeader = ({ title, count }: { title: string; count?: number }) => (
  <div className="flex items-center justify-between px-4 py-3">
    <span className="text-sm font-medium text-mfneutralsn-300">{title}</span>
    <div className="flex items-center gap-1">
      {count !== undefined && (
        <span className="text-sm text-mfneutralsn-300">{count}</span>
      )}
      <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-200" />
    </div>
  </div>
);

const Divider = () => <div className="h-px bg-gray-100 mx-4" />;

const SectionDivider = () => <div className="h-2 bg-gray-50" />;

const BookingStatusIcon = ({ status }: { status: "pending" | "paid" }) => {
  if (status === "paid") {
    return (
      <div className="w-7 h-7 rounded-full border-2 border-green-500 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full border-2 border-orange-400 flex items-center justify-center">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#fb923c" strokeWidth="2" />
        <path d="M12 6v6l4 2" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export const OverviewContent = (): JSX.Element => {
  return (
    <div className="flex flex-col bg-white">
      {/* Family */}
      <SectionHeader title="Family" />
      <Divider />
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-mfneutralsn-500">Sarah Freedman</p>
          <p className="text-xs text-mfneutralsn-300">+1 (555) 123-4567 · Mother</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full border border-mfprimaryp-300 text-mfprimaryp-500">Primary</span>
      </div>
      <Divider />
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-mfneutralsn-500">Michael Freedman</p>
          <p className="text-xs text-mfneutralsn-300">+1 (555) 123-4567 · Father</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full border border-mfneutralsn-200 text-mfneutralsn-400">Secondary</span>
      </div>

      <SectionDivider />

      {/* Bookings */}
      <SectionHeader title="Bookings" />
      <Divider />
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-mfneutralsn-500">After School Care</p>
          <p className="text-xs text-mfneutralsn-300">Mar 7</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-mfneutralsn-400">$50.00</span>
          <BookingStatusIcon status="pending" />
        </div>
      </div>
      <Divider />
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-mfneutralsn-500">After School Care</p>
          <p className="text-xs text-mfneutralsn-300">Feb 1</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-mfneutralsn-400">$50.00</span>
          <BookingStatusIcon status="paid" />
        </div>
      </div>

      <SectionDivider />

      {/* Care pattern */}
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-mfneutralsn-300 mb-2">Care pattern</p>
        <p className="text-sm font-semibold text-mfneutralsn-500">Monthly full time</p>
        <p className="text-xs text-mfneutralsn-300">$1,350/month · Aug 31 –</p>
      </div>

      <SectionDivider />

      {/* Childcare info */}
      <SectionHeader title="Childcare info" />
      <Divider />
      <div className="px-4 py-3 flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold text-mfneutralsn-500">Sarah Freedman</p>
          <p className="text-xs text-mfneutralsn-300">Key person</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-mfneutralsn-500">11 NW Street NY</p>
          <p className="text-xs text-mfneutralsn-300">Address</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-mfneutralsn-500">+12454646464</p>
          <p className="text-xs text-mfneutralsn-300">Phone number</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-mfneutralsn-500">Gate code 1243</p>
          <p className="text-xs text-mfneutralsn-300">About</p>
        </div>
      </div>

      <SectionDivider />

      {/* Basic info */}
      <SectionHeader title="Basic info" />
      <Divider />
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-mfneutralsn-500">1 Feb 2025</p>
        <p className="text-xs text-mfneutralsn-300">Date of birth</p>
      </div>

      <div className="h-8" />
    </div>
  );
};
