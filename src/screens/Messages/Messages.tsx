import { BASE_PATH } from '../../constants';
import React from "react";
import { useNavigate } from "react-router-dom";
import { DeviceFrame } from "../../components/DeviceFrame/DeviceFrame";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { AppHeader } from "../../components/AppHeader/AppHeader";
import { BottomNav } from "../../components/BottomNav/BottomNav";
import { SearchIcon, EditIcon } from "lucide-react";

const conversations = [
  {
    id: 1,
    participants: "Olivia Wilson",
    lastMessage: "Absolutely, her health comes first. I'll keep yo...",
    date: "Today",
    avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 2,
    participants: "Pre-schoolers",
    lastMessage: "Looking forward to it! Sofia has been practici...",
    date: "Yesterday",
  avatar: `${BASE_PATH}frame-12.png`,
    isGroup: true,
  },
];

export const Messages = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();

  const appContent = (
    <div className={`flex flex-col bg-mfneutralsn-50 ${shouldShowFrame ? 'h-full' : 'min-h-screen'} ${!shouldShowFrame ? 'touch:h-screen' : ''}`}>
      <AppHeader title="Messages" rightSlot={<EditIcon className="w-5 h-5 text-mfneutralsn-400" />} />

      {/* Content */}
      <div className={`flex-1 bg-white ${!shouldShowFrame ? 'touch:pb-20' : ''}`}>
        {/* Search Bar */}
        <div className="px-4 py-3 bg-gray-50">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 pr-10 h-10 bg-white border-gray-200 rounded-lg font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]"
            />
            <EditIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Conversations Header */}

        {/* Conversations List */}
        <div className="flex flex-col">
          {conversations.map((conversation) => (
            <Button
              key={conversation.id}
              variant="ghost"
              onClick={() => navigate(`/messages/chat/${conversation.id}`)}
              className="flex items-center gap-3 h-auto p-4 text-left rounded-none hover:bg-gray-50 border-b border-gray-50"
            >
              <Avatar className="w-12 h-12 flex-shrink-0">
                <AvatarImage src={conversation.avatar} alt="Conversation avatar" />
                <AvatarFallback>
                  {conversation.participants.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-start flex-1 min-w-0">
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-mfneutralsn-500 text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] [font-style:var(--MF-body-text-body-emphasis-font-style)] truncate">
                    {conversation.participants}
                  </span>
                  <span className="font-MF-body-text-body-small font-[number:var(--MF-body-text-body-small-font-weight)] text-mfneutralsn-300 text-[length:var(--MF-body-text-body-small-font-size)] tracking-[var(--MF-body-text-body-small-letter-spacing)] leading-[var(--MF-body-text-body-small-line-height)] [font-style:var(--MF-body-text-body-small-font-style)] flex-shrink-0 ml-2">
                    {conversation.date}
                  </span>
                </div>
                <p className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-300 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)] truncate w-full">
                  {conversation.lastMessage}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className={!shouldShowFrame ? 'sticky bottom-0 z-50' : ''}>
        <BottomNav />
      </div>
    </div>
  );

  return (
    <DeviceFrame showFrame={shouldShowFrame}>
      {appContent}
    </DeviceFrame>
  );
};