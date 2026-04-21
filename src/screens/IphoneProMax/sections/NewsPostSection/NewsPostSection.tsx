import React from "react";
import { InteractivePost } from "../../../../components/InteractivePost/InteractivePost";

interface NewsPostSectionProps {
  isLiked: boolean;
  selectedReaction?: string;
  onToggleLike: () => void;
  onReaction: (emoji: string) => void;
  onAddComment: (comment: string) => void;
  comments: string[];
}

export const NewsPostSection: React.FC<NewsPostSectionProps> = ({
  isLiked,
  selectedReaction,
  onToggleLike,
  onReaction,
  onAddComment,
  comments
}) => {
  return (
    <InteractivePost
      postId="news-post"
      isLiked={isLiked}
      selectedReaction={selectedReaction}
      onToggleLike={onToggleLike}
      onReaction={onReaction}
      onAddComment={onAddComment}
      comments={comments}
    />
  );
};
