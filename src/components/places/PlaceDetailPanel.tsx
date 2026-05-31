import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X, MapPin, Star, Clock, Edit, Plus, Trash2,
  MessageSquare, Heart, Loader, Info, CalendarDays, Tag,
} from 'lucide-react';
import { Place } from '@/services/placesService';
import { postsAPI, Post } from '@/services/postsService';
import DeleteConfirmModal from './DeleteConfirmModal';
import PostCommentsModal from './PostCommentsModal';
import EventsTab from './EventsTab';
import OffersTab from './OffersTab';
import { toast } from 'sonner';

const neu = "bg-[#e0e5ec] shadow-[6px_6px_14px_#b8bec7,-6px_-6px_14px_#ffffff] dark:bg-[#252838] dark:shadow-[5px_5px_12px_#12151f,-5px_-5px_12px_#2e3248]";
const neuSmall = "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";

const DAYS: Record<number, string> = { 0:'Sun',1:'Mon',2:'Tue',3:'Wed',4:'Thu',5:'Fri',6:'Sat',7:'Sun' };
type Tab = 'info' | 'posts' | 'events' | 'offers';

const TABS: { id: Tab; label: string; icon: typeof Info }[] = [
  { id: 'info',   label: 'Info',   icon: Info },
  { id: 'posts',  label: 'Posts',  icon: MessageSquare },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'offers', label: 'Offers', icon: Tag },
];

interface Props {
  place: Place;
  onClose: () => void;
  onEdit: () => void;
}

const PlaceDetailPanel = ({ place, onClose, onEdit }: Props) => {
  const [activeTab, setActiveTab] = useState<Tab>('info');

  // Posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postAttachments, setPostAttachments] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activeTab === 'posts' && posts.length === 0) {
      setPostsLoading(true);
      postsAPI.getPostsByPlace(place.id)
        .then(res => setPosts(res.data))
        .catch(() => toast.error('Failed to load posts'))
        .finally(() => setPostsLoading(false));
    }
  }, [activeTab, place.id]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newPost = await postsAPI.createPost({ placeId: place.id, content: postContent, postAttachments });
      setPosts(p => [newPost, ...p]);
      setPostContent(''); setPostAttachments(''); setShowAddPost(false);
      toast.success('Post created!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create post');
    } finally { setIsSubmitting(false); }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    setIsSubmitting(true);
    try {
      await postsAPI.updatePost(editingPost.id, { content: editingPost.content, postAttachments: editingPost.postAttachments });
      setPosts(p => p.map(post => post.id === editingPost.id ? editingPost : post));
      setEditingPost(null);
      toast.success('Post updated!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update post');
    } finally { setIsSubmitting(false); }
  };

  const handleDeletePost = async () => {
    if (!deletingPost) return;
    setIsSubmitting(true);
    try {
      await postsAPI.deletePost(deletingPost.id);
      setPosts(p => p.filter(post => post.id !== deletingPost.id));
      setDeletingPost(null);
      toast.success('Post deleted!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete post');
    } finally { setIsSubmitting(false); }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full max-w-md z-40 flex flex-col
          bg-[#e0e5ec] dark:bg-[#252838]
          shadow-[-10px_0_30px_rgba(0,0,0,0.1)] dark:shadow-[-10px_0_30px_rgba(0,0,0,0.4)]"
      >
        {/* ── Header ── */}
        <div className="shrink-0 p-5 pb-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-700 dark:text-white">{place.name}</h2>
              <span className={`text-xs px-3 py-1 rounded-full mt-1 inline-block font-semibold text-primary ${neuInset}`}>
                {place.categoryName}
              </span>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={onEdit}
                className={`w-9 h-9 flex items-center justify-center rounded-xl ${neuSmall} text-gray-400 hover:text-primary transition-colors`}>
                <Edit size={15} />
              </button>
              <button onClick={onClose}
                className={`w-9 h-9 flex items-center justify-center rounded-xl ${neuSmall} text-gray-400 hover:text-gray-600 transition-colors`}>
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className={`flex gap-1 p-1 rounded-2xl mt-3 mb-4 ${neuInset}`}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-semibold transition-all
                    ${isActive
                      ? 'bg-gradient-to-r from-primary to-orange-500 text-white shadow-[2px_2px_6px_rgba(0,0,0,0.15)]'
                      : 'text-gray-400 hover:text-primary'
                    }`}
                >
                  <Icon size={11} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-4">

          {/* ── INFO TAB ── */}
          {activeTab === 'info' && (
            <>
              <div className={`${neu} rounded-2xl p-4 space-y-3`}>
                <p className="text-sm text-gray-500 dark:text-gray-400">{place.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`flex items-center gap-1.5 text-xs text-gray-500 px-3 py-1.5 rounded-full ${neuSmall}`}>
                    <MapPin size={11} className="text-primary" />
                    {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                  </span>
                  <span className={`flex items-center gap-1.5 text-xs text-gray-500 px-3 py-1.5 rounded-full ${neuSmall}`}>
                    <Star size={11} className="text-orange-400" />
                    {place.rating}
                  </span>
                </div>
              </div>

              {place.openingHours.length > 0 && (
                <div className={`${neu} rounded-2xl p-4`}>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Clock size={13} className="text-primary" /> Opening Hours
                  </p>
                  <div className="space-y-1.5">
                    {place.openingHours.map(h => (
                      <div key={h.dayOfWeek} className="flex justify-between text-sm">
                        <span className="font-semibold text-gray-600 dark:text-gray-300">{DAYS[h.dayOfWeek]}</span>
                        <span className="text-gray-400 font-mono text-xs">{h.openTime} – {h.closeTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── POSTS TAB ── */}
          {activeTab === 'posts' && (
            <div className="space-y-3">
              {/* Add Post Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => { setShowAddPost(true); setEditingPost(null); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white
                    bg-gradient-to-r from-primary to-orange-500
                    shadow-[2px_2px_6px_#b8bec7,-1px_-1px_3px_#ffffff] dark:shadow-[2px_2px_6px_#12151f]
                    hover:opacity-90 transition-all"
                >
                  <Plus size={12} /> Add Post
                </button>
              </div>

              {/* Add/Edit Form */}
              {(showAddPost || editingPost) && (
                <form
                  onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
                  className={`${neu} rounded-2xl p-4 space-y-3`}
                >
                  <div className={`px-4 py-2.5 rounded-xl ${neuInset}`}>
                    <textarea
                      required rows={3}
                      value={editingPost ? editingPost.content : postContent}
                      onChange={e => editingPost
                        ? setEditingPost({ ...editingPost, content: e.target.value })
                        : setPostContent(e.target.value)
                      }
                      placeholder="Write your post..."
                      className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 resize-none"
                    />
                  </div>
                  <div className={`flex items-center gap-3 px-4 py-2.5 rounded-full ${neuInset}`}>
                    <input
                      value={editingPost ? editingPost.postAttachments : postAttachments}
                      onChange={e => editingPost
                        ? setEditingPost({ ...editingPost, postAttachments: e.target.value })
                        : setPostAttachments(e.target.value)
                      }
                      placeholder="Attachment URL (optional)"
                      className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => { setShowAddPost(false); setEditingPost(null); }}
                      className={`px-4 py-2 rounded-full text-xs font-semibold text-gray-500 ${neuSmall}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit" disabled={isSubmitting}
                      className="px-4 py-2 rounded-full text-xs font-bold text-white
                        bg-gradient-to-r from-primary to-orange-500
                        shadow-[2px_2px_6px_#b8bec7] dark:shadow-[2px_2px_6px_#12151f]
                        hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                      {isSubmitting ? 'Saving...' : editingPost ? 'Update' : 'Post'}
                    </button>
                  </div>
                </form>
              )}

              {/* Posts List */}
              {postsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="animate-spin text-primary" size={24} />
                </div>
              ) : posts.length === 0 ? (
                <div className={`${neu} rounded-2xl p-6 text-center`}>
                  <p className="text-sm text-gray-400">No posts yet. Add your first post!</p>
                </div>
              ) : (
                posts.map(post => (
                  <div
                    key={post.id}
                    onClick={() => setViewingPost(post)}
                    className={`${neu} rounded-2xl p-4 cursor-pointer hover:shadow-[8px_8px_18px_#adb5c0,-8px_-8px_18px_#ffffff] dark:hover:shadow-[8px_8px_18px_#0e1020,-8px_-8px_18px_#343750] transition-all`}
                  >
                    <p className="text-sm text-gray-700 dark:text-white mb-3 leading-relaxed line-clamp-3">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Heart size={11} className="text-rose-400" /> {post.likesCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={11} className="text-primary" /> {post.commentsCount}
                        </span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => { setEditingPost(post); setShowAddPost(false); }}
                          className={`w-7 h-7 flex items-center justify-center rounded-lg ${neuSmall} text-gray-400 hover:text-primary transition-colors`}
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => setDeletingPost(post)}
                          className={`w-7 h-7 flex items-center justify-center rounded-lg ${neuSmall} text-gray-400 hover:text-red-500 transition-colors`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── EVENTS TAB ── */}
          {activeTab === 'events' && <EventsTab placeId={place.id} />}

          {/* ── OFFERS TAB ── */}
          {activeTab === 'offers' && <OffersTab placeId={place.id} />}
        </div>
      </motion.div>

      {/* Delete Post Confirm */}
      {deletingPost && (
        <DeleteConfirmModal
          title="Delete Post"
          description="This action cannot be undone."
          onConfirm={handleDeletePost}
          onCancel={() => setDeletingPost(null)}
          isLoading={isSubmitting}
        />
      )}

      {/* Post Comments Modal */}
      <AnimatePresence>
        {viewingPost && (
          <PostCommentsModal
            post={viewingPost}
            onClose={() => setViewingPost(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PlaceDetailPanel;