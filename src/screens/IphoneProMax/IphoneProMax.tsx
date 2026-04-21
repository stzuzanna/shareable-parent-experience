import { BASE_PATH } from '../../constants';
import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DeviceFrame } from "../../components/DeviceFrame/DeviceFrame";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { useInteractivity } from "../../hooks/useInteractivity";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { CommentSection } from "./sections/CommentSection/CommentSection";
import { NavigationSection } from "./sections/NavigationSection/NavigationSection";
import { NewsPostSection } from "./sections/NewsPostSection/NewsPostSection";
import { PostFeedSection } from "./sections/PostFeedSection/PostFeedSection";
import { PollPost } from "../../components/PollPost/PollPost";
import { RSVPPage } from "../../components/RSVPPage/RSVPPage";
import { PhotoPostSection } from "./sections/PhotoPostSection/PhotoPostSection";
import { WelcomePostSection } from "./sections/WelcomePostSection/WelcomePostSection";

const navigationItems = [
  {
  icon: `${BASE_PATH}navigation.svg`,
    isActive: true,
    hasNotification: false,
  },
  {
  icon: `${BASE_PATH}navigation-2.svg`,
    isActive: false,
    hasNotification: true,
  },
  {
  icon: `${BASE_PATH}navigation-1.svg`,
    isActive: false,
    hasNotification: true,
  },
];

export const IphoneProMax = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const { toggleLike, addReaction, removeReaction, addComment, addPollVote, isLiked, getReaction, getComments, getPollVotes } = useInteractivity();
  const [isPaid, setIsPaid] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);
  const [rsvpState, setRsvpState] = useState({
    hasReplied: false,
    isAttending: null as boolean | null,
    attendeeCount: 1,
    comment: ""
  });
  const navigate = useNavigate();
  const location = useLocation();

  const invoiceRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const eventRef = useRef<HTMLDivElement | null>(null);
  const pollRef = useRef<HTMLDivElement | null>(null);
  const welcomeRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const target = params.get('post');
    const map: Record<string, React.RefObject<HTMLDivElement>> = {
      'invoice': invoiceRef,
      'photo-post': photoRef,
      'event': eventRef,
      'poll-post': pollRef,
      'welcome': welcomeRef,
    };
    const ref = target ? map[target] : undefined;
    if (ref?.current) {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      const attemptScroll = (attemptsLeft: number) => {
        const element = ref.current;
        if (!element) return;
        // Let the browser pick the correct scrollable ancestor (our feed container)
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (attemptsLeft > 0) {
          timeoutId = setTimeout(() => attemptScroll(attemptsLeft - 1), 200);
        }
      };

      // Allow layout to paint before scrolling and retry a few times
      requestAnimationFrame(() => attemptScroll(4));

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [location.search]);

  if (showRSVP) {
    return (
      <DeviceFrame showFrame={shouldShowFrame}>
        <RSVPPage 
          onClose={() => setShowRSVP(false)} 
          initialState={rsvpState}
          onStateChange={setRsvpState}
        />
      </DeviceFrame>
    );
  }

  const appContent = (
    <div className={`flex flex-col bg-neutral-100 ${shouldShowFrame ? 'h-full' : 'min-h-screen'} ${!shouldShowFrame ? 'touch:h-screen' : ''}`}>
      <PostFeedSection />
      
      <div className={`flex-1 overflow-y-auto ${!shouldShowFrame ? 'touch:pb-20' : ''}`} ref={scrollContainerRef}>
        <div className="flex flex-col gap-4 p-4">
          {/* 1. Invoice */}
          <div ref={invoiceRef}>
            <CommentSection isPaid={isPaid} onPaymentSuccess={() => setIsPaid(true)} />
          </div>
          {/* 2. Photo post */}
          <div ref={photoRef}>
            <PhotoPostSection
              isLiked={isLiked('photo-post')}
              selectedReaction={getReaction('photo-post')}
              onToggleLike={() => toggleLike('photo-post')}
              onReaction={(emoji) => addReaction('photo-post', emoji)}
              onRemoveReaction={() => removeReaction('photo-post')}
              onAddComment={(comment) => addComment('photo-post', comment)}
              comments={getComments('photo-post')}
            />
          </div>
          {/* 3. Event */}
          <div ref={eventRef}>
            <NavigationSection onShowRSVP={() => setShowRSVP(true)} rsvpState={rsvpState} />
          </div>
          {/* 4. Poll */}
          <div ref={pollRef}>
            <PollPost
              postId="poll-post"
              isLiked={isLiked('poll-post')}
              selectedReaction={getReaction('poll-post')}
              onToggleLike={() => toggleLike('poll-post')}
              onReaction={(emoji) => addReaction('poll-post', emoji)}
              onRemoveReaction={() => removeReaction('poll-post')}
              onAddComment={(comment) => addComment('poll-post', comment)}
              comments={getComments('poll-post')}
              onVote={(optionId) => addPollVote('poll-post', optionId)}
              userVotes={getPollVotes('poll-post')}
            />
          </div>
          {/* 5. Welcome post */}
          <div ref={welcomeRef}>
            <WelcomePostSection />
          </div>
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
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl bg-mfprimaryp-100"
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

            {/* Messages */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/messages')}
              className="no-zoom flex w-14 h-14 items-center justify-center px-4 py-3 relative rounded-xl"
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