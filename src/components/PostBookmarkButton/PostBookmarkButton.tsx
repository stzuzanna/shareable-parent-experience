import { BookmarkIcon } from "lucide-react";
import React from "react";

interface PostBookmarkButtonProps {
  isSaved: boolean;
  onToggle: () => void;
  className?: string;
}

export const PostBookmarkButton: React.FC<PostBookmarkButtonProps> = ({
  isSaved,
  onToggle,
  className = "",
}) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onToggle();
    }}
    aria-label={isSaved ? "Remove from saved" : "Save post"}
    aria-pressed={isSaved}
    className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-mfneutralsn-400 hover:text-mfprimaryp-400 active:opacity-70 transition-colors ${className}`}
  >
    <BookmarkIcon
      className={`w-5 h-5 ${isSaved ? "fill-mfprimaryp-400 text-mfprimaryp-400" : "fill-none"}`}
      strokeWidth={1.75}
    />
  </button>
);
