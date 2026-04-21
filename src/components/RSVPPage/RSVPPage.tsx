import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChevronLeftIcon, SearchIcon, ChevronDownIcon } from "lucide-react";
import { useDeviceDetection } from "../../hooks/useDeviceDetection";
import { BASE_PATH } from "../../constants";

interface RSVPPageProps {
  onClose: () => void;
  initialState?: {
    hasReplied: boolean;
    isAttending: boolean | null;
    attendeeCount: number;
    comment: string;
  };
  onStateChange?: (state: {
    hasReplied: boolean;
    isAttending: boolean | null;
    attendeeCount: number;
    comment: string;
  }) => void;
}

export const RSVPPage: React.FC<RSVPPageProps> = ({ onClose, initialState, onStateChange }): JSX.Element => {
  const [attendeeCount, setAttendeeCount] = useState(initialState?.attendeeCount || 1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [comment, setComment] = useState(initialState?.comment || "");
  const [isAttending, setIsAttending] = useState<boolean | null>(initialState?.isAttending || null);
  const [hasReplied, setHasReplied] = useState(initialState?.hasReplied || false);
  const { shouldShowFrame } = useDeviceDetection();

  const updateState = (newState: Partial<typeof initialState>) => {
    const updatedState = {
      hasReplied,
      isAttending,
      attendeeCount,
      comment,
      ...newState
    };
    onStateChange?.(updatedState);
  };

  const handleAttendingClick = () => {
    setIsAttending(true);
    setHasReplied(true);
    updateState({ isAttending: true, hasReplied: true });
  };

  const handleNotAttendingClick = () => {
    setIsAttending(false);
    setHasReplied(true);
    updateState({ isAttending: false, hasReplied: true });
  };

  const handleEditReply = () => {
    setHasReplied(false);
    setIsAttending(null);
    updateState({ hasReplied: false, isAttending: null });
  };

  const handleAttendeeSelect = (count: number) => {
    setAttendeeCount(count);
    setShowDropdown(false);
    updateState({ attendeeCount: count });
  };

  const handleCommentChange = (newComment: string) => {
    setComment(newComment);
    updateState({ comment: newComment });
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Header */}
      <header className={`flex flex-col w-full items-start relative ${!shouldShowFrame ? 'sticky top-0 z-50' : ''}`}>
        <div className="flex items-end justify-center px-0 py-2 relative w-full bg-mfprimaryp-400">
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
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-6 h-6 p-0"
          >
            <ChevronLeftIcon className="w-5 h-5 text-white" />
          </Button>

          <h1 className="font-MF-headings-h6-emphasis font-[number:var(--MF-headings-h6-emphasis-font-weight)] text-mfneutralsn-0 text-[length:var(--MF-headings-h6-emphasis-font-size)] leading-[var(--MF-headings-h6-emphasis-line-height)] tracking-[var(--MF-headings-h6-emphasis-letter-spacing)] [font-style:var(--MF-headings-h6-emphasis-font-style)]">
            Calendar
          </h1>

          <div className="w-6 h-6" />
        </nav>
      </header>

      {/* Content */}
      <div className="flex-1 bg-white px-6 py-5">
        {/* Event Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Parent teacher conference
        </h2>

        {/* Event Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-gray-600">Thu, 4th Sep 11:30am</span>
          </div>

          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-gray-600">RSVP: Wed, 3rd Sep</span>
          </div>

          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-gray-600">Explorers (Staff), Explorers (Children)</span>
          </div>

          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
              <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-gray-600">0 adults, 50 no reply</span>
          </div>
        </div>

        {/* RSVP Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
            How many are attending?
          </h3>

          {/* Attendee Selection */}
          <div className="flex items-center justify-between">
            <span className="text-lg text-gray-800">Abby</span>
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center justify-between w-32 h-12 px-4 bg-white border-gray-200 text-gray-700"
              >
                <span>{attendeeCount} {attendeeCount === 1 ? 'adult' : 'adults'}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </Button>
              
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {[1, 2, 3, 4, 5].map((count) => (
                    <button
                      key={count}
                      onClick={() => handleAttendeeSelect(count)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {count} {count === 1 ? 'adult' : 'adults'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-2">
            <textarea
              placeholder="Comment (if any)"
              value={comment}
              onChange={(e) => handleCommentChange(e.target.value)}
              className="w-full h-20 p-3 border border-gray-200 rounded-lg resize-none text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mfprimaryp-400 focus:border-transparent"
            />
          </div>

          {/* RSVP Buttons */}
          {!hasReplied ? (
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleNotAttendingClick}
                className="flex-1 h-12 rounded-lg border-2 border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              >
                Not attending
              </Button>
              
              <Button
                onClick={handleAttendingClick}
                className="flex-1 h-12 rounded-lg bg-mfprimaryp-400 hover:bg-mfprimaryp-400/90 text-white"
              >
                Attending
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="text-center py-1">
                <span className="text-gray-600">
                  You replied: <span className="font-semibold">{isAttending ? 'Attending' : 'Not attending'}</span>
                  {isAttending && attendeeCount > 0 && (
                    <span> ({attendeeCount} {attendeeCount === 1 ? 'adult' : 'adults'})</span>
                  )}
                </span>
              </div>
              
              <Button
                variant="outline"
                onClick={handleEditReply}
                className="w-full h-11 rounded-lg border-2 border-mfprimaryp-400 text-mfprimaryp-400 hover:bg-mfprimaryp-50"
              >
                Edit reply
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};