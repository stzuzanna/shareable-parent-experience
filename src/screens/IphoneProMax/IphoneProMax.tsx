import { BASE_PATH } from '../../constants';
import { BottomNav } from "../../components/BottomNav/BottomNav";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { useInteractivity } from "../../hooks/useInteractivity";
import { useSavedPosts } from "../../hooks/useSavedPosts";
import { BookmarkIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { TodosWidget } from "./sections/TodosWidget/TodosWidget";
import { NavigationSection } from "./sections/NavigationSection/NavigationSection";
import { NewsPostSection } from "./sections/NewsPostSection/NewsPostSection";
import {
  PostFeedSection,
  type LearningTypeFilter,
  type PostSourceFilter,
} from "./sections/PostFeedSection/PostFeedSection";
import { PollPost } from "../../components/PollPost/PollPost";
import { RSVPPage } from "../../components/RSVPPage/RSVPPage";
import { PhotoPostSection } from "./sections/PhotoPostSection/PhotoPostSection";
import { WelcomePostSection } from "./sections/WelcomePostSection/WelcomePostSection";
import { ActivitySection } from "./sections/ActivitySection/ActivitySection";
import {
  LearningPostCard,
  LEARNING_POSTS,
  learningPostMatchesAreasFilter,
} from "./sections/LearningPostSection/LearningPostSection";
import { useGlobalUi } from "../../contexts/GlobalUiContext";

const kindergartenPhotos = [
  { id: 1, url: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800", date: "2026-05-18" },
  { id: 2, url: "https://images.pexels.com/photos/8613082/pexels-photo-8613082.jpeg?auto=compress&cs=tinysrgb&w=800", date: "2026-05-18" },
  { id: 3, url: "https://images.pexels.com/photos/8613264/pexels-photo-8613264.jpeg?auto=compress&cs=tinysrgb&w=800", date: "2026-05-20" },
  { id: 4, url: "https://images.pexels.com/photos/8613097/pexels-photo-8613097.jpeg?auto=compress&cs=tinysrgb&w=800", date: "2026-05-20" },
  { id: 5, url: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800", date: "2026-05-15" },
  { id: 6, url: "https://images.pexels.com/photos/8613082/pexels-photo-8613082.jpeg?auto=compress&cs=tinysrgb&w=800", date: "2026-05-12" },
];

const photoDatesWithContent = [...new Set(kindergartenPhotos.map((p) => p.date))];

export const IphoneProMax = (): JSX.Element => {
  const { setHideGlobalFab } = useGlobalUi();
  const { shouldShowFrame } = useDeviceDetection();
  const { toggleLike, addReaction, removeReaction, addComment, addPollVote, isLiked, getReaction, getComments, getPollVotes } = useInteractivity();
  const { savedPostIds, toggleSaved, isSaved } = useSavedPosts();
  const [isPaid, setIsPaid] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'activity' | 'photos' | 'learning' | 'saved'>('home');
  const [activityTypeFilter, setActivityTypeFilter] = useState('all');
  const [postSourceFilter, setPostSourceFilter] = useState<PostSourceFilter>('all');
  const [learningTypeFilter, setLearningTypeFilter] = useState<LearningTypeFilter>('all');
  const [learningAreasFilter, setLearningAreasFilter] = useState<Set<string>>(new Set());
  const [photoFilterDate, setPhotoFilterDate] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    setHideGlobalFab(!!selectedPhoto);
    return () => setHideGlobalFab(false);
  }, [selectedPhoto, setHideGlobalFab]);

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
      <RSVPPage
        onClose={() => setShowRSVP(false)}
        initialState={rsvpState}
        onStateChange={setRsvpState}
      />
    );
  }

  const renderSavedPost = (postId: string) => {
    const learningPost = LEARNING_POSTS.find((post) => post.id === postId);
    if (learningPost) {
      return (
        <LearningPostCard
          key={postId}
          post={learningPost}
          isLiked={isLiked(postId)}
          selectedReaction={getReaction(postId)}
          onToggleLike={() => toggleLike(postId)}
          onReaction={(emoji) => addReaction(postId, emoji)}
          onRemoveReaction={() => removeReaction(postId)}
          onAddComment={(comment) => addComment(postId, comment)}
          comments={getComments(postId)}
          isSaved={isSaved(postId)}
          onToggleSaved={() => toggleSaved(postId)}
        />
      );
    }

    switch (postId) {
      case "photo-post":
        return (
          <PhotoPostSection
            key={postId}
            isLiked={isLiked("photo-post")}
            selectedReaction={getReaction("photo-post")}
            onToggleLike={() => toggleLike("photo-post")}
            onReaction={(emoji) => addReaction("photo-post", emoji)}
            onRemoveReaction={() => removeReaction("photo-post")}
            onAddComment={(comment) => addComment("photo-post", comment)}
            comments={getComments("photo-post")}
            isSaved={isSaved("photo-post")}
            onToggleSaved={() => toggleSaved("photo-post")}
          />
        );
      case "event":
        return (
          <div key={postId}>
            <NavigationSection
              onShowRSVP={() => setShowRSVP(true)}
              rsvpState={rsvpState}
              isSaved={isSaved("event")}
              onToggleSaved={() => toggleSaved("event")}
            />
          </div>
        );
      case "poll-post":
        return (
          <PollPost
            key={postId}
            postId="poll-post"
            isLiked={isLiked("poll-post")}
            selectedReaction={getReaction("poll-post")}
            onToggleLike={() => toggleLike("poll-post")}
            onReaction={(emoji) => addReaction("poll-post", emoji)}
            onRemoveReaction={() => removeReaction("poll-post")}
            onAddComment={(comment) => addComment("poll-post", comment)}
            comments={getComments("poll-post")}
            onVote={(optionId) => addPollVote("poll-post", optionId)}
            userVotes={getPollVotes("poll-post")}
            isSaved={isSaved("poll-post")}
            onToggleSaved={() => toggleSaved("poll-post")}
          />
        );
      case "welcome":
        return (
          <WelcomePostSection
            key={postId}
            isSaved={isSaved("welcome")}
            onToggleSaved={() => toggleSaved("welcome")}
          />
        );
      default:
        return null;
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'activity') {
      return (
        <div className="flex-1 overflow-y-auto">
          <ActivitySection onClose={() => setActiveTab('home')} typeFilter={activityTypeFilter} />
        </div>
      );
    }

    if (activeTab === 'photos') {
      const visiblePhotos = photoFilterDate
        ? kindergartenPhotos.filter((photo) => photo.date === photoFilterDate)
        : kindergartenPhotos;

      return (
        <div className="flex-1 overflow-y-auto p-3">
          {visiblePhotos.length === 0 ? (
            <p className="text-center text-[14px] text-mfneutralsn-300 py-12">No photos on this date</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {visiblePhotos.map((photo) => (
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
          )}
        </div>
      );
    }

    if (activeTab === 'learning') {
      const visibleLearningPosts = LEARNING_POSTS.filter((post) => {
        if (learningTypeFilter !== 'all' && post.contentType !== learningTypeFilter) {
          return false;
        }
        if (!learningPostMatchesAreasFilter(post.developmentAreas, learningAreasFilter)) {
          return false;
        }
        return true;
      });

      return (
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-4">
            {visibleLearningPosts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-8">
                <p className="text-sm text-mfneutralsn-300 text-center">No learning items match this filter.</p>
              </div>
            )}
            {visibleLearningPosts.map((post) => (
              <LearningPostCard
                key={post.id}
                post={post}
                isLiked={isLiked(post.id)}
                selectedReaction={getReaction(post.id)}
                onToggleLike={() => toggleLike(post.id)}
                onReaction={(emoji) => addReaction(post.id, emoji)}
                onRemoveReaction={() => removeReaction(post.id)}
                onAddComment={(comment) => addComment(post.id, comment)}
                comments={getComments(post.id)}
                isSaved={isSaved(post.id)}
                onToggleSaved={() => toggleSaved(post.id)}
              />
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'saved') {
      if (savedPostIds.length === 0) {
        return (
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-8">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <BookmarkIcon className="w-6 h-6 text-mfneutralsn-300" strokeWidth={1.75} />
            </div>
            <p className="text-sm font-medium text-mfneutralsn-400 text-center">No saved items yet</p>
            <p className="text-[14px] text-mfneutralsn-300 text-center mt-1">Tap the bookmark on a post to save it here</p>
          </div>
        );
      }

      return (
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-4">
            {savedPostIds.map((postId) => renderSavedPost(postId))}
          </div>
        </div>
      );
    }

    // Home / newsfeed
    const showSandboxPosts = postSourceFilter === "all" || postSourceFilter === "sandbox";
    const showLittleExplorersPosts = postSourceFilter === "all" || postSourceFilter === "little-explorers";
    const showPollPosts = postSourceFilter === "all" || postSourceFilter === "polls";

    return (
      <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
        <div className="flex flex-col gap-4 p-4">
          <div ref={invoiceRef} className="min-w-0 overflow-visible">
            <TodosWidget
              isPaid={isPaid}
              onPaymentSuccess={() => setIsPaid(true)}
              onShowRSVP={() => setShowRSVP(true)}
              rsvpHasReplied={rsvpState.hasReplied}
            />
          </div>
          {(showLittleExplorersPosts || showSandboxPosts || showPollPosts) && (
            <h2 className="text-[16px] font-semibold text-mfneutralsn-500 mt-2">Newsfeed</h2>
          )}
          {showLittleExplorersPosts && (
            <div ref={photoRef}>
              <PhotoPostSection
                isLiked={isLiked('photo-post')}
                selectedReaction={getReaction('photo-post')}
                onToggleLike={() => toggleLike('photo-post')}
                onReaction={(emoji) => addReaction('photo-post', emoji)}
                onRemoveReaction={() => removeReaction('photo-post')}
                onAddComment={(comment) => addComment('photo-post', comment)}
                comments={getComments('photo-post')}
                isSaved={isSaved('photo-post')}
                onToggleSaved={() => toggleSaved('photo-post')}
              />
            </div>
          )}
          {showSandboxPosts && (
            <div ref={eventRef}>
              <NavigationSection
                onShowRSVP={() => setShowRSVP(true)}
                rsvpState={rsvpState}
                isSaved={isSaved('event')}
                onToggleSaved={() => toggleSaved('event')}
              />
            </div>
          )}
          {showPollPosts && (
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
                isSaved={isSaved('poll-post')}
                onToggleSaved={() => toggleSaved('poll-post')}
              />
            </div>
          )}
          {showSandboxPosts && (
            <div ref={welcomeRef}>
              <WelcomePostSection
                isSaved={isSaved('welcome')}
                onToggleSaved={() => toggleSaved('welcome')}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const appContent = (
    <div className={`flex flex-col ${activeTab === 'home' ? 'bg-white' : 'bg-mfneutralsn-50'} ${shouldShowFrame ? 'h-full' : 'min-h-screen'} ${!shouldShowFrame ? 'touch:h-screen' : ''}`}>
      <PostFeedSection
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
        activityTypeFilter={activityTypeFilter}
        onActivityTypeFilterChange={setActivityTypeFilter}
        postSourceFilter={postSourceFilter}
        onPostSourceFilterChange={setPostSourceFilter}
        learningTypeFilter={learningTypeFilter}
        onLearningTypeFilterChange={setLearningTypeFilter}
        learningAreasFilter={learningAreasFilter}
        onLearningAreasFilterChange={setLearningAreasFilter}
        photoFilterDate={photoFilterDate}
        onPhotoFilterDateChange={setPhotoFilterDate}
        photoDatesWithContent={photoDatesWithContent}
      />

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
      <div className={!shouldShowFrame ? 'sticky bottom-0 z-50' : ''}>
        <BottomNav />
      </div>
    </div>
  );

  return appContent;
};
