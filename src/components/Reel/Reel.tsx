import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, HeartIcon, ChevronRightIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BASE_PATH } from "../../constants";

export interface ReelUpdate {
  id: string;
  photoUrl: string;
  caption: string;
  timestamp: string;
  sender: string;
  comment?: { author: string; avatar: string; text: string };
}

const CHILD_NAME = "Abby Freedman";
const CHILD_AVATAR = `${BASE_PATH}pexels-daisy-anderson-5581091-1.png`;
const CENTRE_NAME = "Little Explorers";
const CENTRE_AVATAR = "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200";

export const REEL_UPDATES: ReelUpdate[] = [
  {
    id: "u1",
    photoUrl: "https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=900",
    caption: "We had so much fun outside today! ☀️",
    timestamp: "Today, 9:23 AM",
    sender: CENTRE_NAME,
    comment: {
      author: "Maria Reimann",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
      text: "This is so cute!",
    },
  },
  {
    id: "u2",
    photoUrl: "https://images.pexels.com/photos/235554/pexels-photo-235554.jpeg?auto=compress&cs=tinysrgb&w=900",
    caption: "Lunchtime favourites — Abby loved the apples today 🍎",
    timestamp: "Today, 12:14 PM",
    sender: CENTRE_NAME,
  },
  {
    id: "u3",
    photoUrl: "https://images.pexels.com/photos/8613264/pexels-photo-8613264.jpeg?auto=compress&cs=tinysrgb&w=900",
    caption: "Story time with the Bunnies room — Abby was very focused 📚",
    timestamp: "Today, 2:05 PM",
    sender: CENTRE_NAME,
  },
  {
    id: "u4",
    photoUrl: "https://images.pexels.com/photos/8613082/pexels-photo-8613082.jpeg?auto=compress&cs=tinysrgb&w=900",
    caption: "Painting session — look at those colours! 🎨",
    timestamp: "Today, 3:30 PM",
    sender: CENTRE_NAME,
    comment: {
      author: "Sarah Freedman",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
      text: "Such a happy day ❤️",
    },
  },
  {
    id: "u5",
    photoUrl: "https://images.pexels.com/photos/8613097/pexels-photo-8613097.jpeg?auto=compress&cs=tinysrgb&w=900",
    caption: "Goodnight from the centre 🌙 Abby's ready for pickup!",
    timestamp: "Today, 4:45 PM",
    sender: CENTRE_NAME,
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Preview card — shows the child's avatar (with a gradient story ring), name,
// "N updates" copy, and the latest photo as a faded background. Sits above the
// TodosWidget on the home screen.
// ────────────────────────────────────────────────────────────────────────────

export const ReelPreview = ({
  updates = REEL_UPDATES,
  onOpen,
}: {
  updates?: ReelUpdate[];
  onOpen: () => void;
}): JSX.Element => {
  const latest = updates[updates.length - 1];
  return (
    <button
      onClick={onOpen}
      className="relative overflow-hidden rounded-2xl h-[150px] w-full text-left active:scale-[0.99] transition-transform"
    >
      <img
        src={latest.photoUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/55" />
      <div className="relative h-full flex flex-col justify-between p-3">
        <div className="flex items-center gap-2">
          <div className="rounded-full p-[2px] bg-gradient-to-br from-mfprimaryp-400 via-pink-400 to-cyan-300">
            <Avatar className="w-8 h-8 border-2 border-white">
              <AvatarImage src={CHILD_AVATAR} alt={CHILD_NAME} />
              <AvatarFallback>AF</AvatarFallback>
            </Avatar>
          </div>
          <span className="text-[14px] font-medium text-white drop-shadow-sm">{CHILD_NAME}</span>
        </div>
        <span className="text-[14px] text-white drop-shadow-sm">{updates.length} updates</span>
      </div>
    </button>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Story viewer — full-screen overlay (within the device frame) showing the
// updates one at a time. Progress bars top, tap left/right to navigate, X to
// close, Like / Comment at the bottom.
// ────────────────────────────────────────────────────────────────────────────

const STORY_MS = 6000;

interface ReelViewerProps {
  isOpen: boolean;
  updates?: ReelUpdate[];
  onClose: () => void;
  useAbsolute?: boolean;
}

export const ReelViewer: React.FC<ReelViewerProps> = ({
  isOpen,
  updates = REEL_UPDATES,
  onClose,
  useAbsolute = false,
}) => {
  const pos = useAbsolute ? "absolute" : "fixed";
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const current = updates[index];
  const isLiked = current ? likedIds.has(current.id) : false;

  // Auto-advance every STORY_MS unless paused or at the end.
  useEffect(() => {
    if (!isOpen || paused) return;
    const t = setTimeout(() => {
      if (index < updates.length - 1) setIndex(index + 1);
      else onClose();
    }, STORY_MS);
    return () => clearTimeout(t);
  }, [isOpen, paused, index, updates.length, onClose]);

  // Reset to first update whenever the viewer is opened.
  useEffect(() => {
    if (isOpen) {
      setIndex(0);
      setPaused(false);
    }
  }, [isOpen]);

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => {
    if (index < updates.length - 1) setIndex(index + 1);
    else onClose();
  };

  const toggleLike = (id: string) =>
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`${pos} inset-0 bg-black z-[90] flex flex-col`}
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
        >
          {/* Progress bars */}
          <div className="flex items-center gap-1 px-3 pt-3 pb-2">
            {updates.map((u, i) => (
              <div key={u.id} className="flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden">
                {i < index && <div className="h-full w-full bg-white" />}
                {i === index && (
                  <motion.div
                    key={`${u.id}-${paused ? "p" : "r"}`}
                    initial={{ width: "0%" }}
                    animate={{ width: paused ? undefined : "100%" }}
                    transition={{ duration: STORY_MS / 1000, ease: "linear" }}
                    className="h-full bg-white"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="flex items-start justify-between px-4 pt-2">
            <div className="flex items-center gap-2">
              <Avatar className="w-9 h-9">
                <AvatarImage src={CENTRE_AVATAR} alt={current.sender} />
                <AvatarFallback>LE</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-white leading-tight">{current.sender}</span>
                <span className="text-[12px] text-white/70 leading-tight">{current.timestamp}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close story"
              className="w-9 h-9 flex items-center justify-center text-white/90 active:bg-white/10 rounded-full"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Caption + go-to-post */}
          <div className="flex items-start justify-between px-4 pt-3 gap-3">
            <p className="text-[14px] text-white leading-snug whitespace-pre-line flex-1">
              {current.caption}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="flex items-center gap-1 text-white text-[14px] flex-shrink-0 pt-0.5"
            >
              Go to post
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Photo — fills available space; left/right thirds tap to navigate */}
          <div className="relative flex-1 mt-3 mx-3 mb-2 rounded-2xl overflow-hidden bg-black">
            <img
              key={current.photoUrl}
              src={current.photoUrl}
              alt={current.caption}
              className="w-full h-full object-cover"
            />
            {/* Tap zones */}
            <button
              aria-label="Previous"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute inset-y-0 left-0 w-1/3"
            />
            <button
              aria-label="Next"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute inset-y-0 right-0 w-1/3"
            />

            {/* Inline comment preview on the photo (if any) */}
            {current.comment && (
              <div className="absolute left-3 right-3 bottom-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2">
                <Avatar className="w-7 h-7 flex-shrink-0">
                  <AvatarImage src={current.comment.avatar} alt={current.comment.author} />
                  <AvatarFallback>{current.comment.author.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] text-white/80 leading-tight truncate">{current.comment.author}</span>
                  <span className="text-[14px] text-white leading-tight truncate">{current.comment.text}</span>
                </div>
                <HeartIcon className="w-4 h-4 text-white/80 ml-auto flex-shrink-0" />
              </div>
            )}
          </div>

          {/* Bottom: comment input + like button */}
          <div className="flex items-center gap-2 px-3 pb-4 pt-1">
            <div className="flex-1 h-11 px-4 rounded-full bg-white/10 border border-white/20 flex items-center">
              <input
                placeholder="Comment…"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="flex-1 bg-transparent text-[14px] text-white placeholder:text-white/60 focus:outline-none"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(current.id);
              }}
              className={`flex items-center gap-1.5 px-4 h-11 rounded-full text-[14px] font-medium ${
                isLiked
                  ? "bg-mfprimaryp-400 text-white"
                  : "bg-white/10 border border-white/20 text-white"
              }`}
            >
              <HeartIcon className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} />
              {isLiked ? "Liked" : "Like"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
