import { BASE_PATH } from '../../constants';
import React from "react";
import { useNavigate } from "react-router-dom";
import { DeviceFrame } from "../../components/DeviceFrame/DeviceFrame";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { SearchIcon, ChevronDownIcon, EditIcon } from "lucide-react";

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
    <div className={`flex flex-col bg-white ${shouldShowFrame ? 'h-full' : 'min-h-screen'} ${!shouldShowFrame ? 'touch:h-screen' : ''}`}>
      {/* Header */}
      <header className={`flex flex-col w-full items-start relative ${!shouldShowFrame ? 'sticky top-0 z-50' : ''}`}>
        <div className={`flex items-end justify-center px-0 py-2 relative w-full bg-mfprimaryp-400 ${!shouldShowFrame ? 'hidden' : ''}`}>
          <div className="flex flex-col w-[106px] items-start justify-center gap-2 pl-5 pr-0 pt-0 pb-[3px] relative">
            <div className="relative w-[54px] h-[21px] rounded-3xl">
              <div className="absolute top-px left-[11px] [font-family:'Inter',Helvetica] font-medium text-mfneutralsn-0 text-base text-center tracking-[-0.32px] leading-[21px] whitespace-nowrap">
                9:41
              </div>
            </div>
          </div>

          <div className="flex flex-col h-8 items-center justify-center relative flex-1">
            <div className="relative flex-1 w-[108px] bg-mfneutralsn-0 rounded-[100px] opacity-0" />
          </div>

          <img
            className="relative w-[106px] h-full"
            alt="Right side"
            src={`${BASE_PATH}right-side.svg`}
          />
        </div>

        <nav className="flex h-12 items-center justify-between px-4 py-2 relative w-full bg-mfprimaryp-400">
          <h1 className="font-MF-headings-h6-emphasis font-[number:var(--MF-headings-h6-emphasis-font-weight)] text-mfneutralsn-0 text-[length:var(--MF-headings-h6-emphasis-font-size)] leading-[var(--MF-headings-h6-emphasis-line-height)] tracking-[var(--MF-headings-h6-emphasis-letter-spacing)] [font-style:var(--MF-headings-h6-emphasis-font-style)]">
            Messages
          </h1>

          <div className="w-6 h-6" />
        </nav>
      </header>

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

      {/* Bottom Navigation */}
      <div className={`bottom-nav flex flex-col max-w-screen-md items-center justify-end px-[9px] py-0 w-full bg-mfneutralsn-0 rounded-[0px_0px_16px_16px] ${!shouldShowFrame ? 'sticky bottom-0 z-50 shadow-lg' : ''}`}>
        <div className="flex items-center gap-[46px] pl-2 pr-4 pt-3 pb-[21px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center justify-between relative flex-1 grow">
            {/* Newsfeed */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl"
            >
              <img
                className="relative w-7 h-7 ml-[-2.00px] mr-[-2.00px]"
                alt="Newsfeed"
                src={`${BASE_PATH}navigation.svg`}
              />
            </Button>

            {/* Child Profile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/child-profile')}
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={`${BASE_PATH}infant--girl--profile-picture--caucasian--dark-hair.png`}
                  alt="Child profile"
                  className="border border-solid border-white object-cover"
                />
                <AvatarFallback>CP</AvatarFallback>
              </Avatar>
            </Button>

            {/* Messages - Active */}
            <Button
              variant="ghost"
              size="icon"
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl bg-mfprimaryp-100"
            >
              <img
                className="relative w-7 h-7 ml-[-2.00px] mr-[-2.00px]"
                alt="Messages"
                src={`${BASE_PATH}navigation-2.svg`}
              />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/notifications')}
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl"
            >
              <img
                className="relative w-7 h-7 ml-[-2.00px] mr-[-2.00px]"
                alt="Notifications"
                src={`${BASE_PATH}navigation-1.svg`}
              />
            </Button>

            {/* Account */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/menu')}
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={`${BASE_PATH}avatar-2.png`}
                  alt="Account"
                  className="border border-solid border-white object-cover"
                />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DeviceFrame showFrame={shouldShowFrame}>
      {appContent}
    </DeviceFrame>
  );
};