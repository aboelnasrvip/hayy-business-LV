import { useState } from 'react';
import { MapPin, Navigation, Loader, X, Clock, UploadCloud, Link2, Trash2 } from 'lucide-react';
import LocationPicker from '@/components/dashboard/LocationPicker';
import CategoryPickerModal from './CategoryPickerModal';
import { Place, CreatePlaceRequest, OpeningHour } from '@/services/placesService';
import { toast } from 'sonner';

const neu = "bg-[#e0e5ec] shadow-[4px_4px_10px_#b8bec7,-4px_-4px_10px_#ffffff] dark:bg-[#252838] dark:shadow-[4px_4px_10px_#12151f,-4px_-4px_10px_#2e3248]";
const neuInset = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";
const neuSmall = "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";

interface Props {
  place?: Place;
  businessId: string;
  onSubmit: (data: CreatePlaceRequest, imageFile?: File) => Promise<void>;
  onClose: () => void;
}

const ALL_DAYS = [
  { day: 1, label: 'Mon' }, { day: 2, label: 'Tue' },
  { day: 3, label: 'Wed' }, { day: 4, label: 'Thu' },
  { day: 5, label: 'Fri' }, { day: 6, label: 'Sat' },
  { day: 7, label: 'Sun' },
];

type DaySchedule = { enabled: boolean; openTime: string; closeTime: string };
type HoursMap = Record<number, DaySchedule>;

const initHours = (existingHours?: OpeningHour[]): HoursMap => {
  const map: HoursMap = {};
  ALL_DAYS.forEach(({ day }) => {
    const existing = existingHours?.find(h => h.dayOfWeek === day);
    map[day] = {
      enabled: !!existing || (day >= 1 && day <= 5),
      openTime: existing?.openTime?.slice(0, 5) ?? '09:00',
      closeTime: existing?.closeTime?.slice(0, 5) ?? '18:00',
    };
  });
  return map;
};

const AddEditPlaceModal = ({ place, businessId, onSubmit, onClose }: Props) => {
  const isEdit = !!place;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [locating, setLocating] = useState(false);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [hoursMap, setHoursMap] = useState<HoursMap>(initHours(place?.openingHours));
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>(place?.coverImage ?? '');
  const [urlMode, setUrlMode] = useState(false);

  const [formData, setFormData] = useState({
    name: place?.name ?? '',
    description: place?.description ?? '',
    latitude: place?.latitude ?? 30.0444,
    longitude: place?.longitude ?? 31.2357,
    coverImage: place?.coverImage ?? '',
    categoryId: '',
    categoryName: place?.categoryName ?? '',
  });

  const handleCoverFile = (file: File | null) => {
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setFormData(p => ({ ...p, coverImage: '' }));
  };

  const handleCoverUrl = (url: string) => {
    setCoverFile(null);
    setFormData(p => ({ ...p, coverImage: url }));
    setCoverPreview(url);
  };

  const clearCover = () => {
    setCoverFile(null);
    setFormData(p => ({ ...p, coverImage: '' }));
    setCoverPreview('');
  };

  const toggleDay = (day: number) =>
    setHoursMap(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));

  const updateHour = (day: number, field: 'openTime' | 'closeTime', value: string) =>
    setHoursMap(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));

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
    const openingHours: OpeningHour[] = ALL_DAYS
      .filter(({ day }) => hoursMap[day].enabled)
      .map(({ day }) => ({
        dayOfWeek: day,
        openTime: hoursMap[day].openTime,
        closeTime: hoursMap[day].closeTime,
      }));

    setIsSubmitting(true);
    try {
      await onSubmit(
        {
          name: formData.name,
          description: formData.description,
          latitude: formData.latitude,
          longitude: formData.longitude,
          coverImage: coverFile ? undefined : (formData.coverImage || undefined),
          categoryId: formData.categoryId || null,
          businessId,
          tagIds: [],
          openingHours,
        },
        coverFile ?? undefined,
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className={`${neu} rounded-[2rem] p-6 w-full max-w-5xl max-h-[92vh] overflow-y-auto`}>

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-700 dark:text-white text-lg">
              {isEdit ? 'Edit Place' : 'Add New Place'}
            </h3>
            <button onClick={onClose}
              className={`w-8 h-8 flex items-center justify-center rounded-xl ${neu}`}>
              <X size={15} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── Row 1: Cover (left) + Basic info (right) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 items-start">

              {/* Cover Image — left column */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">
                  Cover Image
                </p>
                <input
                  type="file"
                  accept="image/*"
                  id="cover-file-input"
                  className="hidden"
                  onChange={e => handleCoverFile(e.target.files?.[0] ?? null)}
                />

                {coverPreview ? (
                  <div className={`relative rounded-2xl overflow-hidden ${neuInset} p-1`}>
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-44 lg:h-52 object-cover rounded-xl"
                    />
                    <div className="absolute top-2 right-2 flex gap-1.5">
                      <label
                        htmlFor="cover-file-input"
                        className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer
                          bg-white/80 dark:bg-[#252838]/80 backdrop-blur-sm
                          text-gray-500 hover:text-primary transition-colors
                          shadow-[2px_2px_5px_rgba(0,0,0,0.15)]"
                      >
                        <UploadCloud size={13} />
                      </label>
                      <button
                        type="button"
                        onClick={clearCover}
                        className="w-7 h-7 flex items-center justify-center rounded-lg
                          bg-white/80 dark:bg-[#252838]/80 backdrop-blur-sm
                          text-gray-500 hover:text-red-500 transition-colors
                          shadow-[2px_2px_5px_rgba(0,0,0,0.15)]"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="cover-file-input"
                    className={`flex flex-col items-center justify-center gap-2 w-full h-44 lg:h-52
                      rounded-2xl cursor-pointer transition-all border-2 border-dashed
                      border-gray-300 dark:border-gray-600 hover:border-primary ${neuInset}`}
                  >
                    <UploadCloud size={22} className="text-gray-400" />
                    <span className="text-xs text-gray-400 font-medium text-center px-2">
                      Upload cover image
                    </span>
                    <span className="text-[10px] text-gray-300 dark:text-gray-600">PNG, JPG, WEBP</span>
                  </label>
                )}

                <button
                  type="button"
                  onClick={() => setUrlMode(p => !p)}
                  className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-primary transition-colors px-1"
                >
                  <Link2 size={11} />
                  {urlMode ? 'Hide URL' : 'Or use image URL'}
                </button>
                {urlMode && (
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${neuInset}`}>
                    <Link2 size={12} className="text-gray-400 shrink-0" />
                    <input
                      value={formData.coverImage.startsWith('data:') ? '' : formData.coverImage}
                      onChange={e => handleCoverUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 bg-transparent outline-none text-xs text-gray-700 dark:text-white placeholder-gray-400"
                    />
                  </div>
                )}
              </div>

              {/* Basic fields — right column */}
              <div className="space-y-3">
                <div className={`flex items-center gap-3 px-5 py-1 rounded-full ${neuInset}`}>
                  <MapPin size={15} className="text-gray-400 shrink-0" />
                  <input
                    required value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Place Name *"
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 py-3"
                  />
                </div>

                <div className={`px-5 py-3 rounded-2xl ${neuInset}`}>
                  <textarea
                    required rows={3} value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Description *"
                    className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 resize-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowCategoryPicker(true)}
                  className={`w-full flex items-center justify-between px-5 py-3 rounded-full text-sm transition-all ${neuInset}`}
                >
                  <span className={formData.categoryName ? 'text-gray-700 dark:text-white font-semibold' : 'text-gray-400'}>
                    {formData.categoryName || (isEdit ? `Current: ${place?.categoryName}` : 'Select Category *')}
                  </span>
                  <span className="text-primary text-xs font-bold">CHANGE →</span>
                </button>
              </div>
            </div>

            {/* ── Row 2: Opening Hours (horizontal grid) ── */}
            <div className={`${neuInset} rounded-2xl p-4`}>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock size={13} className="text-primary" /> Opening Hours
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                {ALL_DAYS.map(({ day, label }) => {
                  const schedule = hoursMap[day];
                  return (
                    <div key={day} className="flex items-center gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`w-9 text-[10px] font-bold py-1.5 rounded-full transition-all shrink-0
                          ${schedule.enabled
                            ? 'bg-gradient-to-r from-primary to-orange-500 text-white shadow-[2px_2px_5px_rgba(0,0,0,0.15)]'
                            : `text-gray-400 ${neuSmall}`
                          }`}
                      >
                        {label}
                      </button>
                      {schedule.enabled ? (
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <input
                            type="time"
                            value={schedule.openTime}
                            onChange={e => updateHour(day, 'openTime', e.target.value)}
                            className={`flex-1 min-w-0 px-2 py-1.5 rounded-xl text-[11px] text-gray-700 dark:text-white bg-transparent outline-none ${neuSmall}`}
                          />
                          <span className="text-gray-400 text-[10px] shrink-0">–</span>
                          <input
                            type="time"
                            value={schedule.closeTime}
                            onChange={e => updateHour(day, 'closeTime', e.target.value)}
                            className={`flex-1 min-w-0 px-2 py-1.5 rounded-xl text-[11px] text-gray-700 dark:text-white bg-transparent outline-none ${neuSmall}`}
                          />
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">Closed</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Row 3: Map + Location (horizontal) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-4 items-start">
              <div className={`rounded-2xl overflow-hidden ${neuInset} p-2`}>
                <LocationPicker
                  onLocationSelect={(lat, lng) => setFormData(p => ({ ...p, latitude: lat, longitude: lng }))}
                  defaultLat={formData.latitude} defaultLng={formData.longitude} flyTo={flyTo}
                />
              </div>

              <div className="space-y-3">
                <button
                  type="button" onClick={handleUseLocation} disabled={locating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white
                    bg-gradient-to-r from-primary to-orange-500
                    shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff] dark:shadow-[3px_3px_8px_#12151f]
                    hover:opacity-90 disabled:opacity-60 transition-all"
                >
                  {locating ? <Loader size={14} className="animate-spin" /> : <Navigation size={14} />}
                  {locating ? 'Detecting...' : 'Use My Location'}
                </button>
                <div className={`px-4 py-2.5 rounded-xl ${neuInset}`}>
                  <p className="text-[10px] text-gray-400 mb-0.5">Latitude</p>
                  <p className="text-xs font-mono font-semibold text-gray-700 dark:text-white">
                    {formData.latitude.toFixed(6)}
                  </p>
                </div>
                <div className={`px-4 py-2.5 rounded-xl ${neuInset}`}>
                  <p className="text-[10px] text-gray-400 mb-0.5">Longitude</p>
                  <p className="text-xs font-mono font-semibold text-gray-700 dark:text-white">
                    {formData.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-1 border-t border-gray-200/40 dark:border-gray-700/30">
              <button
                type="button" onClick={onClose}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold text-gray-500 ${neu} transition-all`}
              >
                Cancel
              </button>
              <button
                type="submit" disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-white
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