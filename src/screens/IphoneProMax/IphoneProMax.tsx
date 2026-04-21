import { BASE_PATH } from '../../constants';
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DeviceFrame } from "../../components/DeviceFrame/DeviceFrame";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { useInteractivity } from "../../hooks/useInteractivity";
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
import { ActivitySection } from "./sections/ActivitySection/ActivitySection";

const kindergartenPhotos = [
  { id: 1, url: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 2, url: "https://images.pexels.com/photos/8613082/pexels-photo-8613082.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 3, url: "https://images.pexels.com/photos/8613264/pexels-photo-8613264.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 4, url: "https://images.pexels.com/photos/8613097/pexels-photo-8613097.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 5, url: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { id: 6, url: "https://images.pexels.com/photos/8613082/pexels-photo-8613082.jpeg?auto=compress&cs=tinysrgb&w=800" },
];

export const IphoneProMax = (): JSX.Element => {
  const { shouldShowFrame } = useDeviceDetection();
  const { toggleLike, addReaction, removeReaction, addComment, addPollVote, isLiked, getReaction, getComments, getPollVotes } = useInteractivity();
  const [isPaid, setIsPaid] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'activity' | 'photos' | 'saved'>('home');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
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
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (attemptsLeft > 0) {
          timeoutId = setTimeout(() => attemptScroll(attemptsLeft - 1), 200);
        }
      };

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

  const renderTabContent = () => {
    if (activeTab === 'activity') {
      return (
        <div className="flex-1 overflow-y-auto">
          <ActivitySection onClose={() => setActiveTab('home')} />
        </div>
      );
    }

    if (activeTab === 'photos') {
      return (
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-2">
            {kindergartenPhotos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square overflow-hidden rounded-xl cursor-pointer"
                onClick={() => setSelectedPhoto(photo.url)}
              >
                <img
                  src={photo.url}
                  alt="Kindergarten activity"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'saved') {
      return (
        <div className="flex-1 flex flex-col items-center justify-center py-16 px-8">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mfneutralsn-300"/>
            </svg>
          </div>
          <p className="text-sm font-medium text-mfneutralsn-400 text-center">No saved items yet</p>
          <p className="text-xs text-mfneutralsn-300 text-center mt-1">Save posts to find them here later</p>
        </div>
      );
    }

    // Home / newsfeed
    return (
      <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
        <div className="flex flex-col gap-4 p-4">
          <div ref={invoiceRef}>
            <CommentSection isPaid={isPaid} onPaymentSuccess={() => setIsPaid(true)} />
          </div>
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
          <div ref={eventRef}>
            <NavigationSection onShowRSVP={() => setShowRSVP(true)} rsvpState={rsvpState} />
          </div>
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
          <div ref={welcomeRef}>
            <WelcomePostSection />
          </div>
        </div>
      </div>
    );
  };

  const appContent = (
    <div className={`flex flex-col bg-gray-50 ${shouldShowFrame ? 'h-full' : 'min-h-screen'} ${!shouldShowFrame ? 'touch:h-screen' : ''}`}>
      <PostFeedSection activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as any)} />

      {renderTabContent()}

      {/* Full-screen photo lightbox */}
      {selectedPhoto && (
        <div
          className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white z-10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <img
            src={selectedPhoto}
            alt="Full screen view"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Bottom Navigation */}
      <div className={`bottom-nav flex flex-col max-w-screen-md items-center justify-end px-[9px] py-0 w-full bg-mfneutralsn-0 rounded-[0px_0px_16px_16px] ${!shouldShowFrame ? 'sticky bottom-0 z-50 shadow-lg' : ''}`}>
        <div className="flex items-center gap-[46px] pl-2 pr-4 pt-3 pb-[21px] relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center justify-between relative flex-1 grow">
            {/* Newsfeed - active */}
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
