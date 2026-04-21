import { useState } from 'react';

export const useInteractivity = () => {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [reactions, setReactions] = useState<Record<string, string>>({});
  const [pollVotes, setPollVotes] = useState<Record<string, string[]>>({});
  const [comments, setComments] = useState<Record<string, string[]>>({
    'user-profile-post': [
      'This looks like such a fun activity! Emma loves painting at home too 🎨',
      'Perfect timing for Halloween! Can\'t wait to see what the kids create'
    ],
    'newsfeed-container-post': [
      'Beautiful day for outdoor play! Thank you for taking such good care of the children ☀️',
      'Amanda always comes home so happy after garden time. She loves being outside!',
      'The fresh air and sunshine are so important for their development. Great job!'
    ],
    'photo-post': [
      'Love this! Noah has been talking about the garden all afternoon 🌿',
      'Such happy faces. Thanks for capturing these moments!',
      'Abby looks like she\'s having the best time 😊'
    ],
    'poll-post': []
  });

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const addReaction = (postId: string, emoji: string) => {
    setReactions(prev => ({
      ...prev,
      [postId]: emoji
    }));
    // Also mark as liked when reacting
    setLikedPosts(prev => new Set(prev).add(postId));
  };

  const removeReaction = (postId: string) => {
    setReactions(prev => {
      const newReactions = { ...prev };
      delete newReactions[postId];
      return newReactions;
    });
    // Also remove like when removing reaction
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
  };

  const addComment = (postId: string, comment: string) => {
    if (comment.trim()) {
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment.trim()]
      }));
    }
  };

  const addPollVote = (postId: string, optionId: string) => {
    setPollVotes(prev => ({
      ...prev,
      [postId]: prev[postId]?.includes(optionId) 
        ? prev[postId].filter(id => id !== optionId)
        : [...(prev[postId] || []), optionId]
    }));
  };

  const isLiked = (postId: string) => likedPosts.has(postId);
  const getReaction = (postId: string) => reactions[postId];
  const getComments = (postId: string) => comments[postId] || [];
  const getPollVotes = (postId: string) => pollVotes[postId] || [];

  return {
    toggleLike,
    addReaction,
    removeReaction,
    addComment,
    addPollVote,
    isLiked,
    getReaction,
    getComments,
    getPollVotes,
  };
};