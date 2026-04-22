import React from "react";
import { HomeIcon, MessageSquareIcon, BellIcon, AlignJustifyIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BASE_PATH } from "../../constants";

// Active state: white rounded square with subtle gray border (Figma: bg-white border-[#e2e2e9] rounded-[8px])
const activeBtn = "bg-white border border-[#e2e2e9]";
const baseBtn = "no-zoom flex items-center justify-center w-10 h-10 rounded-[10px] transition-all";

export const BottomNav = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const iconColor = (path: string) =>
    isActive(path) ? "text-mfneutralsn-500" : "text-mfneutralsn-300";

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-mfneutralsn-50 rounded-2xl mx-2 mb-2 border border-gray-100">
      {/* Home / Newsfeed */}
      <button
        onClick={() => navigate("/")}
        className={`${baseBtn} ${isActive("/") ? activeBtn : ""}`}
      >
        <HomeIcon className={`w-6 h-6 ${iconColor("/")}`} />
      </button>

      {/* Child profile — avatar, no active bg (avatar is its own indicator) */}
      <button
        onClick={() => navigate("/child-profile")}
        className={`${baseBtn} ${isActive("/child-profile") ? activeBtn : ""}`}
      >
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={`${BASE_PATH}pexels-daisy-anderson-5581091-1.png`}
            alt="Child profile"
            className="object-cover"
          />
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
      </button>

      {/* Messages */}
      <button
        onClick={() => navigate("/messages")}
        className={`${baseBtn} ${isActive("/messages") ? activeBtn : ""}`}
      >
        <MessageSquareIcon className={`w-6 h-6 ${iconColor("/messages")}`} />
      </button>

      {/* Notifications — with red dot badge */}
      <button
        onClick={() => navigate("/notifications")}
        className={`${baseBtn} ${isActive("/notifications") ? activeBtn : ""} relative`}
      >
        <BellIcon className={`w-6 h-6 ${iconColor("/notifications")}`} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Account — avatar with menu badge */}
      <button
        onClick={() => navigate("/menu")}
        className={`${baseBtn} ${isActive("/menu") ? activeBtn : ""} relative`}
      >
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={`${BASE_PATH}avatar-2.png`}
            alt="Account"
            className="object-cover"
          />
          <AvatarFallback>AP</AvatarFallback>
        </Avatar>
        <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center border border-gray-200">
          <AlignJustifyIcon className="w-2 h-2 text-mfneutralsn-500" />
        </div>
      </button>
    </div>
  );
};
