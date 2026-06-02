import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Percent, Calendar, Loader, MapPin, Tag } from 'lucide-react';
import { offersAPI, Offer, CreateOfferRequest } from '@/services/offersService';
import { placesAPI, Place } from '@/services/placesService';
import DeleteConfirmModal from '@/components/places/DeleteConfirmModal';
import { toast } from 'sonner';

const neuCard = "rounded-[1.5rem] bg-[#e8ecf3] shadow-[12px_12px_24px_#adb5c0,-12px_-12px_24px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[8px_8px_20px_#0e1020,-8px_-8px_20px_#343750]";
const neuSmall = "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";
const inputClass = `w-full px-4 py-2.5 rounded-full outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 bg-transparent ${neuInset}`;

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = (placeId: string): CreateOfferRequest => ({
  placeId, title: '', description: '', discount: 10, startDate: today(), endDate: '',
});

const DashboardOffers = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [offersLoading, setOffersLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [deletingOffer, setDeletingOffer] = useState<Offer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<CreateOfferRequest>(emptyForm(''));

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
    setOffersLoading(true);
    offersAPI.getByPlace(selectedPlaceId)
      .then(setOffers)
      .catch(() => toast.error('Failed to load offers'))
      .finally(() => setOffersLoading(false));
  }, [selectedPlaceId]);

  const openAdd = () => {
    setForm(emptyForm(selectedPlaceId));
    setEditingOffer(null);
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
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingOffer) {
        const updated = await offersAPI.update(editingOffer.id, form);
        setOffers(prev => prev.map(o => o.id === editingOffer.id ? updated : o));
        toast.success('Offer updated!');
      } else {
        const created = await offersAPI.create(form);
        setOffers(prev => [created, ...prev]);
        toast.success('Offer created!');
      }
      setShowForm(false);
      setEditingOffer(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Operation failed');
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
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pt-16">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700 dark:text-white">Offers</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage discounts and promotions</p>
        </div>
        {selectedPlaceId && (
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

      {/* Place Selector */}
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
              onClick={() => setSelectedPlaceId(place.id)}
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

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className={`${neuCard} p-5 space-y-4`}>
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
            <button type="button"
              onClick={() => { setShowForm(false); setEditingOffer(null); }}
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
        </form>
      )}

      {/* Offers Grid */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`${neuCard} p-5`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-700 dark:text-white truncate mb-1">{offer.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold text-white bg-gradient-to-r from-primary to-orange-500">
                      {offer.discount}% OFF
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold
                      ${offer.status === 'Active'
                        ? 'text-green-600 bg-green-100 dark:bg-green-900/30'
                        : 'text-gray-400 bg-gray-100 dark:bg-gray-700/30'
                      }`}>
                      {offer.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => openEdit(offer)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg ${neuSmall} text-gray-400 hover:text-primary transition-colors`}>
                    <Edit size={12} />
                  </button>
                  <button onClick={() => setDeletingOffer(offer)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg ${neuSmall} text-gray-400 hover:text-red-500 transition-colors`}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">{offer.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className={`flex items-center gap-1 text-[10px] text-gray-500 px-2 py-1 rounded-full ${neuSmall}`}>
                  <Calendar size={9} className="text-primary" />
                  {new Date(offer.startDate).toLocaleDateString()}
                </span>
                <span className="text-[10px] text-gray-400">→</span>
                <span className={`flex items-center gap-1 text-[10px] text-gray-500 px-2 py-1 rounded-full ${neuSmall}`}>
                  <Calendar size={9} className="text-orange-400" />
                  {new Date(offer.endDate).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
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