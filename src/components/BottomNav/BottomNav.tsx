import React from "react";
import { HomeIcon, CalendarIcon, InboxIcon, XIcon, PlusIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BASE_PATH } from "../../constants";
import { useHomeTabsVariant } from "../../hooks/useHomeTabsVariant";
import { useGlobalUi } from "../../contexts/GlobalUiContext";

export const BottomNav = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabsVariant = useHomeTabsVariant();
  const { toggleAddSheet, addSheetOpen } = useGlobalUi();
  const isPills = tabsVariant === "pills" || tabsVariant === "sidekick";

  const isActive = (path: string) => location.pathname === path;

  const iconColor = (path: string) =>
    isActive(path) ? "text-mfneutralsn-500" : "text-mfneutralsn-300";

  const navItems = (
    <>
      {/* Home */}
      <button
        onClick={() => navigate("/")}
        className={`flex items-center justify-center w-10 h-10 rounded-[10px] transition-all no-zoom ${isActive("/") ? "bg-white border border-[#e2e2e9]" : ""}`}
      >
        <HomeIcon className={`w-[22px] h-[22px] ${iconColor("/")}`} />
      </button>

      {/* Child avatar */}
      <button
        onClick={() => navigate("/child-profile")}
        className="flex items-center justify-center w-10 h-10 rounded-[10px] transition-all no-zoom"
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

      {/* Calendar */}
      <button
        onClick={() => navigate("/calendar")}
        className={`flex items-center justify-center w-10 h-10 rounded-[10px] transition-all no-zoom ${isActive("/calendar") ? "bg-white border border-[#e2e2e9]" : ""}`}
      >
        <CalendarIcon className={`w-[22px] h-[22px] ${iconColor("/calendar")}`} />
      </button>

      {/* Inbox */}
      <button
        onClick={() => navigate("/inbox")}
        className={`flex items-center justify-center w-10 h-10 rounded-[10px] transition-all no-zoom relative ${isActive("/inbox") ? "bg-white border border-[#e2e2e9]" : ""}`}
      >
        <InboxIcon className={`w-[22px] h-[22px] ${iconColor("/inbox")}`} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Profile avatar with menu badge */}
      <button
        onClick={() => navigate("/menu")}
        className={`flex items-center justify-center w-10 h-10 rounded-[10px] transition-all no-zoom relative ${isActive("/menu") ? "bg-white border border-[#e2e2e9]" : ""}`}
      >
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={`${BASE_PATH}avatar-2.png`}
            alt="Account"
            className="object-cover"
          />
          <AvatarFallback>MF</AvatarFallback>
        </Avatar>
      </button>
    </>
  );

  if (isPills) {
    return (
      <div className="pt-3 bg-white/70 backdrop-blur-md">
        <div className="flex items-center justify-center gap-2 mx-2 mb-2">
          {/* Nav cluster */}
          <div className="flex items-center justify-between gap-1 px-3 py-2 bg-mfneutralsn-50 rounded-2xl border border-gray-100 flex-1">
            {navItems}
          </div>

          {/* GAB */}
          <div className="rounded-2xl p-[1.5px] bg-gradient-to-br from-mfprimaryp-400 via-pink-300 to-cyan-300">
            <button
              onClick={toggleAddSheet}
              aria-label={addSheetOpen ? "Close quick actions" : "Open quick actions"}
              className="flex items-center justify-center w-14 h-14 rounded-[14px] bg-white"
            >
              {addSheetOpen ? (
                <XIcon className="w-5 h-5 text-mfneutralsn-500" />
              ) : (
                <PlusIcon className="w-5 h-5 text-mfprimaryp-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-mfneutralsn-50 rounded-2xl mx-2 mb-2 border border-gray-100">
      {navItems}
    </div>
  );
};
