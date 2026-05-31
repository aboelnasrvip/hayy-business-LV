import { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader, X } from 'lucide-react';
import LocationPicker from '@/components/dashboard/LocationPicker';
import CategoryPickerModal from './CategoryPickerModal';
import { Place, CreatePlaceRequest } from '@/services/placesService';
import { toast } from 'sonner';

const neu = "bg-[#e0e5ec] shadow-[4px_4px_10px_#b8bec7,-4px_-4px_10px_#ffffff] dark:bg-[#252838] dark:shadow-[4px_4px_10px_#12151f,-4px_-4px_10px_#2e3248]";
const neuInset = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";

interface Props {
  place?: Place;
  businessId: string;
  onSubmit: (data: CreatePlaceRequest) => Promise<void>;
  onClose: () => void;
}

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const AddEditPlaceModal = ({ place, businessId, onSubmit, onClose }: Props) => {
  const isEdit = !!place;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [locating, setLocating] = useState(false);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  const [formData, setFormData] = useState({
    name: place?.name ?? '',
    description: place?.description ?? '',
    latitude: place?.latitude ?? 30.0444,
    longitude: place?.longitude ?? 31.2357,
    categoryId: '',
    categoryName: place?.categoryName ?? '',
    openingHours: place?.openingHours ?? [1, 2, 3, 4, 5].map(d => ({
      dayOfWeek: d, openTime: '09:00', closeTime: '18:00',
    })),
  });

  const handleUseLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setFormData(p => ({ ...p, latitude: coords.latitude, longitude: coords.longitude }));
        setFlyTo([coords.latitude, coords.longitude]);
        setLocating(false);
        toast.success('Location detected!');
      },
      () => { toast.error('Unable to retrieve location'); setLocating(false); }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId && !isEdit) {
      toast.error('Please select a category');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: formData.name,
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
        categoryId: formData.categoryId || null,
        businessId,
        tagIds: [],
        openingHours: formData.openingHours,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className={`${neu} rounded-[2rem] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-700 dark:text-white text-lg">
              {isEdit ? 'Edit Place' : 'Add New Place'}
            </h3>
            <button onClick={onClose} className={`w-8 h-8 flex items-center justify-center rounded-xl ${neu}`}>
              <X size={15} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div className={`flex items-center gap-3 px-5 py-1 rounded-full ${neuInset}`}>
              <MapPin size={15} className="text-gray-400 shrink-0" />
              <input
                required value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="Place Name *"
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 py-3"
              />
            </div>

            {/* Description */}
            <div className={`px-5 py-3 rounded-2xl ${neuInset}`}>
              <textarea
                required rows={3} value={formData.description}
                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                placeholder="Description *"
                className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 resize-none"
              />
            </div>

            {/* Category Picker Button */}
            <button
              type="button"
              onClick={() => setShowCategoryPicker(true)}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-full text-sm transition-all ${neuInset}`}
            >
              <span className={formData.categoryName ? 'text-gray-700 dark:text-white font-semibold' : 'text-gray-400'}>
                {formData.categoryName || 'Select Category *'}
              </span>
              <span className="text-primary text-xs font-bold">CHANGE →</span>
            </button>

            {/* Location Button */}
            <button
              type="button" onClick={handleUseLocation} disabled={locating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white
                bg-gradient-to-r from-primary to-orange-500
                shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff] dark:shadow-[3px_3px_8px_#12151f]
                hover:opacity-90 disabled:opacity-60 transition-all"
            >
              {locating ? <Loader size={14} className="animate-spin" /> : <Navigation size={14} />}
              {locating ? 'Detecting...' : 'Use Current Location'}
            </button>

            {/* Map */}
            <div className={`rounded-2xl overflow-hidden ${neuInset} p-2`}>
              <LocationPicker
                onLocationSelect={(lat, lng) => setFormData(p => ({ ...p, latitude: lat, longitude: lng }))}
                defaultLat={formData.latitude} defaultLng={formData.longitude} flyTo={flyTo}
              />
            </div>

            {/* Coords display */}
            <div className="grid grid-cols-2 gap-3">
              {[['Latitude', formData.latitude], ['Longitude', formData.longitude]].map(([label, val]) => (
                <div key={label as string} className={`px-4 py-2.5 rounded-xl ${neuInset}`}>
                  <p className="text-[10px] text-gray-400 mb-0.5">{label as string}</p>
                  <p className="text-sm font-mono font-semibold text-gray-700 dark:text-white">
                    {(val as number).toFixed(6)}
                  </p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button" onClick={onClose}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold text-gray-500 ${neu} transition-all`}
              >
                Cancel
              </button>
              <button
                type="submit" disabled={isSubmitting}
                className="px-5 py-2.5 rounded-full text-sm font-bold text-white
                  bg-gradient-to-r from-primary to-orange-500
                  shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff] dark:shadow-[3px_3px_8px_#12151f]
                  hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Place'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showCategoryPicker && (
        <CategoryPickerModal
          selectedId={formData.categoryId}
          onSelect={(id, name) => setFormData(p => ({ ...p, categoryId: id, categoryName: name }))}
          onClose={() => setShowCategoryPicker(false)}
        />
      )}
    </>
  );
};

export default AddEditPlaceModal;