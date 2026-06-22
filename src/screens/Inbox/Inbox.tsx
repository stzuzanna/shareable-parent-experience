import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { BottomNav } from "../../components/BottomNav/BottomNav";
import { RSVPPage } from "../../components/RSVPPage/RSVPPage";
import { BASE_PATH } from "../../constants";
import { EditIcon, SearchIcon } from "lucide-react";

// ─── Messages data ────────────────────────────────────────────────────────────

const conversations = [
  {
    id: 1,
    name: "Olivia Wilson",
    lastMessage: "Absolutely, her health comes first. I'll keep yo...",
    date: "Today",
    avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    unread: true,
  },
  {
    id: 2,
    name: "Pre-schoolers",
    lastMessage: "Looking forward to it! Sofia has been practici...",
    date: "Yesterday",
    avatar: `${BASE_PATH}frame-12.png`,
    isGroup: true,
    unread: false,
  },
];

// ─── Notifications data (matches original Notifications page) ─────────────────

type NotifType = "permission" | "invoice" | "post" | "document";

interface NotifItem {
  id: string;
  title: string;
  timestamp: string;
  avatar: string;
  type: NotifType;
  targetPost?: string;
  unread?: boolean;
}

const notifItems: NotifItem[] = [
  {
    id: "3",
    title: "Olivia Wilson shared a post",
    timestamp: "Today",
    avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    type: "post",
    unread: true,
  },
  {
    id: "1",
    title: "Little Explorers would like you to give permission for Amanda regarding Can your child be photographed?",
    timestamp: "Aug 29, 3:41pm",
    avatar: `${BASE_PATH}frame-12.png`,
    type: "permission",
    unread: true,
  },
  {
    id: "2",
    title: "Sandbox Childcare sent you a new invoice",
    timestamp: "Aug 29, 12:01pm",
    avatar: `${BASE_PATH}nursery-logo-1.svg`,
    type: "invoice",
    unread: false,
  },
  {
    id: "4",
    title: "Little Explorers invited you to Parent teacher conference",
    timestamp: "Aug 27, 2:30pm",
    avatar: `${BASE_PATH}frame-12.png`,
    type: "permission",
    unread: false,
  },
  {
    id: "5",
    title: "Little Explorers published a lesson plan",
    timestamp: "Aug 26, 10:15am",
    avatar: `${BASE_PATH}frame-12.png`,
    type: "document",
    unread: false,
  },
];

// ─── Tab toggle ───────────────────────────────────────────────────────────────

type InboxTab = "messages" | "notifications";

const TabToggle: React.FC<{ active: InboxTab; onChange: (t: InboxTab) => void }> = ({ active, onChange }) => (
  <div className="flex items-center gap-2 px-4 pb-3 pt-1">
    {(["messages", "notifications"] as InboxTab[]).map((t) => (
      <button
        key={t}
        onClick={() => onChange(t)}
        className={`h-8 px-4 rounded-full text-[13px] font-semibold transition-colors capitalize ${
          active === t
            ? "bg-mfprimaryp-400 text-white"
            : "bg-mfneutralsn-50 border border-mfneutralsn-100 text-mfneutralsn-400"
        }`}
      >
        {t.charAt(0).toUpperCase() + t.slice(1)}
      </button>
    ))}
  </div>
);

// ─── Messages list ────────────────────────────────────────────────────────────

const MessagesList: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col">
      {/* Search */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-mfneutralsn-50 border border-mfneutralsn-100">
          <SearchIcon className="w-4 h-4 text-mfneutralsn-300 flex-shrink-0" />
          <input placeholder="Search messages…" className="flex-1 bg-transparent text-[14px] text-mfneutralsn-500 placeholder:text-mfneutralsn-200 outline-none" />
        </div>
      </div>

      {conversations.map((c, i) => (
        <button
          key={c.id}
          onClick={() => navigate(`/messages/chat/${c.id}`)}
          className={`flex items-center gap-3 px-4 py-3.5 text-left active:bg-mfneutralsn-50 transition-colors ${i < conversations.length - 1 ? "border-b border-mfneutralsn-75" : ""}`}
        >
          <Avatar className="w-11 h-11 flex-shrink-0">
            <AvatarImage src={c.avatar} alt={c.name} className="object-cover" />
            <AvatarFallback>{c.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className={`text-[14px] leading-snug truncate ${c.unread ? "font-semibold text-mfneutralsn-500" : "font-medium text-mfneutralsn-500"}`}>{c.name}</span>
              <span className="text-[11px] text-mfneutralsn-300 flex-shrink-0 ml-2">{c.date}</span>
            </div>
            <p className="text-[13px] text-mfneutralsn-300 truncate">{c.lastMessage}</p>
          </div>
          {c.unread && <span className="w-2 h-2 rounded-full bg-mfprimaryp-400 flex-shrink-0" />}
        </button>
      ))}
    </div>
  );
};

// ─── Notifications list ───────────────────────────────────────────────────────

const NotificationsList: React.FC<{
  onShowRSVP: () => void;
}> = ({ onShowRSVP }) => {
  const navigate = useNavigate();

  const handleClick = (n: NotifItem) => {
    switch (n.type) {
      case "permission":
        if (n.id === "4") { onShowRSVP(); }
        else { navigate("/child-profile", { state: { aboutSection: "permissions" } }); }
        break;
      case "invoice":
        navigate("/");
        break;
      case "post":
        navigate(n.targetPost ? `/?post=${n.targetPost}` : "/");
        break;
      case "document":
        navigate("/activity-plans");
        break;
    }
  };

  return (
    <div className="flex flex-col">
      {notifItems.map((n, i) => (
        <button
          key={n.id}
          onClick={() => handleClick(n)}
          className={`flex items-start gap-3 px-4 py-3.5 text-left active:bg-mfneutralsn-50 transition-colors ${n.unread ? "bg-mfprimaryp-50/30" : ""} ${i < notifItems.length - 1 ? "border-b border-mfneutralsn-75" : ""}`}
        >
          <Avatar className="w-10 h-10 flex-shrink-0 mt-0.5">
            <AvatarImage src={n.avatar} alt="" className="object-cover" />
            <AvatarFallback>{n.type === "post" ? "OW" : "LE"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className={`text-[14px] leading-snug break-words ${n.unread ? "font-semibold text-mfneutralsn-500" : "font-medium text-mfneutralsn-400"}`}>{n.title}</p>
            <p className="text-[12px] text-mfneutralsn-300 mt-0.5">{n.timestamp}</p>
          </div>
          {n.unread && <span className="w-2 h-2 rounded-full bg-mfprimaryp-400 flex-shrink-0 mt-1.5" />}
        </button>
      ))}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export const Inbox = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const [tab, setTab] = useState<InboxTab>("messages");
  const [showRSVP, setShowRSVP] = useState(false);
  const [rsvpState, setRsvpState] = useState({
    hasReplied: false,
    isAttending: null as boolean | null,
    attendeeCount: 1,
    comment: "",
  });

  if (showRSVP) {
    return (
      <RSVPPage
        onClose={() => setShowRSVP(false)}
        initialState={rsvpState}
        onStateChange={setRsvpState}
      />
    );
  }

  return (
    <div className={`flex flex-col bg-white ${shouldShowFrame ? "h-full" : "min-h-screen"}`}>
      {/* Header */}
      <header className="flex flex-col w-full bg-white">
        {shouldShowFrame && (
          <div className="flex items-center justify-between px-5 pt-2 pb-1">
            <span className="font-semibold text-mfneutralsn-500 text-[15px]">9:41</span>
            <img className="h-4" alt="Status icons" src={`${BASE_PATH}right-side.svg`} />
          </div>
        )}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <h1 className="text-[22px] font-bold text-mfneutralsn-500 tracking-tight">Inbox</h1>
          {tab === "messages" && (
            <button className="w-8 h-8 flex items-center justify-center active:opacity-70">
              <EditIcon className="w-5 h-5 text-mfneutralsn-400" />
            </button>
          )}
        </div>
        <TabToggle active={tab} onChange={setTab} />
        <div className="h-px bg-mfneutralsn-75" />
      </header>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto ${!shouldShowFrame ? "pb-20" : ""}`}>
        {tab === "messages" ? <MessagesList /> : <NotificationsList onShowRSVP={() => setShowRSVP(true)} />}
      </div>

      <div className={!shouldShowFrame ? "sticky bottom-0 z-50" : ""}>
        <BottomNav />
      </div>
    </div>
  );
};
