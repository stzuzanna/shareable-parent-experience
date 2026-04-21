import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import { EmojiReactionPicker } from "../EmojiReactionPicker/EmojiReactionPicker";
import { BASE_PATH } from "../../constants";

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

interface PollPostProps {
  postId: string;
  isLiked: boolean;
  selectedReaction?: string;
  onToggleLike: () => void;
  onReaction: (emoji: string) => void;
  onRemoveReaction?: () => void;
  onAddComment: (comment: string) => void;
  comments: string[];
  onVote?: (optionId: string) => void;
  userVotes?: string[];
}

export const PollPost: React.FC<PollPostProps> = ({
  postId,
  isLiked,
  selectedReaction,
  onToggleLike,
  onReaction,
  onRemoveReaction,
  onAddComment,
  comments,
  onVote,
  userVotes = []
}) => {
  const [commentText, setCommentText] = useState('');
  const commentInputRef = React.useRef<HTMLInputElement | null>(null);
  // Base votes from other users (excluding current user)
  const baseVotes = {
    'friday-15': 2,
    'saturday-16': 4, 
    'sunday-17': 1,
    'friday-22': 0
  };
  
  // Total unique voters (base voters + current user if they voted)
  const totalVoters = Object.values(baseVotes).reduce((sum, votes) => Math.max(sum, votes), 0) + 1 + (userVotes.length > 0 ? 1 : 0);
  
  const pollOptions: PollOption[] = [
    { 
      id: 'friday-15', 
      text: 'Friday, September 15th', 
      votes: baseVotes['friday-15'] + (userVotes.includes('friday-15') ? 1 : 0),
      percentage: Math.round(((baseVotes['friday-15'] + (userVotes.includes('friday-15') ? 1 : 0)) / totalVoters) * 100)
    },
    { 
      id: 'saturday-16', 
      text: 'Saturday, September 16th', 
      votes: baseVotes['saturday-16'] + (userVotes.includes('saturday-16') ? 1 : 0),
      percentage: Math.round(((baseVotes['saturday-16'] + (userVotes.includes('saturday-16') ? 1 : 0)) / totalVoters) * 100)
    },
    { 
      id: 'sunday-17', 
      text: 'Sunday, September 17th', 
      votes: baseVotes['sunday-17'] + (userVotes.includes('sunday-17') ? 1 : 0),
      percentage: Math.round(((baseVotes['sunday-17'] + (userVotes.includes('sunday-17') ? 1 : 0)) / totalVoters) * 100)
    },
    { 
      id: 'friday-22', 
      text: 'Friday, September 22nd', 
      votes: baseVotes['friday-22'] + (userVotes.includes('friday-22') ? 1 : 0),
      percentage: Math.round(((baseVotes['friday-22'] + (userVotes.includes('friday-22') ? 1 : 0)) / totalVoters) * 100)
    }
  ];

  const handleVote = (optionId: string) => {
    onVote?.(optionId);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  const baseLikes = 0;
  const totalLikes = baseLikes + (isLiked ? 1 : 0);

  return (
    <Card className="relative w-full bg-white rounded-xl shadow-elevation-elevation-1">
      <CardContent className="p-0">
        <div className="flex flex-col items-start gap-5 px-4 py-0">
          <div className="flex items-center gap-2 pt-4 pb-0 px-0 w-full">
            <Avatar className="w-8 h-8">
              <AvatarImage src={`${BASE_PATH}frame-12.png`} alt="Profile" />
              <AvatarFallback>PS</AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start justify-center gap-0.5">
              <div className="font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-mfneutralsn-400 text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] [font-style:var(--MF-body-text-body-emphasis-font-style)]">
                Little Explorers
              </div>

              <div className="flex items-center gap-1.5 opacity-80">
                <div className="font-MF-body-text-body-small font-[number:var(--MF-body-text-body-small-font-weight)] text-mfneutralsn-300 text-[length:var(--MF-body-text-body-small-font-size)] tracking-[var(--MF-body-text-body-small-letter-spacing)] leading-[var(--MF-body-text-body-small-line-height)] [font-style:var(--MF-body-text-body-small-font-style)]">
                  Aug 5, 7:27pm
                </div>
              </div>
            </div>
          </div>

          <div className="w-full font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-400 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
            Help us choose the best date for our next garden party! You can select multiple dates that work for you.
          </div>
        </div>

        {/* Poll Section */}
        <div className="px-4 py-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-mfneutralsn-500 text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] [font-style:var(--MF-body-text-body-emphasis-font-style)]">
              Next Garden Party Date
            </h3>
            
            <div className="space-y-3">
              {pollOptions.map((option) => (
                <Button
                  key={option.id}
                  variant="ghost"
                  onClick={() => handleVote(option.id)}
                  className={`w-full h-auto p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200 ${
                    userVotes.includes(option.id) ? 'bg-mfprimaryp-100 border-mfprimaryp-400' : 'bg-white'
                  } ${option.percentage > 0 ? 'relative overflow-hidden' : ''}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        userVotes.includes(option.id)
                          ? 'bg-mfprimaryp-400 border-mfprimaryp-400' 
                          : 'border-gray-300'
                      }`}>
                        {userVotes.includes(option.id) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-400 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)] text-left">
                        {option.text}
                      </span>
                    </div>
                    <span className="font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-mfprimaryp-400 text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] [font-style:var(--MF-body-text-body-emphasis-font-style)]">
                      {option.percentage}%
                    </span>
                  </div>
                  
                  {/* Progress bar background */}
                  {option.percentage > 0 && (
                    <div 
                      className="absolute left-0 top-0 h-full bg-mfprimaryp-100 opacity-30 transition-all duration-300"
                      style={{ width: `${option.percentage}%` }}
                    />
                  )}
                </Button>
              ))}
            </div>
            
            <div className="text-sm text-mfneutralsn-300 font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
              {totalVoters} {totalVoters === 1 ? 'person voted' : 'people voted'} • Select multiple dates
            </div>
          </div>
        </div>

        <div className="flex flex-col px-4">
          <div className="flex items-center justify-between py-2">
            <EmojiReactionPicker
              isLiked={isLiked}
              selectedReaction={selectedReaction}
              onToggleLike={onToggleLike}
              onReaction={onReaction}
              onRemoveReaction={onRemoveReaction}
            />

            <Button
              variant="ghost"
              className="h-9 gap-1 pl-2 pr-[9px] py-2 rounded-lg h-auto"
              onClick={() => commentInputRef.current?.focus()}
            >
              <MessageCircleIcon className="w-[18px] h-[18px]" />
              <span className="font-MF-body-text-body-small font-[number:var(--MF-body-text-body-small-font-weight)] text-mfneutralsn-400 text-[length:var(--MF-body-text-body-small-font-size)] tracking-[var(--MF-body-text-body-small-letter-spacing)] leading-[var(--MF-body-text-body-small-line-height)] [font-style:var(--MF-body-text-body-small-font-style)]">
                Comment
              </span>
            </Button>
          </div>

          <div className="flex h-10 items-center gap-2.5 px-0 py-2 w-full">
            <div className="flex items-center gap-1 font-MF-body-text-micro-text font-[number:var(--MF-body-text-micro-text-font-weight)] text-mfneutralsn-400 text-[length:var(--MF-body-text-micro-text-font-size)] tracking-[var(--MF-body-text-micro-text-letter-spacing)] leading-[var(--MF-body-text-micro-text-line-height)] [font-style:var(--MF-body-text-micro-text-font-style)]">
              {selectedReaction && (
                <>
                  <span className="text-lg">{selectedReaction}</span>
                  <span>You reacted to this</span>
                </>
              )}
              {!selectedReaction && isLiked && `${totalLikes === 1 ? 'You like this' : `You and ${totalLikes - 1} ${totalLikes === 2 ? 'other' : 'others'} like this`}`}
              {!selectedReaction && !isLiked && totalLikes > 0 && `${totalLikes} ${totalLikes === 1 ? 'person likes' : 'people like'} this`}
              {!selectedReaction && !isLiked && totalLikes === 0 && 'Be the first to like this'}
            </div>
          </div>

          {comments.length > 0 && (
            <div className="flex flex-col gap-3 w-full mb-4">
              {comments.map((comment, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`${BASE_PATH}avatar-2.png`} alt="User avatar" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <div className="font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-mfneutralsn-400 text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] [font-style:var(--MF-body-text-body-emphasis-font-style)]">
                      You
                    </div>
                    <div className="font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-brandneutralsn-400 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
                      {comment}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmitComment} className="flex items-center gap-2 py-3 w-full">
            <Avatar className="w-8 h-8">
              <AvatarImage src={`${BASE_PATH}avatar-2.png`} alt="User avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            <div className="flex h-9 items-center justify-between px-3 py-0 flex-1 bg-[#f9f9fa] rounded-lg">
              <Input
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="border-0 bg-transparent p-0 opacity-90 font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-300 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)] focus-visible:ring-0 focus-visible:ring-offset-0"
                ref={commentInputRef}
              />

              <button
                type="submit"
                className="flex w-[18px] h-[18px] items-center justify-center"
                disabled={!commentText.trim()}
              >
                <img
                  className="w-[18px] h-[18px] opacity-60 hover:opacity-100 transition-opacity"
                  alt="Send comment"
                  src={`${BASE_PATH}ui-icons.svg`}
                />
              </button>
            </div>
          </form>

          <div className="font-MF-body-text-micro-text font-[number:var(--MF-body-text-micro-text-font-weight)] text-mfneutralsn-300 text-[length:var(--MF-body-text-micro-text-font-size)] tracking-[var(--MF-body-text-micro-text-letter-spacing)] leading-[var(--MF-body-text-micro-text-line-height)] [font-style:var(--MF-body-text-micro-text-font-style)] pb-4">
            Recipients: Little Explorers (Parents)
          </div>
        </div>
      </CardContent>
    </Card>
  );
};