import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X, Heart, MessageSquare, Send, Loader,
  ChevronDown, ChevronUp, CornerDownRight,
} from 'lucide-react';
import { postsAPI, Post, Comment } from '@/services/postsService';
import { toast } from 'sonner';

const neu = "bg-[#e0e5ec] shadow-[6px_6px_14px_#b8bec7,-6px_-6px_14px_#ffffff] dark:bg-[#252838] dark:shadow-[5px_5px_12px_#12151f,-5px_-5px_12px_#2e3248]";
const neuSmall = "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";

interface Props {
  post: Post;
  onClose: () => void;
}

const Avatar = ({ name, size = 'sm' }: { name: string; size?: 'sm' | 'xs' }) => (
  <div className={`${size === 'sm' ? 'w-8 h-8 text-xs' : 'w-6 h-6 text-[10px]'} rounded-full flex items-center justify-center font-bold text-primary shrink-0 ${neuInset}`}>
    {name[0]?.toUpperCase()}
  </div>
);

const PostCommentsModal = ({ post, onClose }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  useEffect(() => {
    postsAPI.getComments(post.id)
      .then(setComments)
      .catch(() => toast.error('Failed to load comments'))
      .finally(() => setIsLoading(false));
  }, [post.id]);

  const handleReply = async (commentId: string) => {
    if (!replyContent.trim()) return;
    setIsReplying(true);
    try {
      await postsAPI.replyToComment(commentId, replyContent.trim());
      toast.success('Reply sent!');
      setReplyContent('');
      setReplyingTo(null);
      setExpandedReplies(prev => new Set([...prev, commentId]));
      postsAPI.getComments(post.id).then(setComments);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send reply');
    } finally {
      setIsReplying(false);
    }
  };

  const toggleReplies = (id: string) =>
    setExpandedReplies(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={`${neu} rounded-[2rem] w-full max-w-lg flex flex-col`}
        style={{ maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0">
          <h3 className="font-bold text-gray-700 dark:text-white">Comments</h3>
          <button onClick={onClose} className={`w-8 h-8 flex items-center justify-center rounded-xl ${neuSmall}`}>
            <X size={14} className="text-gray-400" />
          </button>
        </div>

        {/* Post Preview */}
        <div className={`mx-5 mb-4 p-4 rounded-2xl ${neuInset} shrink-0 space-y-3`}>
          {post.postAttachments?.startsWith('http') && (
            <img
              src={post.postAttachments}
              alt=""
              className="w-full h-40 object-cover rounded-xl"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget.parentElement as HTMLElement | null)?.classList.add('hidden');
              }}
            />
          )}
          <p className="text-sm text-gray-700 dark:text-white leading-relaxed line-clamp-3 whitespace-pre-line">
            {post.content}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Heart size={10} className="text-rose-400" /> {post.likesCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare size={10} className="text-primary" /> {post.commentsCount}
            </span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Comments */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader className="animate-spin text-primary" size={24} />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">No comments yet.</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className={`${neuSmall} rounded-2xl p-4`}>
                {/* Comment Author */}
                <div className="flex items-start gap-3">
                  <Avatar name={comment.userName} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold text-gray-700 dark:text-white">
                        {comment.userName}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-3 mt-2.5 ml-11">
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-[11px] font-semibold text-primary hover:opacity-70 transition-opacity flex items-center gap-1"
                  >
                    <CornerDownRight size={11} /> Reply
                  </button>
                  {comment.replies.length > 0 && (
                    <button
                      onClick={() => toggleReplies(comment.id)}
                      className="text-[11px] text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
                    >
                      {expandedReplies.has(comment.id)
                        ? <ChevronUp size={11} />
                        : <ChevronDown size={11} />
                      }
                      {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                    </button>
                  )}
                </div>

                {/* Reply Input */}
                {replyingTo === comment.id && (
                  <div className={`flex items-center gap-2 mt-2.5 ml-11 p-2 rounded-xl ${neuInset}`}>
                    <input
                      autoFocus
                      value={replyContent}
                      onChange={e => setReplyContent(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleReply(comment.id)}
                      placeholder="Write a reply..."
                      className="flex-1 bg-transparent outline-none text-xs text-gray-700 dark:text-white placeholder-gray-400"
                    />
                    <button
                      onClick={() => handleReply(comment.id)}
                      disabled={isReplying || !replyContent.trim()}
                      className="w-7 h-7 flex items-center justify-center rounded-lg
                        bg-gradient-to-br from-primary to-orange-500 text-white
                        disabled:opacity-50 transition-all hover:opacity-90"
                    >
                      {isReplying
                        ? <Loader size={11} className="animate-spin" />
                        : <Send size={11} />
                      }
                    </button>
                  </div>
                )}

                {/* Nested Replies */}
                {expandedReplies.has(comment.id) && comment.replies.length > 0 && (
                  <div className="ml-11 mt-2 space-y-2 border-l-2 border-primary/20 pl-3">
                    {comment.replies.map(reply => (
                      <div key={reply.id} className="flex items-start gap-2">
                        <Avatar name={reply.userName} size="xs" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-600 dark:text-gray-300">
                            {reply.userName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PostCommentsModal;