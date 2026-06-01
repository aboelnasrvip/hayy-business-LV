import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Star, Edit, Clock, MessageSquare,
  Heart, Plus, Trash2, Loader, Info, CalendarDays, Tag,
} from 'lucide-react';
import { placesAPI, Place, CreatePlaceRequest } from '@/services/placesService';
import { postsAPI, Post } from '@/services/postsService';
import EventsTab from '@/components/places/EventsTab';
import OffersTab from '@/components/places/OffersTab';
import PostCommentsModal from '@/components/places/PostCommentsModal';
import DeleteConfirmModal from '@/components/places/DeleteConfirmModal';
import AddEditPlaceModal from '@/components/places/AddEditPlaceModal';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';

const neuCard = "bg-[#e0e5ec] shadow-[6px_6px_14px_#b8bec7,-6px_-6px_14px_#ffffff] dark:bg-[#252838] dark:shadow-[5px_5px_12px_#12151f,-5px_-5px_12px_#2e3248]";
const neuSmall = "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";

type Tab = 'info' | 'posts' | 'events' | 'offers';

const TABS: { id: Tab; label: string; icon: typeof Info }[] = [
  { id: 'info',   label: 'Info',   icon: Info },
  { id: 'posts',  label: 'Posts',  icon: MessageSquare },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'offers', label: 'Offers', icon: Tag },
];

const DAYS: Record<number, string> = {
  0:'Sun', 1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 6:'Sat', 7:'Sun',
};

const isValidUrl = (url?: string) =>
  !!url && url !== 'string' && url.trim() !== '' && (url.startsWith('http') || url.startsWith('/'));

const PlaceProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const businessId = user?.businessId ?? '';

  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [showEditModal, setShowEditModal] = useState(false);

  // Posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsFetched, setPostsFetched] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postAttachments, setPostAttachments] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  useEffect(() => {
    if (!id) return;
    placesAPI.getPlaceById(id)
      .then(setPlace)
      .catch(() => { toast.error('Place not found'); navigate(-1); })
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (activeTab === 'posts' && !postsFetched && id) {
      setPostsLoading(true);
      postsAPI.getPostsByPlace(id)
        .then(res => { setPosts(res.data); setPostsFetched(true); })
        .catch(() => toast.error('Failed to load posts'))
        .finally(() => setPostsLoading(false));
    }
  }, [activeTab, id, postsFetched]);

  const handleUpdate = async (data: CreatePlaceRequest) => {
    if (!id) return;
    await placesAPI.updatePlace(id, data);
    toast.success('Place updated!');
    const updated = await placesAPI.getPlaceById(id);
    setPlace(updated);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!place) return;
    setIsSubmittingPost(true);
    try {
      const newPost = await postsAPI.createPost({
        placeId: place.id, content: postContent, postAttachments,
      });
      setPosts(p => [newPost, ...p]);
      setPostContent(''); setPostAttachments(''); setShowAddPost(false);
      toast.success('Post created!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create post');
    } finally { setIsSubmittingPost(false); }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    setIsSubmittingPost(true);
    try {
      await postsAPI.updatePost(editingPost.id, {
        content: editingPost.content,
        postAttachments: editingPost.postAttachments,
      });
      setPosts(p => p.map(post => post.id === editingPost.id ? editingPost : post));
      setEditingPost(null);
      toast.success('Post updated!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update post');
    } finally { setIsSubmittingPost(false); }
  };

  const handleDeletePost = async () => {
    if (!deletingPost) return;
    setIsSubmittingPost(true);
    try {
      await postsAPI.deletePost(deletingPost.id);
      setPosts(p => p.filter(post => post.id !== deletingPost.id));
      setDeletingPost(null);
      toast.success('Post deleted!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete post');
    } finally { setIsSubmittingPost(false); }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec] dark:bg-[#252838] pt-16">
      <Loader className="animate-spin text-primary" size={40} />
    </div>
  );

  if (!place) return null;

  const initial = place.name[0]?.toUpperCase() ?? '?';
  const hasCover = isValidUrl(place.coverImage);

  return (
    <div className="min-h-screen bg-[#e0e5ec] dark:bg-[#252838] pt-16 pb-12">

      {/* Back Button */}
      <div className=" mx-auto px-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300 ${neuSmall} hover:text-primary transition-colors`}
        >
          <ArrowLeft size={16} /> Back to Places
        </button>
      </div>

      <div className=" mx-auto px-4">

        {/* ── Cover + Profile (Facebook style) ── */}
        <div
          className="relative rounded-[2rem] overflow-visible mb-6
            shadow-[8px_8px_20px_#b8bec7,-8px_-8px_20px_#ffffff]
            dark:shadow-[6px_6px_16px_#0e1020,-6px_-6px_16px_#343750]"
        >
          {/* Cover Photo */}
          <div
            className="w-full h-52 rounded-[2rem] overflow-hidden"
            style={hasCover
              ? { backgroundImage: `url(${place.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : {}
            }
          >
            {!hasCover && (
              <div className="w-full h-full bg-gradient-to-br from-primary/70 via-orange-400/60 to-orange-300/50 relative">
                {/* Decorative circles */}
                <div className="absolute top-4 right-8 w-24 h-24 rounded-full bg-white/10" />
                <div className="absolute bottom-6 right-24 w-16 h-16 rounded-full bg-white/10" />
                <div className="absolute top-8 left-1/3 w-32 h-32 rounded-full bg-white/5" />
                <span className="absolute bottom-4 left-6 text-white/20 text-8xl font-black select-none">
                  {initial}
                </span>
              </div>
            )}
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setShowEditModal(true)}
            className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
              bg-[#e0e5ec]/90 dark:bg-[#252838]/90 backdrop-blur-sm text-gray-600 dark:text-gray-300
              ${neuSmall} hover:text-primary transition-colors`}
          >
            <Edit size={13} /> Edit
          </button>

          {/* Profile Circle */}
          <div className="absolute -bottom-10 left-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center
              bg-[#e0e5ec] dark:bg-[#252838]
              shadow-[5px_5px_12px_#b8bec7,-5px_-5px_12px_#ffffff]
              dark:shadow-[5px_5px_12px_#0e1020,-5px_-5px_12px_#343750]
              border-4 border-[#e0e5ec] dark:border-[#252838]`}
            >
              <span className="text-3xl font-black text-primary">{initial}</span>
            </div>
          </div>
        </div>

        {/* ── Place Name + Meta ── */}
        <div className="pl-28 mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-700 dark:text-white leading-tight">
              {place.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className={`text-xs px-3 py-1 rounded-full font-semibold text-primary ${neuInset}`}>
                {place.categoryName}
              </span>
              <span className={`flex items-center gap-1 text-xs text-gray-500 px-3 py-1 rounded-full ${neuSmall}`}>
                <Star size={10} className="text-orange-400 fill-orange-400" />
                {place.rating > 0 ? place.rating.toFixed(1) : 'No ratings'}
              </span>
            </div>
          </div>
        </div>

        {/* Location badge */}
        <div className="mb-6">
          <span className={`inline-flex items-center gap-1.5 text-xs text-gray-500 px-3 py-1.5 rounded-full ${neuSmall}`}>
            <MapPin size={11} className="text-primary" />
            {place.latitude.toFixed(5)}, {place.longitude.toFixed(5)}
          </span>
        </div>

        {/* ── Tab Navigation ── */}
        <div className={`flex gap-1 p-1 rounded-2xl mb-6 ${neuInset}`}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all
                  ${isActive
                    ? 'bg-gradient-to-r from-primary to-orange-500 text-white shadow-[3px_3px_8px_rgba(0,0,0,0.2)]'
                    : 'text-gray-400 hover:text-primary'
                  }`}
              >
                <Icon size={13} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}

        {/* INFO */}
        {activeTab === 'info' && (
          <motion.div key="info" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className={`${neuCard} rounded-2xl p-5`}>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {place.description}
              </p>
            </div>

            {place.openingHours.length > 0 && (
              <div className={`${neuCard} rounded-2xl p-5`}>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock size={13} className="text-primary" /> Opening Hours
                </p>
                <div className="space-y-2">
                  {place.openingHours.map(h => (
                    <div key={h.dayOfWeek} className="flex justify-between items-center py-1">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full text-primary ${neuInset}`}>
                        {DAYS[h.dayOfWeek]}
                      </span>
                      <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                        {h.openTime} – {h.closeTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* POSTS */}
        {activeTab === 'posts' && (
          <motion.div key="posts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

            {/* Add Post */}
            {!showAddPost && !editingPost && (
              <div className={`${neuCard} rounded-2xl p-4 flex items-center gap-3`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-primary ${neuInset}`}>
                  {initial}
                </div>
                <button
                  onClick={() => setShowAddPost(true)}
                  className={`flex-1 text-left px-4 py-2.5 rounded-full text-sm text-gray-400 ${neuInset} hover:text-gray-600 dark:hover:text-gray-200 transition-colors`}
                >
                  What's on your mind?
                </button>
                <button
                  onClick={() => setShowAddPost(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold text-white
                    bg-gradient-to-r from-primary to-orange-500
                    shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff] dark:shadow-[3px_3px_8px_#12151f]
                    hover:opacity-90 transition-all"
                >
                  <Plus size={14} /> Post
                </button>
              </div>
            )}

            {/* Form */}
            {(showAddPost || editingPost) && (
              <form onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
                className={`${neuCard} rounded-2xl p-5 space-y-3`}>
                <div className={`px-4 py-3 rounded-2xl ${neuInset}`}>
                  <textarea
                    autoFocus required rows={4}
                    value={editingPost ? editingPost.content : postContent}
                    onChange={e => editingPost
                      ? setEditingPost({ ...editingPost, content: e.target.value })
                      : setPostContent(e.target.value)
                    }
                    placeholder="What's on your mind?"
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
                <div className="flex justify-end gap-2">
                  <button type="button"
                    onClick={() => { setShowAddPost(false); setEditingPost(null); }}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold text-gray-500 ${neuSmall}`}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmittingPost}
                    className="px-5 py-2.5 rounded-full text-sm font-bold text-white
                      bg-gradient-to-r from-primary to-orange-500
                      shadow-[3px_3px_8px_#b8bec7] dark:shadow-[3px_3px_8px_#12151f]
                      hover:opacity-90 disabled:opacity-50 transition-all">
                    {isSubmittingPost ? 'Saving...' : editingPost ? 'Update' : 'Publish'}
                  </button>
                </div>
              </form>
            )}

            {/* Posts List */}
            {postsLoading ? (
              <div className="flex justify-center py-12">
                <Loader className="animate-spin text-primary" size={32} />
              </div>
            ) : posts.length === 0 ? (
              <div className={`${neuCard} rounded-2xl p-12 text-center`}>
                <MessageSquare size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No posts yet</p>
                <p className="text-gray-300 dark:text-gray-600 text-sm mt-1">Share something with your audience</p>
              </div>
            ) : (
              posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -2 }}
                  onClick={() => setViewingPost(post)}
                  className={`${neuCard} rounded-2xl p-5 cursor-pointer transition-all`}
                >
                  {/* Post Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-primary ${neuInset}`}>
                      {initial}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700 dark:text-white">{place.name}</p>
                      <p className="text-[10px] text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-gray-700 dark:text-white leading-relaxed mb-4 line-clamp-4">
                    {post.content}
                  </p>

                  {/* Footer */}
                  <div className={`flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-gray-700/30`}>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Heart size={13} className="text-rose-400" /> {post.likesCount}
                      </span>
                      <span className="flex items-center gap-1.5 text-primary font-medium">
                        <MessageSquare size={13} /> {post.commentsCount} comments
                      </span>
                    </div>
                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => { setEditingPost(post); setShowAddPost(false); }}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg ${neuSmall} text-gray-400 hover:text-primary transition-colors`}>
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => setDeletingPost(post)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg ${neuSmall} text-gray-400 hover:text-red-500 transition-colors`}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* EVENTS */}
        {activeTab === 'events' && (
          <motion.div key="events" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <EventsTab placeId={place.id} />
          </motion.div>
        )}

        {/* OFFERS */}
        {activeTab === 'offers' && (
          <motion.div key="offers" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <OffersTab placeId={place.id} />
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {showEditModal && (
        <AddEditPlaceModal
          place={place}
          businessId={businessId}
          onSubmit={handleUpdate}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {deletingPost && (
        <DeleteConfirmModal
          title="Delete Post"
          description="This action cannot be undone."
          onConfirm={handleDeletePost}
          onCancel={() => setDeletingPost(null)}
          isLoading={isSubmittingPost}
        />
      )}

      <AnimatePresence>
        {viewingPost && (
          <PostCommentsModal post={viewingPost} onClose={() => setViewingPost(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlaceProfilePage;