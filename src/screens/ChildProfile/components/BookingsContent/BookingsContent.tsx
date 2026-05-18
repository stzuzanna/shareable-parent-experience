import React from "react";

interface Booking {
  name: string;
  date: string;
  amount: string;
  status: "pending" | "paid";
}

const bookings: Booking[] = [
  { name: "After School Care", date: "Mar 7", amount: "$50.00", status: "pending" },
  { name: "After School Care", date: "Feb 1", amount: "$50.00", status: "paid" },
  { name: "Music Lessons", date: "Feb 3", amount: "$30.00", status: "paid" },
  { name: "Soccer Practice", date: "Feb 5", amount: "$25.00", status: "paid" },
  { name: "Art Club", date: "Feb 7", amount: "$40.00", status: "paid" },
  { name: "Science Workshop", date: "Feb 10", amount: "$60.00", status: "paid" },
];

const StatusIcon = ({ status }: { status: "pending" | "paid" }) => {
  if (status === "paid") {
    return (
      <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center flex-shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full border-2 border-orange-400 flex items-center justify-center flex-shrink-0">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#fb923c" strokeWidth="2.5" />
        <path d="M12 7v5l3 2" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export const BookingsContent = (): JSX.Element => {
  return (
    <div className="flex flex-col bg-mfneutralsn-50 pb-24 gap-4">
      {/* Care pattern */}
      <div className="mx-2 rounded-2xl border border-gray-100 bg-white">
        <div className="px-4 py-3">
          <span className="text-sm text-mfneutralsn-300">Care pattern</span>
        </div>
        <div className="h-px bg-gray-100 mx-4" />
        <div className="px-4 py-3">
          <p className="text-sm font-semibold text-mfneutralsn-500">Monthly full time</p>
          <p className="text-xs text-mfneutralsn-300 mt-0.5">$1,350/month · Aug 31 -</p>
        </div>
      </div>

      {/* Bookings list */}
      <div className="mx-2 rounded-2xl border border-gray-100 bg-white">
        <div className="px-4 py-3">
          <span className="text-sm text-mfneutralsn-300">Bookings</span>
        </div>
        <div className="h-px bg-gray-100 mx-4" />
        {bookings.map((b, i) => (
          <React.Fragment key={`${b.name}-${b.date}`}>
            {i > 0 && <div className="h-px bg-gray-100 mx-4" />}
            <div className="px-4 py-3 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-mfneutralsn-500 flex-1 min-w-0 truncate">{b.name}</p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-mfneutralsn-300 w-10 text-right">{b.date}</span>
                <span className="text-sm text-mfneutralsn-400 w-14 text-right">{b.amount}</span>
                <StatusIcon status={b.status} />
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
