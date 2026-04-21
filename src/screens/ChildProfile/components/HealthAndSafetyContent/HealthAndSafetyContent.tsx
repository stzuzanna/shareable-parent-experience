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

const medications = [
  {
    name: "Panodil",
    detail: "Flu · Daily",
    badge: "Sign",
    badgeStyle: "border border-mforangeo-400 text-mforangeo-500",
  },
  {
    name: "Zyrtec",
    detail: "Pollen allergy · Daily",
    badge: "Active",
    badgeStyle: "border border-green-500 text-green-600",
  },
];

const immunizations = [
  { name: "DTaP", date: "Mar 2 2026" },
  { name: "Hepatitis B", date: "Mar 2 2026" },
];

export const HealthAndSafetyContent = (): JSX.Element => {
  return (
    <div className="flex flex-col bg-white">
      {/* Health info */}
      <SectionHeader title="Health info" />
      <Divider />
      <div className="px-4 py-3 flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold text-mfneutralsn-500">Phil Cawlins</p>
          <p className="text-xs text-mfneutralsn-300">+1 (555) 123-4567 · Doctor</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-mfneutralsn-500">Lactose, Peanuts</p>
          <p className="text-xs text-mfneutralsn-300">Allergies</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-mfneutralsn-500">Tolerates penicillin</p>
        </div>
      </div>

      <SectionDivider />

      {/* Accident reports */}
      <SectionHeader title="Accident reports" count={0} />

      <SectionDivider />

      {/* Medication */}
      <SectionHeader title="Medication" count={4} />
      <Divider />
      {medications.map((med, i) => (
        <React.Fragment key={med.name}>
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-mfneutralsn-500">{med.name}</p>
              <p className="text-xs text-mfneutralsn-300">{med.detail}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${med.badgeStyle}`}>
                {med.badge}
              </span>
              <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-200" />
            </div>
          </div>
          {i < medications.length - 1 && <Divider />}
        </React.Fragment>
      ))}

      <SectionDivider />

      {/* Immunization records */}
      <SectionHeader title="Immunization records" count={2} />
      <Divider />
      {immunizations.map((imm, i) => (
        <React.Fragment key={imm.name}>
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-mfneutralsn-500">{imm.name}</p>
              <p className="text-xs text-mfneutralsn-300">{imm.date}</p>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-mfneutralsn-200" />
          </div>
          {i < immunizations.length - 1 && <Divider />}
        </React.Fragment>
      ))}

      <div className="h-8" />
    </div>
  );
};
