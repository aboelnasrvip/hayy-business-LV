import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, MapPin, Edit, Trash2, Clock, Star, Loader,
} from 'lucide-react';
import { placesAPI, Place, CreatePlaceRequest } from '@/services/placesService';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';
import AddEditPlaceModal from '@/components/places/AddEditPlaceModal';
import DeleteConfirmModal from '@/components/places/DeleteConfirmModal';
import { useNavigate } from 'react-router-dom';

const neuCard =
  "rounded-[1.5rem] bg-[#e8ecf3] shadow-[12px_12px_24px_#adb5c0,-12px_-12px_24px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[8px_8px_20px_#0e1020,-8px_-8px_20px_#343750]";
const neuSmall =
  "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset =
  "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";

const isValidUrl = (url?: string) =>
  !!url && url !== 'string' && url.trim() !== '' && url.startsWith('http');

/* ─── Gradient palette per initial letter ─── */
const GRADIENTS: Record<string, string> = {
  A: 'from-rose-400 to-pink-500',    B: 'from-orange-400 to-amber-500',
  C: 'from-yellow-400 to-orange-400',D: 'from-emerald-400 to-teal-500',
  E: 'from-cyan-400 to-blue-500',    F: 'from-violet-400 to-purple-500',
  G: 'from-fuchsia-400 to-pink-500', H: 'from-sky-400 to-indigo-500',
  I: 'from-lime-400 to-green-500',   J: 'from-red-400 to-rose-500',
};
const getGradient = (name: string) =>
  GRADIENTS[name[0]?.toUpperCase()] ?? 'from-primary to-orange-500';

/* ─── Place Card ─── */
interface PlaceCardProps {
  place: Place;
  index: number;
  onEdit: (p: Place) => void;
  onDelete: (p: Place) => void;
  onClick: (p: Place) => void;
}

const PlaceCard = ({ place, index, onEdit, onDelete, onClick }: PlaceCardProps) => {
  const initial   = place.name[0]?.toUpperCase() ?? '?';
  const gradient  = getGradient(place.name);
  const hasCover  = isValidUrl(place.coverImage);
  const firstHour = place.openingHours?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onClick(place)}
      className={`${neuCard} overflow-hidden cursor-pointer group relative flex flex-col`}
    >

      {/* ── Cover / Banner ── */}
      <div className="relative h-28 overflow-hidden rounded-t-[1.5rem]">
        {hasCover ? (
          <img
            src={place.coverImage}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} relative`}>
            {/* decorative circles */}
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
            <div className="absolute bottom-2 right-10 w-12 h-12 rounded-full bg-white/10" />
            <div className="absolute top-4 left-1/3 w-24 h-24 rounded-full bg-white/5" />
            {/* big initial */}
            <span className="absolute bottom-2 left-4 text-6xl font-black text-white/20 select-none leading-none">
              {initial}
            </span>
          </div>
        )}

        {/* Action buttons — top-right, hidden until hover */}
        <div
          className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(place)}
            className="w-7 h-7 flex items-center justify-center rounded-xl
              bg-white/80 dark:bg-[#252838]/80 backdrop-blur-sm
              text-gray-500 hover:text-primary transition-colors
              shadow-[2px_2px_5px_rgba(0,0,0,0.15)]"
          >
            <Edit size={12} />
          </button>
          <button
            onClick={() => onDelete(place)}
            className="w-7 h-7 flex items-center justify-center rounded-xl
              bg-white/80 dark:bg-[#252838]/80 backdrop-blur-sm
              text-gray-500 hover:text-red-500 transition-colors
              shadow-[2px_2px_5px_rgba(0,0,0,0.15)]"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* ── Avatar circle ── */}
      <div className="px-5 -mt-6 mb-3 flex items-end justify-between">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center
            text-xl font-black text-primary
            border-4 border-[#e8ecf3] dark:border-[#2b2e42]
            ${neuInset}`}
        >
          {initial}
        </div>

        {/* Rating badge */}
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${neuSmall}`}>
          <Star size={11} className="fill-orange-400 text-orange-400" />
          <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
            {place.rating > 0 ? place.rating.toFixed(1) : '—'}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-5 pb-5 flex flex-col gap-3 flex-1">

        {/* Name + Category */}
        <div>
          <h3 className="font-black text-gray-700 dark:text-white text-base leading-tight">
            {place.name}
          </h3>
          {place.categoryName && (
            <span className={`inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full font-semibold text-primary ${neuInset}`}>
              {place.categoryName}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1">
          {place.description || 'No description provided.'}
        </p>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-gray-200/50 dark:border-gray-700/30">
          <span className={`flex items-center gap-1 text-[10px] text-gray-500 px-2.5 py-1 rounded-full ${neuSmall}`}>
            <MapPin size={9} className="text-primary" />
            {place.latitude.toFixed(3)}, {place.longitude.toFixed(3)}
          </span>
          {firstHour && (
            <span className={`flex items-center gap-1 text-[10px] text-gray-500 px-2.5 py-1 rounded-full ${neuSmall}`}>
              <Clock size={9} className="text-primary" />
              {firstHour.openTime} – {firstHour.closeTime}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════
   Page
════════════════════════════════════════ */
const DashboardPlaces = () => {
  const [places, setPlaces]             = useState<Place[]>([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [deletingPlace, setDeletingPlace] = useState<Place | null>(null);
  const [isDeleting, setIsDeleting]     = useState(false);

  const navigate    = useNavigate();
  const { user }    = useAppSelector(state => state.auth);
  const businessId  = user?.businessId ?? '';

  useEffect(() => { fetchPlaces(); }, []);

  const fetchPlaces = async () => {
    setIsLoading(true);
    try {
      setPlaces(await placesAPI.getMyPlaces());
    } catch {
      toast.error('Failed to load places');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: CreatePlaceRequest) => {
    await placesAPI.createPlace(data);
    toast.success('Place created successfully!');
    fetchPlaces();
  };

  const handleUpdate = async (data: CreatePlaceRequest) => {
    if (!editingPlace) return;
    await placesAPI.updatePlace(editingPlace.id, data);
    toast.success('Place updated successfully!');
    setEditingPlace(null);
    fetchPlaces();
  };

  const handleDelete = async () => {
    if (!deletingPlace) return;
    setIsDeleting(true);
    try {
      await placesAPI.deletePlace(deletingPlace.id);
      toast.success('Place deleted');
      setPlaces(prev => prev.filter(p => p.id !== deletingPlace.id));
      setDeletingPlace(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete place');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pt-16">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700 dark:text-white">Places</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {places.length > 0
              ? `${places.length} location${places.length !== 1 ? 's' : ''}`
              : 'Manage your business locations'
            }
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-white text-sm
            bg-gradient-to-r from-primary to-orange-500
            shadow-[4px_4px_10px_#b8bec7,-2px_-2px_6px_#ffffff]
            dark:shadow-[4px_4px_10px_#12151f,-2px_-2px_6px_#2e3248]
            hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus size={16} /> Add Place
        </button>
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader className="animate-spin text-primary" size={36} />
        </div>
      )}

      {/* ── Empty State ── */}
      {!isLoading && places.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${neuCard} p-14 flex flex-col items-center gap-4`}
        >
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${neuInset}`}>
            <MapPin size={32} className="text-primary" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg text-gray-700 dark:text-white">No places yet</h3>
            <p className="text-sm text-gray-400 mt-1">
              Add your first business location to get started
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white
              bg-gradient-to-r from-primary to-orange-500
              shadow-[4px_4px_10px_#b8bec7,-2px_-2px_6px_#ffffff]
              dark:shadow-[4px_4px_10px_#12151f,-2px_-2px_6px_#2e3248]
              hover:opacity-90 transition-all"
          >
            <Plus size={15} /> Add First Place
          </button>
        </motion.div>
      )}

      {/* ── Places Grid ── */}
      {!isLoading && places.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {places.map((place, index) => (
              <PlaceCard
                key={place.id}
                place={place}
                index={index}
                onEdit={p => setEditingPlace(p)}
                onDelete={p => setDeletingPlace(p)}
                onClick={p => navigate(`/dashboard/places/${p.id}`)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── Modals ── */}
      {showAddModal && (
        <AddEditPlaceModal
          businessId={businessId}
          onSubmit={handleCreate}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {editingPlace && (
        <AddEditPlaceModal
          place={editingPlace}
          businessId={businessId}
          onSubmit={handleUpdate}
          onClose={() => setEditingPlace(null)}
        />
      )}

      {deletingPlace && (
        <DeleteConfirmModal
          title={`Delete "${deletingPlace.name}"?`}
          description="This will permanently delete the place and all its data."
          onConfirm={handleDelete}
          onCancel={() => setDeletingPlace(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default DashboardPlaces;