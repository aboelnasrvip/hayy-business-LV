import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, Edit, Trash2, Clock, Star, Loader } from 'lucide-react';
import { placesAPI, Place, CreatePlaceRequest } from '@/services/placesService';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';
import AddEditPlaceModal from '@/components/places/AddEditPlaceModal';
import DeleteConfirmModal from '@/components/places/DeleteConfirmModal';
import PlaceDetailPanel from '@/components/places/PlaceDetailPanel';

const neuCard =
  "rounded-[1.5rem] bg-[#e8ecf3] shadow-[12px_12px_24px_#adb5c0,-12px_-12px_24px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[8px_8px_20px_#0e1020,-8px_-8px_20px_#343750]";
const neuSmall =
  "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset =
  "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";

const DashboardPlaces = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [deletingPlace, setDeletingPlace] = useState<Place | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAppSelector(state => state.auth);
  const businessId = user?.businessId ?? '';

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
    fetchPlaces();
    if (selectedPlace?.id === editingPlace.id) {
      setSelectedPlace({ ...selectedPlace, ...data });
    }
  };

  const handleDelete = async () => {
    if (!deletingPlace) return;
    setIsDeleting(true);
    try {
      await placesAPI.deletePlace(deletingPlace.id);
      toast.success('Place deleted');
      setPlaces(p => p.filter(place => place.id !== deletingPlace.id));
      if (selectedPlace?.id === deletingPlace.id) setSelectedPlace(null);
      setDeletingPlace(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete place');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pt-16">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700 dark:text-white">Places</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your business locations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-white text-sm
            bg-gradient-to-r from-primary to-orange-500
            shadow-[4px_4px_10px_#b8bec7,-2px_-2px_6px_#ffffff,inset_0_1px_0_rgba(255,255,255,0.15)]
            dark:shadow-[4px_4px_10px_#12151f,-2px_-2px_6px_#2e3248]
            hover:opacity-90 active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] transition-all"
        >
          <Plus size={16} /> Add Place
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader className="animate-spin text-primary" size={36} />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && places.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`${neuCard} p-14 flex flex-col items-center gap-4`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${neuInset}`}>
            <MapPin size={28} className="text-primary" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-gray-700 dark:text-white">No places yet</h3>
            <p className="text-sm text-gray-400 mt-1">Add your first business location to get started</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white
              bg-gradient-to-r from-primary to-orange-500
              shadow-[4px_4px_10px_#b8bec7,-2px_-2px_6px_#ffffff]
              dark:shadow-[4px_4px_10px_#12151f,-2px_-2px_6px_#2e3248]
              hover:opacity-90 transition-all"
          >
            <Plus size={15} /> Add First Place
          </button>
        </motion.div>
      )}

      {/* Places Grid */}
      {!isLoading && places.length > 0 && (
        <div className="grid gap-4">
          <AnimatePresence>
            {places.map((place, index) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedPlace(place)}
                className={`${neuCard} p-6 relative overflow-hidden cursor-pointer`}
              >
                <div className="absolute top-0 left-6 right-6 h-[3px] rounded-full bg-gradient-to-r from-primary to-orange-400 opacity-60" />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${neuInset}`}>
                      <MapPin size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-700 dark:text-white">{place.name}</h3>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold text-primary ${neuInset}`}>
                          {place.categoryName}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{place.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className={`flex items-center gap-1.5 text-xs text-gray-500 px-3 py-1.5 rounded-full ${neuSmall}`}>
                          <MapPin size={11} className="text-primary" />
                          {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                        </span>
                        <span className={`flex items-center gap-1.5 text-xs text-gray-500 px-3 py-1.5 rounded-full ${neuSmall}`}>
                          <Star size={11} className="text-orange-400" />
                          {place.rating}
                        </span>
                        {place.openingHours?.length > 0 && (
                          <span className={`flex items-center gap-1.5 text-xs text-gray-500 px-3 py-1.5 rounded-full ${neuSmall}`}>
                            <Clock size={11} className="text-primary" />
                            {place.openingHours[0].openTime} – {place.openingHours[0].closeTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setEditingPlace(place)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-primary transition-colors ${neuSmall}`}
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => setDeletingPlace(place)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 transition-colors ${neuSmall}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
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

      {/* Place Detail Side Panel */}
      <AnimatePresence>
        {selectedPlace && (
          <PlaceDetailPanel
            place={selectedPlace}
            onClose={() => setSelectedPlace(null)}
            onEdit={() => { setEditingPlace(selectedPlace); setSelectedPlace(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPlaces;