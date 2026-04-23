import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, SendIcon, CheckIcon } from "lucide-react";

const FEEDBACK_EMAIL = "zs@famly.co";

interface FeedbackSheetProps {
  isOpen: boolean;
  onClose: () => void;
  useAbsolute?: boolean;
}

type Status = "idle" | "success";

export const FeedbackSheet: React.FC<FeedbackSheetProps> = ({
  isOpen,
  onClose,
  useAbsolute = false,
}) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const pos = useAbsolute ? "absolute" : "fixed";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const subject = encodeURIComponent("Prototype feedback");
    const body = encodeURIComponent(
      name.trim() ? `From: ${name.trim()}\n\n${message.trim()}` : message.trim()
    );
    window.open(`mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`);

    setStatus("success");
    setTimeout(() => {
      setStatus("idle");
      setName("");
      setMessage("");
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setStatus("idle");
    setName("");
    setMessage("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`${pos} inset-0 bg-black/40 z-[70]`}
            onClick={handleClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className={`${pos} bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[80]`}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-3 pb-4">
              <div>
                <h2 className="text-base font-semibold text-mfneutralsn-500">
                  Share your thoughts
                </h2>
                <p className="text-xs text-mfneutralsn-300 mt-0.5">
                  Any feedback helps us improve
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-mfneutralsn-400"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center gap-3 px-5 pb-12 pt-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckIcon className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-mfneutralsn-500">
                  Thanks for the feedback!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-5 pb-10 flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-mfneutralsn-500 placeholder:text-mfneutralsn-300 focus:outline-none focus:border-mfprimaryp-400 bg-gray-50"
                />
                <textarea
                  placeholder="What's on your mind?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-mfneutralsn-500 placeholder:text-mfneutralsn-300 focus:outline-none focus:border-mfprimaryp-400 bg-gray-50 resize-none"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-mfprimaryp-400 text-white text-sm font-medium disabled:opacity-40 transition-opacity"
                >
                  <SendIcon className="w-4 h-4" />
                  Send feedback
                </button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
