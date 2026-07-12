import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Edit, Trash2, Percent, Calendar, Loader,
  MapPin, Tag, UploadCloud, X, ImageIcon,
} from 'lucide-react';
import { offersAPI, Offer, CreateOfferRequest } from '@/services/offersService';
import { placesAPI, Place } from '@/services/placesService';
import DeleteConfirmModal from '@/components/places/DeleteConfirmModal';
import { toast } from 'sonner';

const neuCard = "rounded-[1.5rem] bg-[#e8ecf3] shadow-[12px_12px_24px_#adb5c0,-12px_-12px_24px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[8px_8px_20px_#0e1020,-8px_-8px_20px_#343750]";
const neuSmall = "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";
const inputClass = `w-full px-4 py-2.5 rounded-full outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 bg-transparent ${neuInset}`;

const today = () => new Date().toISOString().slice(0, 10);

const isImageUrl = (url?: string) =>
  !!url && url !== 'string' && url.trim() !== '' &&
  url.startsWith('http') &&
  !url.includes('unsplash.com/photos/'); // page links, not direct images

const emptyForm = (placeId: string): CreateOfferRequest => ({
  placeId, title: '', description: '', discount: 10, startDate: today(), endDate: '',
});

/* ── Voucher-style offer card ── */
const OfferCard = ({
  offer, index, onEdit, onDelete,
}: {
  offer: Offer; index: number;
  onEdit: () => void; onDelete: () => void;
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const hasImg = isImageUrl(offer.galleryImages) && !imgFailed;
  const start = new Date(offer.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const end = new Date(offer.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const isActive = offer.status === 'Active';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className={`${neuCard} overflow-hidden flex flex-col group`}
    >
      {/* Promo banner */}
      <div className="relative h-36 overflow-hidden">
        {hasImg ? (
          <img
            src={offer.galleryImages}
            alt={offer.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary via-orange-500 to-amber-400 relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />
            <Percent size={64} className="absolute right-4 bottom-2 text-white/15" />
          </div>
        )}

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Discount badge — distinctive coupon look */}
        <div className="absolute top-3 left-3 flex flex-col items-center justify-center
          w-16 h-16 rounded-2xl bg-white dark:bg-[#1e2130]
          shadow-[0_4px_14px_rgba(0,0,0,0.35)] rotate-[-6deg] group-hover:rotate-0 transition-transform">
          <span className="text-xl font-black text-primary leading-none">{offer.discount}%</span>
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">OFF</span>
        </div>

        {/* Status */}
        <span className={`absolute top-3 right-3 text-[10px] px-2.5 py-1 rounded-full font-bold backdrop-blur-sm
          ${isActive
            ? 'bg-green-500/90 text-white'
            : 'bg-gray-500/80 text-white'
          }`}>
          {offer.status}
        </span>

        {/* Title on banner */}
        <div className="absolute bottom-3 left-3 right-3">
          <h4 className="font-black text-white text-base leading-snug drop-shadow-md line-clamp-2">
            {offer.title}
          </h4>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1">
          {offer.description}
        </p>

        {/* Perforated divider (voucher feel) */}
        <div className="relative h-px my-0.5">
          <div className="absolute inset-0 border-t border-dashed border-gray-300/60 dark:border-gray-600/40" />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className={`flex items-center gap-1.5 text-[10px] text-gray-500 px-2.5 py-1.5 rounded-full ${neuSmall}`}>
            <Calendar size={10} className="text-primary shrink-0" />
            <span>{start} → {end}</span>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={onEdit}
              className={`w-8 h-8 flex items-center justify-center rounded-xl ${neuSmall} text-gray-400 hover:text-primary transition-colors`}
            >
              <Edit size={13} />
            </button>
            <button
              onClick={onDelete}
              className={`w-8 h-8 flex items-center justify-center rounded-xl ${neuSmall} text-gray-400 hover:text-red-500 transition-colors`}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DashboardOffers = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [offersLoading, setOffersLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [deletingOffer, setDeletingOffer] = useState<Offer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<CreateOfferRequest>(emptyForm(''));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchOffers = async (placeId: string) => {
    setOffersLoading(true);
    try {
      setOffers(await offersAPI.getByPlace(placeId));
    } catch {
      toast.error('Failed to load offers');
    } finally {
      setOffersLoading(false);
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
    fetchOffers(selectedPlaceId);
  }, [selectedPlaceId]);

  const resetImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const openAdd = () => {
    setForm(emptyForm(selectedPlaceId));
    setEditingOffer(null);
    resetImage();
    setShowForm(true);
  };

  const openEdit = (offer: Offer) => {
    setForm({
      placeId: offer.placeId,
      title: offer.title,
      description: offer.description,
      discount: offer.discount,
      startDate: offer.startDate.slice(0, 10),
      endDate: offer.endDate.slice(0, 10),
    });
    setEditingOffer(offer);
    setImageFile(null);
    setImagePreview(isImageUrl(offer.galleryImages) ? offer.galleryImages : '');
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingOffer(null);
    resetImage();
  };

  const handleImageSelect = (file: File | null) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingOffer) {
        await offersAPI.update(editingOffer.id, form, imageFile ?? undefined);
        toast.success('Offer updated!');
      } else {
        await offersAPI.create(form, imageFile ?? undefined);
        toast.success('Offer created!');
      }
      cancelForm();
      await fetchOffers(selectedPlaceId);
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingOffer) return;
    setIsSubmitting(true);
    try {
      await offersAPI.delete(deletingOffer.id);
      setOffers(prev => prev.filter(o => o.id !== deletingOffer.id));
      setDeletingOffer(null);
      toast.success('Offer deleted!');
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to delete offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pt-16">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700 dark:text-white">Offers</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage discounts and promotions</p>
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
            <Plus size={16} /> Add Offer
          </button>
        )}
      </div>

      {placesLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="animate-spin text-primary" size={28} />
        </div>
      ) : places.length === 0 ? (
        <div className={`${neuCard} p-10 text-center`}>
          <MapPin size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No places found</p>
          <p className="text-sm text-gray-300 dark:text-gray-600 mt-1">Add a place first to create offers</p>
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

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className={`${neuCard} p-5 space-y-4`}
        >
          <h3 className="font-bold text-gray-700 dark:text-white text-sm">
            {editingOffer ? 'Edit Offer' : `New Offer — ${places.find(p => p.id === selectedPlaceId)?.name}`}
          </h3>

          <input required value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Offer Title *" className={inputClass} />

          <div className={`px-4 py-3 rounded-2xl ${neuInset}`}>
            <textarea required rows={2} value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Description *"
              className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 resize-none" />
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">Offer Image</p>
            <input type="file" accept="image/*" id="offer-image-input" className="hidden"
              onChange={e => handleImageSelect(e.target.files?.[0] ?? null)} />

            {imagePreview ? (
              <div className={`relative rounded-2xl overflow-hidden ${neuInset} p-1`}>
                <img src={imagePreview} alt="Preview" className="w-full h-36 object-cover rounded-xl" />
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <label htmlFor="offer-image-input"
                    className="w-8 h-8 flex items-center justify-center rounded-xl cursor-pointer
                      bg-white/85 dark:bg-[#252838]/85 backdrop-blur-sm text-gray-500 hover:text-primary
                      shadow-[2px_2px_5px_rgba(0,0,0,0.15)]">
                    <UploadCloud size={14} />
                  </label>
                  <button type="button" onClick={resetImage}
                    className="w-8 h-8 flex items-center justify-center rounded-xl
                      bg-white/85 dark:bg-[#252838]/85 backdrop-blur-sm text-gray-500 hover:text-red-500
                      shadow-[2px_2px_5px_rgba(0,0,0,0.15)]">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <label htmlFor="offer-image-input"
                className={`flex flex-col items-center justify-center gap-2 w-full h-28
                  rounded-2xl cursor-pointer border-2 border-dashed
                  border-gray-300 dark:border-gray-600 hover:border-primary ${neuInset}`}>
                <ImageIcon size={22} className="text-gray-400" />
                <span className="text-xs text-gray-400 font-medium">Upload offer image</span>
              </label>
            )}
          </div>

          <div className={`flex items-center gap-3 px-4 py-2.5 rounded-full ${neuInset}`}>
            <Percent size={14} className="text-primary shrink-0" />
            <input required type="number" min="0" max="100" step="0.01"
              value={form.discount}
              onChange={e => setForm(p => ({ ...p, discount: Number(e.target.value) }))}
              placeholder="Discount % *"
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-gray-400 mb-1 px-1">Start Date</p>
              <input required type="date" value={form.startDate}
                onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                className={inputClass} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1 px-1">End Date</p>
              <input required type="date" value={form.endDate}
                onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={cancelForm}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold text-gray-500 ${neuSmall}`}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="px-5 py-2.5 rounded-full text-sm font-bold text-white
                bg-gradient-to-r from-primary to-orange-500
                shadow-[3px_3px_8px_#b8bec7] dark:shadow-[3px_3px_8px_#12151f]
                hover:opacity-90 disabled:opacity-50 transition-all">
              {isSubmitting ? 'Saving...' : editingOffer ? 'Update' : 'Create'}
            </button>
          </div>
        </motion.form>
      )}

      {offersLoading ? (
        <div className="flex justify-center py-10">
          <Loader className="animate-spin text-primary" size={32} />
        </div>
      ) : offers.length === 0 && selectedPlaceId ? (
        <div className={`${neuCard} p-12 text-center`}>
          <Tag size={36} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No offers yet</p>
          <p className="text-sm text-gray-300 dark:text-gray-600 mt-1">Create your first offer for this place</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {offers.map((offer, i) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              index={i}
              onEdit={() => openEdit(offer)}
              onDelete={() => setDeletingOffer(offer)}
            />
          ))}
        </div>
      )}

      {deletingOffer && (
        <DeleteConfirmModal
          title={`Delete "${deletingOffer.title}"?`}
          description="This will permanently remove the offer."
          onConfirm={handleDelete}
          onCancel={() => setDeletingOffer(null)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default DashboardOffers;
