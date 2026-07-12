import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Heart, MessageSquare,
  Loader, MapPin, FileText, UploadCloud, X, ImageIcon,
} from 'lucide-react';
import { postsAPI, Post } from '@/services/postsService';
import { placesAPI, Place } from '@/services/placesService';
import DeleteConfirmModal from '@/components/places/DeleteConfirmModal';
import PostCommentsModal from '@/components/places/PostCommentsModal';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';

const neuCard = "rounded-[1.5rem] bg-[#e8ecf3] shadow-[12px_12px_24px_#adb5c0,-12px_-12px_24px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[8px_8px_20px_#0e1020,-8px_-8px_20px_#343750]";
const neuSmall = "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";

const isImageUrl = (url?: string) =>
  !!url && url !== 'string' && url.trim() !== '' && url.startsWith('http');

/** Square thumbnail — hides when remote image fails */
const PostThumb = ({ src }: { src: string }) => {
  const [failed, setFailed] = useState(false);
  if (failed || !isImageUrl(src)) {
    return (
      <div className={`w-28 sm:w-32 shrink-0 self-stretch min-h-[7.5rem] flex items-center justify-center rounded-l-[1.5rem] ${neuInset}`}>
        <ImageIcon size={28} className="text-gray-300 dark:text-gray-600" />
      </div>
    );
  }
  return (
    <div className="w-28 sm:w-32 shrink-0 self-stretch min-h-[7.5rem] overflow-hidden rounded-l-[1.5rem] bg-gray-200/40 dark:bg-gray-800/40">
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover"
        onError={() => setFailed(true)}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

const DashboardPosts = () => {
  const { user } = useAppSelector(s => s.auth);
  const userId = user?.id ?? '';

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
  const [imageFile, setImageFile]         = useState<File | null>(null);
  const [imagePreview, setImagePreview]   = useState('');

  const fetchPosts = async (placeId: string) => {
    setPostsLoading(true);
    try {
      const res = await postsAPI.getPostsByPlace(placeId);
      setPosts(res.data);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    placesAPI.getMyPlaces()
      .then(data => {
        setPlaces(data);
        if (data.length > 0) setSelectedPlaceId(data[0].id);
      })
      .catch(() => toast.error('Failed to load places'))
      .finally(() => setPlacesLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedPlaceId) return;
    fetchPosts(selectedPlaceId);
  }, [selectedPlaceId]);

  const resetImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const openAdd = () => {
    setContent('');
    resetImage();
    setEditingPost(null);
    setShowForm(true);
  };

  const openEdit = (post: Post) => {
    setContent(post.content);
    setImageFile(null);
    setImagePreview(isImageUrl(post.postAttachments) ? post.postAttachments : '');
    setEditingPost(post);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingPost(null);
    setContent('');
    resetImage();
  };

  const handleImageSelect = (file: File | null) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error('User not found. Please log in again.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingPost) {
        await postsAPI.updatePost(
          editingPost.id,
          { content, userId, placeId: selectedPlaceId },
          imageFile ?? undefined,
        );
        toast.success('Post updated!');
      } else {
        await postsAPI.createPost(
          { userId, placeId: selectedPlaceId, content },
          imageFile ?? undefined,
        );
        toast.success('Post created!');
      }
      cancelForm();
      await fetchPosts(selectedPlaceId);
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Operation failed');
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
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to delete post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPlace = places.find(p => p.id === selectedPlaceId);
  const initial = selectedPlace?.name[0]?.toUpperCase() ?? '?';

  return (
    <div className="space-y-6 pt-16">

      {/* Header */}
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

      {/* Place Selector */}
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

      {/* Add / Edit Form */}
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

          <div className={`px-4 py-3 rounded-2xl ${neuInset}`}>
            <textarea
              autoFocus required rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 resize-none"
            />
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">
              Post Image (optional)
            </p>
            <input
              type="file"
              accept="image/*"
              id="post-image-input"
              className="hidden"
              onChange={e => handleImageSelect(e.target.files?.[0] ?? null)}
            />

            {imagePreview ? (
              <div className={`relative rounded-2xl overflow-hidden ${neuInset} p-1`}>
                <img
                  src={imagePreview}
                  alt="Post preview"
                  className="w-full h-44 object-cover rounded-xl"
                />
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <label
                    htmlFor="post-image-input"
                    className="w-8 h-8 flex items-center justify-center rounded-xl cursor-pointer
                      bg-white/85 dark:bg-[#252838]/85 backdrop-blur-sm
                      text-gray-500 hover:text-primary transition-colors
                      shadow-[2px_2px_5px_rgba(0,0,0,0.15)]"
                  >
                    <UploadCloud size={14} />
                  </label>
                  <button
                    type="button"
                    onClick={resetImage}
                    className="w-8 h-8 flex items-center justify-center rounded-xl
                      bg-white/85 dark:bg-[#252838]/85 backdrop-blur-sm
                      text-gray-500 hover:text-red-500 transition-colors
                      shadow-[2px_2px_5px_rgba(0,0,0,0.15)]"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="post-image-input"
                className={`flex flex-col items-center justify-center gap-2 w-full h-28
                  rounded-2xl cursor-pointer transition-all border-2 border-dashed
                  border-gray-300 dark:border-gray-600 hover:border-primary ${neuInset}`}
              >
                <ImageIcon size={22} className="text-gray-400" />
                <span className="text-xs text-gray-400 font-medium">Click to upload image</span>
                <span className="text-[10px] text-gray-300 dark:text-gray-600">PNG, JPG, WEBP</span>
              </label>
            )}
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

      {/* Posts Grid */}
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              onClick={() => setViewingPost(post)}
              className={`${neuCard} overflow-hidden cursor-pointer flex flex-row items-stretch transition-all`}
            >
              {/* Left: square thumbnail */}
              <PostThumb src={post.postAttachments ?? ''} />

              {/* Right: content */}
              <div className="flex-1 min-w-0 p-4 flex flex-col gap-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-primary ${neuInset} shrink-0`}>
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-700 dark:text-white truncate leading-tight">
                        {selectedPlace?.name}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => openEdit(post)}
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

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 flex-1 whitespace-pre-line">
                  {post.content}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Heart size={12} className="text-rose-400" />
                    {post.likesCount}
                  </span>
                  <span className="flex items-center gap-1.5 text-primary font-medium">
                    <MessageSquare size={12} />
                    {post.commentsCount}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
