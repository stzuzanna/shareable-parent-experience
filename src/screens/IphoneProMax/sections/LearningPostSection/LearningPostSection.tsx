import { BASE_PATH } from '../../../../constants';
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { EmojiReactionPicker } from "../../../../components/EmojiReactionPicker/EmojiReactionPicker";
import { MessageCircleIcon } from "lucide-react";

export interface LearningPost {
  id: string;
  author: string;
  publishedBy: string;
  when: string;
  observation: string;
  image: string;
  developmentAreas: string[];
  baseLikes: number;
}

interface LearningPostCardProps {
  post: LearningPost;
  isLiked: boolean;
  selectedReaction?: string;
  onToggleLike: () => void;
  onReaction: (emoji: string) => void;
  onRemoveReaction: () => void;
  onAddComment: (comment: string) => void;
  comments: string[];
}

const AREA_COLORS: Record<string, string> = {
  "Physical development": "bg-mfprimaryp-100 text-mfprimaryp-400",
  "Communication & language": "bg-mfyellowy-100 text-mfyellowy-400",
  "Literacy": "bg-red-50 text-mfredr-400",
  "Mathematics": "bg-blue-50 text-blue-700",
  "Personal, social & emotional": "bg-pink-50 text-pink-700",
  "Understanding the world": "bg-green-50 text-green-700",
  "Expressive arts & design": "bg-orange-50 text-orange-700",
};

const Pill = ({ label }: { label: string }) => {
  const cls = AREA_COLORS[label] ?? "bg-mfneutralsn-50 text-mfneutralsn-400";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${cls}`}
    >
      {label}
    </span>
  );
};

export const LearningPostCard: React.FC<LearningPostCardProps> = ({
  post,
  isLiked,
  selectedReaction,
  onToggleLike,
  onReaction,
  onRemoveReaction,
  onAddComment,
  comments,
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

  const totalLikes = post.baseLikes + (isLiked ? 1 : 0);

  return (
    <Card className="relative w-full bg-white rounded-xl shadow-elevation-elevation-1">
      <CardContent className="p-0">
        <div className="flex flex-col items-start gap-4 px-4 py-0">
          <div className="flex items-center gap-2 pt-4 pb-0 px-0 w-full">
            <Avatar className="w-8 h-8">
              <AvatarImage src={`${BASE_PATH}frame-12.png`} alt="Profile" />
              <AvatarFallback>LE</AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start justify-center gap-0.5">
              <div className="font-MF-body-text-body-emphasis font-[number:var(--MF-body-text-body-emphasis-font-weight)] text-mfneutralsn-400 text-[length:var(--MF-body-text-body-emphasis-font-size)] tracking-[var(--MF-body-text-body-emphasis-letter-spacing)] leading-[var(--MF-body-text-body-emphasis-line-height)] [font-style:var(--MF-body-text-body-emphasis-font-style)]">
                {post.author}
              </div>

              <div className="flex items-center gap-1.5 opacity-80">
                <div className="font-MF-body-text-body-small font-[number:var(--MF-body-text-body-small-font-weight)] text-mfneutralsn-300 text-[length:var(--MF-body-text-body-small-font-size)] tracking-[var(--MF-body-text-body-small-letter-spacing)] leading-[var(--MF-body-text-body-small-line-height)] [font-style:var(--MF-body-text-body-small-font-style)]">
                  Published by {post.publishedBy}
                </div>

                <div className="w-1 h-1 bg-mfneutralsn-300 rounded-sm" />

                <div className="font-MF-body-text-body-small font-[number:var(--MF-body-text-body-small-font-weight)] text-mfneutralsn-300 text-[length:var(--MF-body-text-body-small-font-size)] tracking-[var(--MF-body-text-body-small-letter-spacing)] leading-[var(--MF-body-text-body-small-line-height)] [font-style:var(--MF-body-text-body-small-font-style)]">
                  {post.when}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full font-modern-famly-body-text-body font-[number:var(--modern-famly-body-text-body-font-weight)] text-mfneutralsn-400 text-[length:var(--modern-famly-body-text-body-font-size)] tracking-[var(--modern-famly-body-text-body-letter-spacing)] leading-[var(--modern-famly-body-text-body-line-height)] [font-style:var(--modern-famly-body-text-body-font-style)]">
            {post.observation}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full mb-1">
            {post.developmentAreas.map((area) => (
              <Pill key={area} label={area} />
            ))}
          </div>
        </div>

        <div className="w-full h-64 overflow-hidden rounded-lg mt-4">
          <img
            src={post.image}
            alt={post.observation}
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
              <span className="font-MF-body-text-body-small font-[number:var(--MF-body-text-body-small-font-weight)] text-mfneutralsn-400 text-[length:var(--MF-body-text-body-small-font-size)] tracking-[var(--MF-body-text-body-small-letter-spacing)] leading-[var(--MF-body-text-body-small-line-height)] [font-style:var(--MF-body-text-body-small-font-style)]">
                Comment
              </span>
            </Button>
          </div>

          {comments.length > 0 && (
            <div className="flex flex-col gap-3 w-full my-4">
              {comments.map((comment, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={`${BASE_PATH}avatar-2.png`} alt="Parent avatar" />
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
  );
};

export const LEARNING_POSTS: LearningPost[] = [
  {
    id: 'learning-1',
    author: 'Little Explorers',
    publishedBy: 'Olivia Wilson',
    when: 'Today',
    observation:
      "Abby spent twenty minutes carefully stacking the wooden blocks today — she counted each one as she added it to the tower and made it to ten before it tumbled. She giggled and started again straight away.",
    image: 'https://images.pexels.com/photos/3933027/pexels-photo-3933027.jpeg?auto=compress&cs=tinysrgb&w=800',
    developmentAreas: ['Mathematics', 'Physical development'],
    baseLikes: 4,
  },
  {
    id: 'learning-2',
    author: 'Little Explorers',
    publishedBy: 'Sarah Freedman',
    when: 'Yesterday',
    observation:
      "We read 'The Very Hungry Caterpillar' together and Abby pointed out the fruits and named the colours. She especially loved the strawberries and asked to read it again.",
    image: 'https://images.pexels.com/photos/8612967/pexels-photo-8612967.jpeg?auto=compress&cs=tinysrgb&w=800',
    developmentAreas: ['Literacy', 'Communication & language'],
    baseLikes: 6,
  },
  {
    id: 'learning-3',
    author: 'Little Explorers',
    publishedBy: 'Olivia Wilson',
    when: '2 days ago',
    observation:
      "Outside today Abby explored the sensory tray with leaves and pinecones. She sorted them by size and was very curious about the textures — describing them as 'crunchy' and 'soft'.",
    image: 'https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg?auto=compress&cs=tinysrgb&w=800',
    developmentAreas: ['Understanding the world', 'Expressive arts & design'],
    baseLikes: 3,
  },
  {
    id: 'learning-4',
    author: 'Little Explorers',
    publishedBy: 'Sarah Freedman',
    when: '3 days ago',
    observation:
      "Abby helped a friend who was upset by bringing them a soft toy and sitting beside them. A lovely moment of empathy from her today.",
    image: 'https://images.pexels.com/photos/8613313/pexels-photo-8613313.jpeg?auto=compress&cs=tinysrgb&w=800',
    developmentAreas: ['Personal, social & emotional'],
    baseLikes: 8,
  },
];
