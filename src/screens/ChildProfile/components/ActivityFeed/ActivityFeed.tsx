import React from "react";
import { ActivityItem } from "../ActivityItem/ActivityItem";

const getDateString = (daysAgo: number) => {
  const date = new Date();
  // Calculate weekdays only (skip weekends) - go back in time
  let weekdaysBack = 0;
  let currentDate = new Date();
  
  while (weekdaysBack < daysAgo) {
    currentDate.setDate(currentDate.getDate() - 1);
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      weekdaysBack++;
    }
  }
  
  date.setTime(currentDate.getTime());
  
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

const weekdayActivities = [
  {
    day: 0,
    activities: [
      {
        icon: "👥",
        iconBg: "bg-blue-500",
        title: "Expected pick-up",
        subtitle: "16:30 — Amanda",
        time: "16:30",
      },
      {
        icon: "✓",
        iconBg: "bg-green-500",
        title: "Amanda checked into Infants",
        subtitle: "13:52 — Checked in by Miranda Freedman",
        time: "13:52",
      },
    ]
  },
  {
    day: 1,
    activities: [
      {
        icon: "✓",
        iconBg: "bg-red-400",
        title: "Amanda check out of Infants",
        subtitle: "13:52 — Signed out by Miranda Garrett",
        time: "13:52",
      },
      {
        icon: "🌙",
        iconBg: "bg-yellow-500",
        title: "Sleep",
        subtitle: "11:00-11:30 — Amanda slept for 30 minutes",
        time: "11:00",
      },
      {
        icon: "👶",
        iconBg: "bg-blue-500",
        title: "Amanda had diaper changed",
        subtitle: "10:10",
        time: "10:10",
      },
      {
        icon: "✓",
        iconBg: "bg-green-500",
        title: "Amanda checked into Infants",
        subtitle: "08:12 — Checked in by Miranda Freedman",
        time: "08:12",
      },
    ]
  },
  {
    day: 2,
    activities: [
      {
        icon: "✓",
        iconBg: "bg-red-400",
        title: "Amanda check out of Infants",
        subtitle: "15:45 — Signed out by Miranda Garrett",
        time: "15:45",
      },
      {
        icon: "🍽️",
        iconBg: "bg-orange-500",
        title: "Lunch",
        subtitle: "12:30 — Amanda enjoyed pasta with vegetables",
        time: "12:30",
      },
      {
        icon: "🌙",
        iconBg: "bg-yellow-500",
        title: "Sleep",
        subtitle: "11:15-12:00 — Amanda slept for 45 minutes",
        time: "11:15",
      },
      {
        icon: "👶",
        iconBg: "bg-blue-500",
        title: "Amanda had diaper changed",
        subtitle: "09:45",
        time: "09:45",
      },
      {
        icon: "✓",
        iconBg: "bg-green-500",
        title: "Amanda checked into Infants",
        subtitle: "08:30 — Checked in by Miranda Freedman",
        time: "08:30",
      },
    ]
  },
  {
    day: 3,
    activities: [
      {
        icon: "🤒",
        iconBg: "bg-red-400",
        title: "Amanda was sick",
        subtitle: "Amanda stayed home due to illness",
        time: "",
      },
    ]
  },
  {
    day: 4,
    activities: [
      {
        icon: "✓",
        iconBg: "bg-red-400",
        title: "Amanda check out of Infants",
        subtitle: "16:00 — Signed out by Miranda Garrett",
        time: "16:00",
      },
      {
        icon: "🍴",
        iconBg: "bg-orange-500",
        title: "Snack time",
        subtitle: "14:30 — Amanda had apple slices and crackers",
        time: "14:30",
      },
      {
        icon: "🌙",
        iconBg: "bg-yellow-500",
        title: "Sleep",
        subtitle: "13:00-13:45 — Amanda slept for 45 minutes",
        time: "13:00",
      },
      {
        icon: "🍴",
        iconBg: "bg-orange-500",
        title: "Lunch",
        subtitle: "12:00 — Amanda ate chicken and rice",
        time: "12:00",
      },
      {
        icon: "👶",
        iconBg: "bg-blue-500",
        title: "Amanda had diaper changed",
        subtitle: "10:20",
        time: "10:20",
      },
      {
        icon: "✓",
        iconBg: "bg-green-500",
        title: "Amanda checked into Infants",
        subtitle: "08:15 — Checked in by Miranda Freedman",
        time: "08:15",
      },
    ]
  },
  {
    day: 5,
    activities: [
      {
        icon: "✓",
        iconBg: "bg-red-400",
        title: "Amanda check out of Infants",
        subtitle: "15:30 — Signed out by Miranda Garrett",
        time: "15:30",
      },
      {
        icon: "🍴",
        iconBg: "bg-orange-500",
        title: "Lunch",
        subtitle: "12:15 — Amanda enjoyed soup and bread",
        time: "12:15",
      },
      {
        icon: "👶",
        iconBg: "bg-blue-500",
        title: "Amanda had diaper changed",
        subtitle: "11:30",
        time: "11:30",
      },
      {
        icon: "🌙",
        iconBg: "bg-yellow-500",
        title: "Sleep",
        subtitle: "10:45-11:15 — Amanda slept for 30 minutes",
        time: "10:45",
      },
      {
        icon: "✓",
        iconBg: "bg-green-500",
        title: "Amanda checked into Infants",
        subtitle: "08:00 — Checked in by Miranda Freedman",
        time: "08:00",
      },
    ]
  },
];

export const ActivityFeed = (): JSX.Element => {
  return (
    <div className="flex flex-col bg-white relative">
      {weekdayActivities.map((dayData, dayIndex) => (
        <div key={dayIndex} className="relative">
          <div className="flex flex-col gap-4 px-6 py-6">
            <h3 className="font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-mfneutralsn-500 text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] [font-style:var(--MF-body-text-body-emphasis-font-style)]">
              {getDateString(dayData.day)}
            </h3>
            
            <div className="flex flex-col gap-4 relative">
              {/* Timeline line */}
              {dayData.activities.length > 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200 z-0" />
              )}
              
              {dayData.activities.map((activity, index) => (
                <div key={index} className="relative z-10">
                  <ActivityItem
                    icon={activity.icon}
                    iconBg={activity.iconBg}
                    title={activity.title}
                    subtitle={activity.subtitle}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Connecting line between days */}
          {dayIndex < weekdayActivities.length - 1 && (
            <div className="absolute left-12 bottom-0 w-0.5 h-6 bg-gray-200 z-0" />
          )}
        </div>
      ))}
    </div>
  );
};