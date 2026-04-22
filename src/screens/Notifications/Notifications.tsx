import { BASE_PATH } from '../../constants';
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { RSVPPage } from "../../components/RSVPPage/RSVPPage";
import { AppHeader } from "../../components/AppHeader/AppHeader";
import { BottomNav } from "../../components/BottomNav/BottomNav";

interface Notification {
  id: string;
  title: string;
  timestamp: string;
  avatar: string;
  type: 'permission' | 'invoice' | 'post' | 'document';
  onClick?: () => void;
  targetPost?: 'invoice' | 'photo-post' | 'event' | 'poll-post' | 'welcome';
}

const notifications: Notification[] = [
  {
    id: '3',
    title: 'Olivia Wilson shared a post',
    timestamp: 'Today',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'post'
  },
  {
    id: '1',
    title: 'Little Explorers would like you to give permission for Amanda regarding Can your child be photographed?',
    timestamp: 'Aug 29, 3:41pm',
    avatar: `${BASE_PATH}frame-12.png`,
    type: 'permission'
  },
  {
    id: '2',
    title: 'Sandbox Childcare sent you a new invoice',
    timestamp: 'Aug 29, 12:01pm',
  avatar: `${BASE_PATH}nursery-logo-1.svg`,
    type: 'invoice'
  },
  {
    id: '4',
    title: 'Little Explorers invited you to Parent teacher conference',
    timestamp: 'Aug 27, 2:30pm',
    avatar: `${BASE_PATH}frame-12.png`,
    type: 'permission'
  },
  {
    id: '5',
    title: 'Little Explorers published a lesson plan',
    timestamp: 'Aug 26, 10:15am',
    avatar: `${BASE_PATH}frame-12.png`,
    type: 'document'
  },
];

export const Notifications = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const navigate = useNavigate();
  const [showRSVP, setShowRSVP] = useState(false);
  const [rsvpState, setRsvpState] = useState({
    hasReplied: false,
    isAttending: null as boolean | null,
    attendeeCount: 1,
    comment: ""
  });

  const handleNotificationClick = (notification: Notification) => {
    switch (notification.type) {
      case 'permission':
        if (notification.id === '4') {
          // Parent teacher conference notification
          setShowRSVP(true);
        } else {
          navigate('/child-profile/about/permissions');
        }
        break;
      case 'invoice':
        navigate('/');
        break;
      case 'post':
        if (notification.targetPost) {
          navigate(`/?post=${notification.targetPost}`);
        } else {
          navigate('/');
        }
        break;
      case 'document':
        navigate('/activity-plans');
        break;
      default:
        break;
    }
  };

  if (showRSVP) {
    return (
      <RSVPPage 
        onClose={() => setShowRSVP(false)} 
        initialState={rsvpState}
        onStateChange={setRsvpState}
      />
    );
  }

  const appContent = (
    <div className={`flex flex-col bg-mfneutralsn-50 ${shouldShowFrame ? 'h-full' : 'min-h-screen'} ${!shouldShowFrame ? 'touch:h-screen' : ''}`}>
      <AppHeader title="Notifications" />

      {/* Content */}
      <div className={`flex-1 overflow-y-auto bg-gray-50 ${!shouldShowFrame ? 'touch:pb-20' : ''}`}>
        <div className="flex flex-col">
          {notifications.map((notification) => (
            <Button
              key={notification.id}
              variant="ghost"
              onClick={() => handleNotificationClick(notification)}
              className="flex items-start gap-3 h-auto p-4 text-left rounded-none hover:bg-gray-100 border-b border-gray-100 min-h-[80px]"
            >
              <Avatar className="w-12 h-12 flex-shrink-0 mt-1">
                <AvatarImage src={notification.avatar} alt="Notification avatar" />
                <AvatarFallback>
                  {notification.type === 'post' ? 'OW' : 'LE'}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-start flex-1 min-w-0">
                <p className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-400 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)] mb-2 break-words whitespace-normal overflow-wrap-anywhere pr-2">
                  {notification.title}
                </p>
                <span className="font-MF-body-text-body-small font-[number:var(--MF-body-text-body-small-font-weight)] text-mfneutralsn-300 text-[length:var(--MF-body-text-body-small-font-size)] tracking-[var(--MF-body-text-body-small-letter-spacing)] leading-[var(--MF-body-text-body-small-line-height)] [font-style:var(--MF-body-text-body-small-font-style)]">
                  {notification.timestamp}
                </span>
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

  return appContent;
};