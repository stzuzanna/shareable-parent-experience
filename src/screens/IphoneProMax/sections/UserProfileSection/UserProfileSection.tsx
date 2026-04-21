import { BASE_PATH } from '../../../../constants';
import React, { useState } from "react";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import { EmojiReactionPicker } from "../../../../components/EmojiReactionPicker/EmojiReactionPicker";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";

interface UserProfileSectionProps {
  isLiked: boolean;
  selectedReaction?: string;
  onToggleLike: () => void;
  onReaction: (emoji: string) => void;
  onRemoveReaction: () => void;
  onAddComment: (comment: string) => void;
  comments: string[];
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  isLiked,
  selectedReaction,
  onToggleLike,
  onReaction,
  onRemoveReaction,
  onAddComment,
  comments
}) => {
  const [commentText, setCommentText] = useState('');
  const commentInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText.trim());
      setCommentText('');
    }
  };

  const handleCommentClick = () => {
    commentInputRef.current?.focus();
  };
  const baseLikes = 2;
  const totalLikes = baseLikes + (isLiked ? 1 : 0);

  return (
    <Card className="relative w-full bg-white rounded-xl shadow-elevation-elevation-1">
      <CardContent className="p-0">
        <div className="flex flex-col items-start gap-5 px-4 py-0">
          <div className="flex items-center gap-2 pt-4 pb-0 px-0 w-full">
            <Avatar className="w-8 h-8">
              <AvatarImage src={`${BASE_PATH}frame-12.png`} alt="Profile" />
              <AvatarFallback>LE</AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start justify-center gap-0.5">
              <div className="font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-mfneutralsn-400 text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] [font-style:var(--MF-body-text-body-emphasis-font-style)]">
                Little Explorers
              </div>

              <div className="flex items-center gap-1.5 opacity-80">
                <div className="font-MF-body-text-body-small font-[number:var(--MF-body-text-body-small-font-weight)] text-mfneutralsn-300 text-[length:var(--MF-body-text-body-small-font-size)] tracking-[var(--MF-body-text-body-small-letter-spacing)] leading-[var(--MF-body-text-body-small-line-height)] [font-style:var(--MF-body-text-body-small-font-style)]">
                  Published by Olivia Wilson
                </div>

                <div className="w-1 h-1 bg-mfneutralsn-300 rounded-sm" />

                <div className="font-MF-body-text-body-small font-[number:var(--MF-body-text-body-small-font-weight)] text-mfneutralsn-300 text-[length:var(--MF-body-text-body-small-font-size)] tracking-[var(--MF-body-text-body-small-letter-spacing)] leading-[var(--MF-body-text-body-small-line-height)] [font-style:var(--MF-body-text-body-small-font-style)]">
                  Yesterday
                </div>
              </div>
            </div>
          </div>

          <div className="w-full font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-400 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
            Take a look at this activity from the Famly Activity Library! We'll be doing it tomorrow.
          </div>
        </div>

        <div className="flex flex-col h-[304.55px] items-center w-full">
          <div className="flex h-[278.55px] w-full">
            <img
              className="w-[120px] h-full rounded-[8px_0px_0px_8px] object-cover"
              alt="Paint a pumpkin activity"
              src={`${BASE_PATH}pexels-daisy-anderson-5581091-1.png`}
            />
            <div className="flex h-full items-center p-6 flex-1 rounded-[0px_8px_8px_0px] border border-solid border-[#dedfe2]">
              <div className="w-full h-full flex flex-col justify-center [font-family:'Matter-Medium',Helvetica] font-normal text-transparent text-sm tracking-[0] leading-5">
                <span className="font-medium text-black">
                  Paint a pumpkin
                  <br />
                </span>
                <span className="[font-family:'Matter-Regular',Helvetica] text-[#c8c9cf]">
                  The children can use their imagination by painting the pump...
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 flex-1 w-full">
            <Badge
              variant="secondary"
              className="opacity-80 font-MF-body-text-micro-text font-[number:var(--MF-body-text-micro-text-font-weight)] text-mfneutralsn-300 text-[length:var(--MF-body-text-micro-text-font-size)] tracking-[var(--MF-body-text-micro-text-letter-spacing)] leading-[var(--MF-body-text-micro-text-line-height)] [font-style:var(--MF-body-text-micro-text-font-style)] bg-transparent border-0 p-0 h-auto"
            >
              {totalLikes} {totalLikes === 1 ? 'like' : 'likes'}
            </Badge>

            <div className="w-[3px] h-[3px] bg-[#c6c6d2] rounded-[1.5px]" />

            <Badge
              variant="secondary"
              className="opacity-80 font-MF-body-text-micro-text font-[number:var(--MF-body-text-micro-text-font-weight)] text-mfneutralsn-300 text-[length:var(--MF-body-text-micro-text-font-size)] tracking-[var(--MF-body-text-micro-text-letter-spacing)] leading-[var(--MF-body-text-micro-text-line-height)] [font-style:var(--MF-body-text-micro-text-font-style)] bg-transparent border-0 p-0 h-auto"
            >
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col items-start px-4 py-0 w-full">
          <div className="flex items-start gap-2.5 px-1 py-2 w-full border-t border-b border-[#e2e2e8]">
            <EmojiReactionPicker
              isLiked={isLiked}
              selectedReaction={selectedReaction}
              onToggleLike={onToggleLike}
              onReaction={onReaction}
              onRemoveReaction={onRemoveReaction}
            />

            <Button
              variant="ghost"
              onClick={handleCommentClick}
              className="h-9 gap-1 pl-2 pr-[9px] py-2 rounded-lg h-auto"
            >
              <MessageCircleIcon className="w-[18px] h-[18px]" />
               <span className="font-MF-body-text-body-small font-[number:var(--MF-body-text-body-small-font-weight)] text-mfneutralsn-400 text-[length:var(--MF-body-text-body-small-font-size)] tracking-[var(--MF-body-text-body-small-letter-spacing)] leading-[var(--MF-body-text-body-small-line-height)] [font-style:var(--MF-body-text-body-small-font-style)] transition-all duration-200">
                 Comment
               </span>
            </Button>
          </div>
          <div className="flex h-10 items-center gap-2.5 px-0 py-2 w-full">
            <div className="flex items-center gap-1 font-MF-body-text-micro-text font-[number:var(--MF-body-text-micro-text-font-weight)] text-mfneutralsn-400 text-[length:var(--MF-body-text-micro-text-font-size)] tracking-[var(--MF-body-text-micro-text-letter-spacing)] leading-[var(--MF-body-text-micro-text-line-height)] [font-style:var(--MF-body-text-micro-text-font-style)]">
              {selectedReaction && (
                <>
                  <span className="text-lg">{selectedReaction}</span>
                  <span>😊</span>
                  <span>Olivia Wilson and Keith Sanchez reacted to this</span>
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
                    <AvatarImage 
                      src={index === 0 ? "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400" : 
                           "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"} 
                      alt="Parent avatar" 
                    />
                    <AvatarFallback>
                      {index === 0 ? 'SM' : 'MJ'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <div className="font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-mfneutralsn-400 text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] [font-style:var(--MF-body-text-body-emphasis-font-style)]">
                      {index === 0 ? 'Sarah Martinez' : 'Michael Johnson'}
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
                ref={commentInputRef}
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="border-0 bg-transparent p-0 opacity-90 font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-300 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)] focus-visible:ring-0 focus-visible:ring-offset-0"
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
            Recipients: Sandbox Childcare
          </div>
        </div>
      </CardContent>
    </Card>
  );
};