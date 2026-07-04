import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Send, Edit, Trash2,
  Loader, ChevronDown, ChevronUp,
} from 'lucide-react';
import { reviewsAPI, Review, ReviewReply } from '@/services/reviewsService';
import DeleteConfirmModal from '@/components/places/DeleteConfirmModal';
import { toast } from 'sonner';

const neuCard = "rounded-[1.5rem] bg-[#e8ecf3] shadow-[12px_12px_24px_#adb5c0,-12px_-12px_24px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[8px_8px_20px_#0e1020,-8px_-8px_20px_#343750]";
const neuSmall = "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";

export const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i} size={13}
        className={i <= rating
          ? 'fill-orange-400 text-orange-400'
          : 'text-gray-300 dark:text-gray-600'
        }
      />
    ))}
  </div>
);

interface ReviewCardProps { review: Review; }

const ReviewCard = ({ review }: ReviewCardProps) => {
  const [repliesOpen, setRepliesOpen]       = useState(false);
  const [replies, setReplies]               = useState<ReviewReply[]>([]);
  const [repliesLoaded, setRepliesLoaded]   = useState(false);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [replyText, setReplyText]           = useState('');
  const [isSending, setIsSending]           = useState(false);
  const [editingReply, setEditingReply]     = useState<ReviewReply | null>(null);
  const [editText, setEditText]             = useState('');
  const [isUpdating, setIsUpdating]         = useState(false);
  const [deletingId, setDeletingId]         = useState<string | null>(null);
  const [isDeleting, setIsDeleting]         = useState(false);

  const loadReplies = () => {
    if (repliesLoading) return;
    setRepliesLoading(true);
    reviewsAPI.getReplies(review.id)
      .then(res => { setReplies(res.data); setRepliesLoaded(true); })
      .catch(() => toast.error('Failed to load replies'))
      .finally(() => setRepliesLoading(false));
  };

  const toggleReplies = () => {
    if (!repliesLoaded) loadReplies();
    setRepliesOpen(prev => !prev);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      await reviewsAPI.createReply(review.id, replyText.trim());
      toast.success('Reply sent!');
      setReplyText('');
      setRepliesLoaded(false);
      loadReplies();
      setRepliesOpen(true);
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to send reply');
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingReply || !editText.trim()) return;
    setIsUpdating(true);
    try {
      await reviewsAPI.updateReply(editingReply.id, editText.trim());
      setReplies(prev =>
        prev.map(r => r.id === editingReply.id ? { ...r, replyText: editText.trim() } : r)
      );
      setEditingReply(null);
      toast.success('Reply updated!');
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to update reply');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await reviewsAPI.deleteReply(deletingId);
      setReplies(prev => prev.filter(r => r.id !== deletingId));
      setDeletingId(null);
      toast.success('Reply deleted!');
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to delete reply');
    } finally {
      setIsDeleting(false);
    }
  };

  const initial = review.userName[0]?.toUpperCase() ?? '?';
  const repliesCount = replies.length;

  return (
    <div className={`${neuCard} p-5 space-y-4`}>

      {/* Review Header */}
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-primary ${neuInset} shrink-0`}>
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold text-gray-700 dark:text-white leading-tight">
              {review.userName}
            </p>
            <p className="text-[10px] text-gray-400 shrink-0">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            </p>
          </div>
          <div className="mt-1">
            <Stars rating={review.rating} />
          </div>
        </div>
      </div>

      {/* Review Comment */}
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {review.comment}
      </p>

      {/* Reply Input */}
      <form onSubmit={handleReply} className={`flex items-center gap-2 px-4 py-2.5 rounded-full ${neuInset}`}>
        <input
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
          placeholder="Write a reply to this review..."
          className="flex-1 bg-transparent outline-none text-xs text-gray-700 dark:text-white placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={isSending || !replyText.trim()}
          className="w-7 h-7 flex items-center justify-center rounded-full shrink-0
            bg-gradient-to-br from-primary to-orange-500 text-white
            disabled:opacity-50 transition-all hover:opacity-90"
        >
          {isSending ? <Loader size={11} className="animate-spin" /> : <Send size={11} />}
        </button>
      </form>

      {/* Toggle Replies */}
      <button
        onClick={toggleReplies}
        className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-70 transition-opacity"
      >
        {repliesOpen
          ? <><ChevronUp size={13} /> Hide Replies</>
          : <><ChevronDown size={13} /> {repliesLoaded ? `${repliesCount} Repl${repliesCount === 1 ? 'y' : 'ies'}` : 'View Replies'}</>
        }
      </button>

      {/* Replies List */}
      <AnimatePresence>
        {repliesOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pl-3 border-l-2 border-primary/20 space-y-2 pt-1">
              {repliesLoading ? (
                <div className="flex justify-center py-4">
                  <Loader className="animate-spin text-primary" size={20} />
                </div>
              ) : replies.length === 0 ? (
                <p className="text-xs text-gray-400 py-2">No replies yet.</p>
              ) : (
                replies.map(reply => (
                  <div key={reply.id} className={`${neuSmall} rounded-2xl p-3`}>
                    {editingReply?.id === reply.id ? (
                      <div className="space-y-2">
                        <input
                          autoFocus
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleUpdate()}
                          className={`w-full px-3 py-2 rounded-full text-xs outline-none text-gray-700 dark:text-white bg-transparent ${neuInset}`}
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingReply(null)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-semibold text-gray-500 ${neuSmall}`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdate}
                            disabled={isUpdating || !editText.trim()}
                            className="px-3 py-1.5 rounded-full text-[10px] font-bold text-white
                              bg-gradient-to-r from-primary to-orange-500
                              disabled:opacity-50 transition-all hover:opacity-90"
                          >
                            {isUpdating ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">
                            {reply.replyText}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {new Date(reply.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'short', day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => { setEditingReply(reply); setEditText(reply.replyText); }}
                            className={`w-6 h-6 flex items-center justify-center rounded-lg ${neuSmall} text-gray-400 hover:text-primary transition-colors`}
                          >
                            <Edit size={10} />
                          </button>
                          <button
                            onClick={() => setDeletingId(reply.id)}
                            className={`w-6 h-6 flex items-center justify-center rounded-lg ${neuSmall} text-gray-400 hover:text-red-500 transition-colors`}
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {deletingId && (
        <DeleteConfirmModal
          title="Delete Reply?"
          description="This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default ReviewCard;
