import React from "react";
import { HomeIcon, MessageSquareIcon, BellIcon, PlusIcon, XIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BASE_PATH } from "../../constants";
import { useHomeTabsVariant } from "../../hooks/useHomeTabsVariant";
import { useGlobalUi } from "../../contexts/GlobalUiContext";
import { useGabVariant, setGabVariant, type GabVariant } from "../../hooks/useGabVariant";

const activeBtn = "bg-white border border-[#e2e2e9]";
const baseBtn = "no-zoom flex items-center justify-center w-10 h-10 rounded-[10px] transition-all";

export const BottomNav = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabsVariant = useHomeTabsVariant();
  const { toggleAddSheet, addSheetOpen } = useGlobalUi();
  const gabVariant = useGabVariant();
  const isV3 = tabsVariant === "sidekick";

  const isActive = (path: string) => location.pathname === path;

  const iconColor = (path: string) =>
    isActive(path) ? "text-mfneutralsn-500" : "text-mfneutralsn-300";

  // The sidekick version shares the pills navigation chrome (glass bar + GAB
  // sparkle) so the bottom nav stays consistent when switching versions.
  const isPills = tabsVariant === "pills" || tabsVariant === "sidekick";

  if (isPills) {
    return (
      // Glass-style 12px breathing room above the nav so the GAB sparkle (and
      // the rest of the nav) doesn't touch content scrolling behind it.
      <div className="pt-3 bg-white/70 backdrop-blur-md">
        <div className="flex items-center justify-center gap-2 mx-2 mb-2">
          {/* Main nav cluster: Home / child / messages / parent */}
          <div className="flex items-center justify-between gap-1 px-3 py-2 bg-mfneutralsn-50 rounded-2xl border border-gray-100 flex-1">
          <button
            onClick={() => navigate("/")}
            className={`${baseBtn} ${isActive("/") ? activeBtn : ""}`}
          >
            <HomeIcon className={`w-6 h-6 ${iconColor("/")}`} />
          </button>
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
          <button
            onClick={() => navigate("/messages")}
            className={`${baseBtn} ${isActive("/messages") ? activeBtn : ""}`}
          >
            <MessageSquareIcon className={`w-6 h-6 ${iconColor("/messages")}`} />
          </button>
          <button
            onClick={() => navigate("/menu")}
            className={`${baseBtn} ${isActive("/menu") ? activeBtn : ""}`}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={`${BASE_PATH}avatar-2.png`}
                alt="Account"
                className="object-cover"
              />
              <AvatarFallback>AP</AvatarFallback>
            </Avatar>
          </button>
        </div>

        {/* Separated GAB (or X when the sheet is open) with gradient outline */}
        <div className="flex flex-col items-center gap-1">
          {/* A/B/C GAB variant switcher — only shown in v3 */}
          {isV3 && (
            <div className="flex items-center gap-1">
              {(["arc", "grid", "pills"] as GabVariant[]).map((v, i) => (
                <button
                  key={v}
                  onClick={() => setGabVariant(v)}
                  className={`w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center transition-colors ${
                    gabVariant === v
                      ? "bg-mfprimaryp-400 text-white"
                      : "bg-mfneutralsn-100 text-mfneutralsn-300"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </button>
              ))}
            </div>
          )}
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
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-mfneutralsn-50 rounded-2xl mx-2 mb-2 border border-gray-100">
      {/* Home / Newsfeed */}
      <button
        onClick={() => navigate("/")}
        className={`${baseBtn} ${isActive("/") ? activeBtn : ""}`}
      >
        <HomeIcon className={`w-6 h-6 ${iconColor("/")}`} />
      </button>

      {/* Child profile — avatar */}
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

      {/* Notifications */}
      <button
        onClick={() => navigate("/notifications")}
        className={`${baseBtn} ${isActive("/notifications") ? activeBtn : ""} relative`}
      >
        <BellIcon className={`w-6 h-6 ${iconColor("/notifications")}`} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Account */}
      <button
        onClick={() => navigate("/menu")}
        className={`${baseBtn} ${isActive("/menu") ? activeBtn : ""}`}
      >
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={`${BASE_PATH}avatar-2.png`}
            alt="Account"
            className="object-cover"
          />
          <AvatarFallback>AP</AvatarFallback>
        </Avatar>
      </button>
    </div>
  );
};
