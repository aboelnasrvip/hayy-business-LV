import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Heart, MessageSquare,
  Loader, MapPin, FileText,
} from 'lucide-react';
import { postsAPI, Post } from '@/services/postsService';
import { placesAPI, Place } from '@/services/placesService';
import DeleteConfirmModal from '@/components/places/DeleteConfirmModal';
import PostCommentsModal from '@/components/places/PostCommentsModal';
import { toast } from 'sonner';

const neuCard = "rounded-[1.5rem] bg-[#e8ecf3] shadow-[12px_12px_24px_#adb5c0,-12px_-12px_24px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[8px_8px_20px_#0e1020,-8px_-8px_20px_#343750]";
const neuSmall = "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";

const DashboardPosts = () => {
  const [places, setPlaces]               = useState<Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('');
  const [posts, setPosts]                 = useState<Post[]>([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [postsLoading, setPostsLoading]   = useState(false);

  const [showForm, setShowForm]           = useState(false);
  const [editingPost, setEditingPost]     = useState<Post | null>(null);
  const [deletingPost, setDeletingPost]   = useState<Post | null>(null);
  const [viewingPost, setViewingPost]     = useState<Post | null>(null);
  const [isSubmitting, setIsSubmitting]   = useState(false);

  const [content, setContent]             = useState('');
  const [attachment, setAttachment]       = useState('');

  /* ── Load places ── */
  useEffect(() => {
    placesAPI.getMyPlaces()
      .then(data => {
        setPlaces(data);
        if (data.length > 0) setSelectedPlaceId(data[0].id);
      })
      .catch(() => toast.error('Failed to load places'))
      .finally(() => setPlacesLoading(false));
  }, []);

  /* ── Load posts when place changes ── */
  useEffect(() => {
    if (!selectedPlaceId) return;
    setPostsLoading(true);
    postsAPI.getPostsByPlace(selectedPlaceId)
      .then(res => setPosts(res.data))
      .catch(() => toast.error('Failed to load posts'))
      .finally(() => setPostsLoading(false));
  }, [selectedPlaceId]);

  const openAdd = () => {
    setContent('');
    setAttachment('');
    setEditingPost(null);
    setShowForm(true);
  };

  const openEdit = (post: Post) => {
    setContent(post.content);
    setAttachment(post.postAttachments ?? '');
    setEditingPost(post);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingPost(null);
    setContent('');
    setAttachment('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingPost) {
        await postsAPI.updatePost(editingPost.id, {
          content,
          postAttachments: attachment,
        });
        setPosts(prev => prev.map(p =>
          p.id === editingPost.id
            ? { ...p, content, postAttachments: attachment }
            : p
        ));
        toast.success('Post updated!');
      } else {
        const newPost = await postsAPI.createPost({
          placeId: selectedPlaceId,
          content,
          postAttachments: attachment,
        });
        setPosts(prev => [newPost, ...prev]);
        toast.success('Post created!');
      }
      cancelForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPost) return;
    setIsSubmitting(true);
    try {
      await postsAPI.deletePost(deletingPost.id);
      setPosts(prev => prev.filter(p => p.id !== deletingPost.id));
      setDeletingPost(null);
      toast.success('Post deleted!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPlace = places.find(p => p.id === selectedPlaceId);
  const initial = selectedPlace?.name[0]?.toUpperCase() ?? '?';

  return (
    <div className="space-y-6 pt-16">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700 dark:text-white">Posts</h1>
          <p className="text-sm text-gray-400 mt-0.5">Share updates with your audience</p>
        </div>
        {selectedPlaceId && !showForm && (
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-white text-sm
              bg-gradient-to-r from-primary to-orange-500
              shadow-[4px_4px_10px_#b8bec7,-2px_-2px_6px_#ffffff]
              dark:shadow-[4px_4px_10px_#12151f,-2px_-2px_6px_#2e3248]
              hover:opacity-90 transition-all"
          >
            <Plus size={16} /> New Post
          </button>
        )}
      </div>

      {/* ── Place Selector ── */}
      {placesLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="animate-spin text-primary" size={28} />
        </div>
      ) : places.length === 0 ? (
        <div className={`${neuCard} p-10 text-center`}>
          <MapPin size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No places found</p>
          <p className="text-sm text-gray-300 dark:text-gray-600 mt-1">
            Add a place first to create posts
          </p>
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap items-center justify-center">
          {places.map(place => (
            <button
              key={place.id}
              onClick={() => { setSelectedPlaceId(place.id); cancelForm(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all
                ${selectedPlaceId === place.id
                  ? 'bg-gradient-to-r from-primary to-orange-500 text-white shadow-[3px_3px_8px_rgba(0,0,0,0.15)]'
                  : `text-gray-500 dark:text-gray-400 ${neuSmall} hover:text-primary`
                }`}
            >
              <MapPin size={13} /> {place.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className={`${neuCard} p-5 space-y-4`}
        >
          <h3 className="font-bold text-gray-700 dark:text-white text-sm">
            {editingPost ? 'Edit Post' : `New Post — ${selectedPlace?.name}`}
          </h3>

          {/* Content */}
          <div className={`px-4 py-3 rounded-2xl ${neuInset}`}>
            <textarea
              autoFocus required rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 resize-none"
            />
          </div>

          {/* Attachment */}
          <div className={`flex items-center gap-3 px-4 py-2.5 rounded-full ${neuInset}`}>
            <input
              value={attachment}
              onChange={e => setAttachment(e.target.value)}
              placeholder="Attachment URL (optional)"
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button" onClick={cancelForm}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold text-gray-500 ${neuSmall}`}
            >
              Cancel
            </button>
            <button
              type="submit" disabled={isSubmitting}
              className="px-5 py-2.5 rounded-full text-sm font-bold text-white
                bg-gradient-to-r from-primary to-orange-500
                shadow-[3px_3px_8px_#b8bec7] dark:shadow-[3px_3px_8px_#12151f]
                hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Saving...' : editingPost ? 'Update' : 'Publish'}
            </button>
          </div>
        </motion.form>
      )}

      {/* ── Posts Grid ── */}
      {postsLoading ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin text-primary" size={32} />
        </div>
      ) : posts.length === 0 && selectedPlaceId ? (
        <div className={`${neuCard} p-12 text-center`}>
          <FileText size={36} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No posts yet</p>
          <p className="text-sm text-gray-300 dark:text-gray-600 mt-1">
            Share something with your audience
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              onClick={() => setViewingPost(post)}
              className={`${neuCard} p-5 cursor-pointer flex flex-col gap-3 transition-all`}
            >
              {/* Post Header */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-primary ${neuInset} shrink-0`}>
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-700 dark:text-white truncate">
                    {selectedPlace?.name}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Content */}
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed line-clamp-4 flex-1">
                {post.content}
              </p>

              {/* Attachment preview */}
              {post.postAttachments && post.postAttachments.startsWith('http') && (
                <div className={`text-[10px] text-primary truncate px-3 py-1.5 rounded-full ${neuInset}`}>
                  📎 {post.postAttachments}
                </div>
              )}

              {/* Footer */}
              <div className={`flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-gray-700/30`}>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Heart size={12} className="text-rose-400" />
                    {post.likesCount}
                  </span>
                  <span className="flex items-center gap-1.5 text-primary font-medium">
                    <MessageSquare size={12} />
                    {post.commentsCount}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => openEdit(post)}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl ${neuSmall} text-gray-400 hover:text-primary transition-colors`}
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    onClick={() => setDeletingPost(post)}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl ${neuSmall} text-gray-400 hover:text-red-500 transition-colors`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      {deletingPost && (
        <DeleteConfirmModal
          title="Delete Post?"
          description="This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeletingPost(null)}
          isLoading={isSubmitting}
        />
      )}

      <AnimatePresence>
        {viewingPost && (
          <PostCommentsModal
            post={viewingPost}
            onClose={() => setViewingPost(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPosts;