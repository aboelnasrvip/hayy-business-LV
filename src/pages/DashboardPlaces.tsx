import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, MapPin, Edit3, Trash2, Clock, Star, Loader,
  ChevronRight, Tag,
} from 'lucide-react';
import { placesAPI, Place, CreatePlaceRequest } from '@/services/placesService';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';
import AddEditPlaceModal from '@/components/places/AddEditPlaceModal';
import DeleteConfirmModal from '@/components/places/DeleteConfirmModal';
import { useNavigate } from 'react-router-dom';

const neuCard =
  "rounded-[1.75rem] bg-[#e8ecf3] shadow-[12px_12px_24px_#adb5c0,-12px_-12px_24px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[8px_8px_20px_#0e1020,-8px_-8px_20px_#343750]";
const neuSmall =
  "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset =
  "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";

const isValidUrl = (url?: string) =>
  !!url && url !== 'string' && url.trim() !== '' && url.startsWith('http');

const PALETTE = [
  ['from-rose-400 to-pink-600',    'bg-rose-50   dark:bg-rose-900/30   text-rose-500'],
  ['from-orange-400 to-amber-500', 'bg-orange-50 dark:bg-orange-900/30 text-orange-500'],
  ['from-emerald-400 to-teal-500', 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600'],
  ['from-violet-400 to-purple-600','bg-violet-50 dark:bg-violet-900/30 text-violet-500'],
  ['from-sky-400 to-indigo-500',   'bg-sky-50    dark:bg-sky-900/30    text-sky-500'],
  ['from-fuchsia-400 to-pink-500', 'bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-500'],
  ['from-lime-400 to-green-500',   'bg-lime-50   dark:bg-lime-900/30   text-lime-600'],
  ['from-cyan-400 to-blue-500',    'bg-cyan-50   dark:bg-cyan-900/30   text-cyan-500'],
];
const getPalette = (name: string) =>
  PALETTE[(name.charCodeAt(0) ?? 0) % PALETTE.length];

/* ─── Place Card ─── */
interface PlaceCardProps {
  place: Place;
  index: number;
  onEdit: (p: Place) => void;
  onDelete: (p: Place) => void;
  onClick: (p: Place) => void;
}

const PlaceCard = ({ place, index, onEdit, onDelete, onClick }: PlaceCardProps) => {
  const initial  = place.name[0]?.toUpperCase() ?? '?';
  const [gradient, catCls] = getPalette(place.name);
  const hasCover = isValidUrl(place.coverImage);
  const todayHours = place.openingHours?.[0];
  const hasRating  = place.rating > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ delay: index * 0.055, type: 'spring', stiffness: 260, damping: 22 }}
      whileHover={{ y: -5, transition: { duration: 0.18 } }}
      onClick={() => onClick(place)}
      className={`${neuCard} overflow-hidden cursor-pointer group flex flex-col`}
    >
      {/* ══ COVER ══ */}
      <div className="relative h-36 shrink-0 overflow-hidden rounded-t-[1.75rem]">
        {hasCover ? (
          <>
            <img src={place.coverImage} alt={place.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} relative overflow-hidden`}>
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
            <div className="absolute bottom-0 left-1/2 w-32 h-32 rounded-full bg-black/10 translate-x-2" />
            <span className="absolute -bottom-3 right-4 text-[80px] font-black text-white/15 select-none leading-none">
              {initial}
            </span>
          </div>
        )}

        
        {/* Action buttons — top-right, appear on hover */}
        <div
          className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(place)}
            className="w-8 h-8 flex items-center justify-center rounded-xl
              bg-white/85 dark:bg-[#1e2130]/85 backdrop-blur-sm
              text-gray-500 hover:text-primary transition-colors
              shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
          >
            <Edit3 size={13} />
          </button>
          <button
            onClick={() => onDelete(place)}
            className="w-8 h-8 flex items-center justify-center rounded-xl
              bg-white/85 dark:bg-[#1e2130]/85 backdrop-blur-sm
              text-gray-500 hover:text-red-500 transition-colors
              shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* ══ AVATAR ══ overlaps cover */}
      <div className="px-5 flex items-end -mt-6 mb-2">
        <div className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center
          text-lg font-black border-[3px] border-[#e8ecf3] dark:border-[#2b2e42]
          shrink-0 ${neuInset} text-primary`}
        >
          {hasCover ? initial : <span className={catCls.split(' ').slice(-1)[0]}>{initial}</span>}
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="px-5 pb-4 flex flex-col gap-2.5 flex-1">

        {/* Name */}
        <div>
          <h3 className="font-black text-[15px] text-gray-800 dark:text-white leading-snug">
            {place.name}
          </h3>

          {/* Category pill */}
          {place.categoryName && (
            <span className={`inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${catCls}`}>
              <Tag size={8} /> {place.categoryName}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1">
          {place.description || 'No description provided.'}
        </p>

        {/* ── Footer row ── */}
        <div className="pt-2.5 mt-auto border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 min-w-0">
            {/* Coordinates */}
            <span className={`inline-flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full ${neuSmall} shrink-0`}>
              <MapPin size={9} className="text-primary shrink-0" />
              <span className="truncate max-w-[90px]">
                {place.latitude.toFixed(2)}, {place.longitude.toFixed(2)}
              </span>
            </span>

            {/* Hours */}
            {todayHours && (
              <span className={`inline-flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full ${neuSmall}`}>
                <Clock size={9} className="text-primary shrink-0" />
                {todayHours.openTime}–{todayHours.closeTime}
              </span>
            )}
          </div>

          {/* View arrow */}
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${neuSmall}
            text-gray-400 group-hover:text-primary transition-colors`}>
            <ChevronRight size={13} />
          </div>
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

  const handleCreate = async (data: CreatePlaceRequest, imageFile?: File) => {
    await placesAPI.createPlace(data, imageFile);
    toast.success('Place created successfully!');
    fetchPlaces();
  };

  const handleUpdate = async (data: CreatePlaceRequest, imageFile?: File) => {
    if (!editingPlace) return;
    await placesAPI.updatePlace(editingPlace.id, data, imageFile);
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
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to delete place');
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