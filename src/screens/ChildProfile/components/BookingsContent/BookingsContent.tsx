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
      <div className="w-5 h-5 rounded-full border-[1.5px] border-green-500 flex items-center justify-center flex-shrink-0">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-5 h-5 rounded-full border-[1.5px] border-orange-400 flex items-center justify-center flex-shrink-0">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#fb923c" strokeWidth="3" />
        <path d="M12 7v5l3 2" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="px-[8.5px]">
    <div className="rounded-2xl border border-mfneutralsn-75 bg-white">
      <div className="px-4 pt-3 pb-2">
        <span className="text-[14px] text-mfneutralsn-300">{title}</span>
      </div>
      {children}
    </div>
  </div>
);

export const BookingsContent = (): JSX.Element => {
  return (
    <div className="flex flex-col bg-white pb-24 gap-3 pt-1">
      <Section title="Care pattern">
        <div className="px-4 pb-3">
          <p className="text-[14px] font-medium text-mfneutralsn-500 leading-tight">Monthly full time</p>
          <p className="text-[12px] text-mfneutralsn-300 mt-1 leading-tight">$1,350/month · Aug 31 -</p>
        </div>
      </Section>

      <Section title="Bookings">
        <div className="flex flex-col">
          {bookings.map((b, i) => (
            <div
              key={`${b.name}-${b.date}-${i}`}
              className="px-4 py-4 flex items-center justify-between gap-2 border-t border-mfneutralsn-75 first:border-t-0"
            >
              <p className="text-[14px] font-medium text-mfneutralsn-500 flex-1 min-w-0 truncate leading-tight">{b.name}</p>
              <span className="text-[12px] text-mfneutralsn-300 w-10 text-right">{b.date}</span>
              <span className="text-[13px] text-mfneutralsn-400 w-14 text-right tabular-nums">{b.amount}</span>
              <StatusIcon status={b.status} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};
