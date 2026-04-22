import React from "react";
import { HomeIcon, MessageSquareIcon, BellIcon, AlignJustifyIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BASE_PATH } from "../../constants";

export const BottomNav = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const iconClass = (path: string) =>
    `w-6 h-6 transition-colors ${isActive(path) ? "text-mfneutralsn-500" : "text-mfneutralsn-400"}`;

  return (
    <div className="flex items-center justify-between px-5 py-2.5 bg-white rounded-3xl mx-3 mb-3 border border-gray-100 shadow-sm">
      {/* Home / Newsfeed */}
      <button
        onClick={() => navigate("/")}
        className="no-zoom flex items-center justify-center w-12 h-12 rounded-2xl"
      >
        <HomeIcon className={iconClass("/")} />
      </button>

      {/* Child profile */}
      <button
        onClick={() => navigate("/child-profile")}
        className="no-zoom flex items-center justify-center w-12 h-12 rounded-2xl"
      >
        <Avatar className="w-10 h-10">
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
        className="no-zoom flex items-center justify-center w-12 h-12 rounded-2xl"
      >
        <MessageSquareIcon className={iconClass("/messages")} />
      </button>

      {/* Notifications */}
      <button
        onClick={() => navigate("/notifications")}
        className="no-zoom flex items-center justify-center w-12 h-12 rounded-2xl relative"
      >
        <BellIcon className={iconClass("/notifications")} />
        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full" />
      </button>

      {/* Account */}
      <button
        onClick={() => navigate("/menu")}
        className="no-zoom flex items-center justify-center w-12 h-12 rounded-2xl relative"
      >
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={`${BASE_PATH}avatar-2.png`}
            alt="Account"
            className="object-cover"
          />
          <AvatarFallback>AP</AvatarFallback>
        </Avatar>
        <div className="absolute bottom-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
          <AlignJustifyIcon className="w-2.5 h-2.5 text-mfneutralsn-500" />
        </div>
      </button>
    </div>
  );
};
