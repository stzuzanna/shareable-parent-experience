import { useCallback, useState } from "react";

export const useSavedPosts = () => {
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);

  const toggleSaved = useCallback((postId: string) => {
    setSavedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId],
    );
  }, []);

  const isSaved = useCallback((postId: string) => savedPostIds.includes(postId), [savedPostIds]);

  return { savedPostIds, toggleSaved, isSaved };
};
