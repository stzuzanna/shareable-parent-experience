import React, { useMemo, useState } from "react";
import { XIcon, ChevronLeftIcon, CalendarIcon, MinusIcon, PlusIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useAppToast } from "../../contexts/ToastContext";

interface RequestCareFormContentProps {
  onClose: () => void;
  onBack?: () => void;
}

type SelectableRow = {
  id: string;
  color: string;
  title: string;
  subtitle?: string;
  price: string;
  priceCents: number;
  priceSuffix?: string;
};

const SESSIONS: SelectableRow[] = [
  {
    id: "after-school",
    color: "#F5B4C8",
    title: "After School Care",
    subtitle: "Flexible",
    price: "$50.00",
    priceCents: 5000,
    priceSuffix: "/session",
  },
];

const FEES: SelectableRow[] = [
  { id: "breakfast", color: "#F5A623", title: "Breakfast", price: "$5.00", priceCents: 500 },
  { id: "lunch", color: "#B8E986", title: "Lunch", price: "$10.00", priceCents: 1000 },
];

const formatTotal = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const SessionRow = ({
  row,
  selected,
  onToggle,
}: {
  row: SelectableRow;
  selected: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className={`w-full flex items-center gap-3 py-3.5 text-left border-b border-mfneutralsn-75 active:bg-gray-50 ${
      selected ? "bg-mfprimaryp-50/50" : ""
    }`}
  >
    <div className="w-3 h-3 rounded-[3px] flex-shrink-0" style={{ backgroundColor: row.color }} />
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-medium text-mfneutralsn-500">{row.title}</p>
      {row.subtitle && <p className="text-[14px] text-mfneutralsn-300 mt-0.5">{row.subtitle}</p>}
    </div>
    <div className="text-right flex-shrink-0">
      <p className="text-[14px] font-semibold text-mfneutralsn-500">{row.price}</p>
      {row.priceSuffix && <p className="text-[14px] text-mfneutralsn-300 mt-0.5">{row.priceSuffix}</p>}
    </div>
  </button>
);

const FeeRow = ({
  row,
  quantity,
  onSelect,
  onQuantityChange,
}: {
  row: SelectableRow;
  quantity: number;
  onSelect: () => void;
  onQuantityChange: (next: number) => void;
}) => {
  const selected = quantity > 0;

  if (!selected) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className="w-full flex items-center gap-3 py-3.5 text-left border-b border-mfneutralsn-75 last:border-b-0 active:bg-gray-50"
      >
        <div className="w-3 h-3 rounded-[3px] flex-shrink-0" style={{ backgroundColor: row.color }} />
        <p className="flex-1 text-[14px] font-medium text-mfneutralsn-500">{row.title}</p>
        <p className="text-[14px] font-semibold text-mfneutralsn-500">{row.price}</p>
      </button>
    );
  }

  return (
    <div className="border-b border-mfneutralsn-75 last:border-b-0 bg-mfprimaryp-50/60 px-3 py-3">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-[3px] flex-shrink-0" style={{ backgroundColor: row.color }} />
        <p className="flex-1 text-[14px] font-medium text-mfneutralsn-500">{row.title}</p>
        <p className="text-[14px] font-semibold text-mfneutralsn-500">{row.price}</p>
      </div>
      <div className="mt-3 flex items-center gap-0 w-fit rounded-xl border border-mfneutralsn-200 bg-white overflow-hidden">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => {
            if (quantity <= 1) onQuantityChange(0);
            else onQuantityChange(quantity - 1);
          }}
          className="w-10 h-9 flex items-center justify-center text-mfneutralsn-400 active:bg-gray-50 border-r border-mfneutralsn-200"
        >
          <MinusIcon className="w-4 h-4" />
        </button>
        <span className="w-10 h-9 flex items-center justify-center text-[14px] font-medium text-mfneutralsn-500 tabular-nums">
          {quantity}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => onQuantityChange(quantity + 1)}
          className="w-10 h-9 flex items-center justify-center text-mfneutralsn-400 active:bg-gray-50 border-l border-mfneutralsn-200"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const RequestCareFormContent: React.FC<RequestCareFormContentProps> = ({ onClose, onBack }) => {
  const defaultDate = useMemo(() => {
    const d = new Date(2026, 1, 6);
    return d.toLocaleDateString("en-CA");
  }, []);

  const [requestDate, setRequestDate] = useState(defaultDate);
  const [selectedSession, setSelectedSession] = useState(false);
  const [feeQuantities, setFeeQuantities] = useState<Record<string, number>>({});
  const { showToast } = useAppToast();

  const { itemCount, totalCents, totalLabel } = useMemo(() => {
    let count = 0;
    let cents = 0;

    if (selectedSession) {
      count += 1;
      cents += SESSIONS[0].priceCents;
    }

    FEES.forEach((fee) => {
      const qty = feeQuantities[fee.id] ?? 0;
      if (qty > 0) {
        count += qty;
        cents += fee.priceCents * qty;
      }
    });

    return {
      itemCount: count,
      totalCents: cents,
      totalLabel: formatTotal(cents),
    };
  }, [selectedSession, feeQuantities]);

  const canRequest = requestDate.length > 0 && itemCount > 0;

  const setFeeQuantity = (id: string, qty: number) => {
    setFeeQuantities((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  };

  const handleRequest = () => {
    showToast("Request sent", "success");
    onClose();
  };

  return (
    <div className="flex flex-col max-h-[min(75vh,560px)] min-h-0">
      <div className="flex items-center gap-2 px-5 pt-2 pb-3 flex-shrink-0">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="w-8 h-8 flex items-center justify-center rounded-full border border-mfneutralsn-200 text-mfneutralsn-500 active:bg-gray-50 flex-shrink-0"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
        ) : null}
        <h2 className="text-[16px] font-semibold text-mfneutralsn-500 flex-1">Request</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-mfneutralsn-400 flex-shrink-0"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-5">
        <div className="relative mb-5">
          <CalendarIcon className="w-4 h-4 text-mfneutralsn-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            type="date"
            value={requestDate}
            onChange={(e) => setRequestDate(e.target.value)}
            className="pl-9 h-11 rounded-xl border-mfneutralsn-200 text-[14px] text-mfneutralsn-500 focus-visible:ring-mfprimaryp-400 focus-visible:border-mfprimaryp-400"
          />
        </div>

        {requestDate ? (
          <>
            <p className="text-[14px] font-medium text-mfneutralsn-300 mb-0">Sessions</p>
            <div className="border-t border-mfneutralsn-75 mb-4">
              {SESSIONS.map((row) => (
                <SessionRow
                  key={row.id}
                  row={row}
                  selected={selectedSession}
                  onToggle={() => setSelectedSession((v) => !v)}
                />
              ))}
            </div>

            <p className="text-[14px] font-medium text-mfneutralsn-300 mb-0">Fees</p>
            <div className="border-t border-mfneutralsn-75 mb-2">
              {FEES.map((row) => (
                <FeeRow
                  key={row.id}
                  row={row}
                  quantity={feeQuantities[row.id] ?? 0}
                  onSelect={() => setFeeQuantity(row.id, 1)}
                  onQuantityChange={(qty) => setFeeQuantity(row.id, qty)}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="flex-shrink-0 px-5 pb-6 pt-3 border-t border-mfneutralsn-75 bg-white">
        {itemCount > 0 && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-[14px] font-medium text-mfprimaryp-400">
              {itemCount} {itemCount === 1 ? "item" : "items"} selected
            </span>
            <span className="text-[14px] font-semibold text-mfneutralsn-500">{totalLabel}</span>
          </div>
        )}
        <button
          type="button"
          disabled={!canRequest}
          onClick={handleRequest}
          className={`w-full h-11 rounded-xl text-[14px] font-medium transition-opacity ${
            canRequest
              ? "bg-mfprimaryp-400 text-white active:opacity-90"
              : "bg-mfneutralsn-75 text-mfneutralsn-300 cursor-not-allowed"
          }`}
        >
          Request
        </button>
      </div>
    </div>
  );
};
