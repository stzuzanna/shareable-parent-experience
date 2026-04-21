import { BASE_PATH } from '../../../../constants';
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { EmojiReactionPicker } from "../../../../components/EmojiReactionPicker/EmojiReactionPicker";
import { MessageCircleIcon } from "lucide-react";

interface PhotoPostSectionProps {
  isLiked: boolean;
  selectedReaction?: string;
  onToggleLike: () => void;
  onReaction: (emoji: string) => void;
  onRemoveReaction: () => void;
  onAddComment: (comment: string) => void;
  comments: string[];
}

export const PhotoPostSection: React.FC<PhotoPostSectionProps> = ({
  isLiked,
  selectedReaction,
  onToggleLike,
  onReaction,
  onRemoveReaction,
  onAddComment,
  comments
}) => {
  const [commentText, setCommentText] = React.useState('');
  const commentInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText.trim());
      setCommentText('');
    }
  };

  const baseLikes = 3;
  const totalLikes = baseLikes + (isLiked ? 1 : 0);

  return (
    <div className="flex flex-col items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
      <div className="flex flex-col items-center justify-center gap-6 relative self-stretch w-full flex-[0_0_auto]">
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
                      Today
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-400 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)] mb-4">
                Today we had a great time enjoying some sun in the garden
              </div>
            </div>

            <div className="w-full h-64 overflow-hidden rounded-lg">
              <img
                src="https://images.pexels.com/photos/8385934/pexels-photo-8385934.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Happy children at a birthday party"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col items-start px-4 py-0 w-full">
              <div className="flex h-10 items-center gap-2.5 px-0 py-2 w-full">
                <div className="flex items-center gap-1 font-MF-body-text-micro-text font-[number:var(--MF-body-text-micro-text-font-weight)] text-mfneutralsn-400 text-[length:var(--MF-body-text-micro-text-font-size)] tracking-[var(--MF-body-text-micro-text-letter-spacing)] leading-[var(--MF-body-text-micro-text-line-height)] [font-style:var(--MF-body-text-micro-text-font-style)]">
                  {totalLikes} {totalLikes === 1 ? 'like' : 'likes'}
                  <span className="mx-2">•</span>
                  {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                </div>
              </div>

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
                  className="h-9 gap-1 pl-2 pr-[9px] py-2 rounded-lg h-auto"
                  onClick={() => commentInputRef.current?.focus()}
                >
                  <MessageCircleIcon className="w-[18px] h-[18px]" />
                  <span className="font-MF-body-text-body-small font-[number:var(--MF-body-text-body-small-font-weight)] text-mfneutralsn-400 text-[length:var(--MF-body-text-body-small-font-size)] tracking-[var(--MF-body-text-body-small-letter-spacing)] leading-[var(--MF-body-text-body-small-line-height)] [font-style:var(--MF-body-text-body-small-font-style)] transition-all duration-200">
                    Comment
                  </span>
                </Button>
              </div>

              {comments.length > 0 && (
                <div className="flex flex-col gap-3 w-full mb-4">
                  {comments.map((comment, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage 
                          src={index < 3 ? (
                            index === 0 ? "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400" : 
                            index === 1 ? "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400" :
                            "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400"
                          ) : `${BASE_PATH}avatar-2.png`} 
                          alt="Parent avatar" 
                        />
                        <AvatarFallback>
                          {index < 3 ? (
                            index === 0 ? 'SM' : index === 1 ? 'MJ' : 'EM'
                          ) : 'KS'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <div className="font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-mfneutralsn-400 text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] [font-style:var(--MF-body-text-body-emphasis-font-style)]">
                          {index < 3 ? (
                            index === 0 ? 'Sarah Martinez' : index === 1 ? 'Michael Johnson' : 'Emma Wilson'
                          ) : 'Katie Smith'}
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
                  <AvatarFallback>KS</AvatarFallback>
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
                Recipients: Sandbox Childcare
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
