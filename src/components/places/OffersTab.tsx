import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Percent, Calendar, Loader } from 'lucide-react';
import { offersAPI, Offer, CreateOfferRequest } from '@/services/offersService';
import DeleteConfirmModal from './DeleteConfirmModal';
import { toast } from 'sonner';

const neuSmall = "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";
const neuCard = "bg-[#e0e5ec] shadow-[6px_6px_14px_#b8bec7,-6px_-6px_14px_#ffffff] dark:bg-[#252838] dark:shadow-[5px_5px_12px_#12151f,-5px_-5px_12px_#2e3248]";

const inputClass = `w-full px-4 py-2.5 rounded-full outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 bg-transparent ${neuInset}`;

interface Props { placeId: string; }

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = (placeId: string): CreateOfferRequest => ({
  placeId,
  title: '',
  description: '',
  discount: 10,
  startDate: today(),
  endDate: '',
});

const OffersTab = ({ placeId }: Props) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [deletingOffer, setDeletingOffer] = useState<Offer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<CreateOfferRequest>(emptyForm(placeId));

  useEffect(() => {
    offersAPI.getByPlace(placeId)
      .then(setOffers)
      .catch(() => toast.error('Failed to load offers'))
      .finally(() => setIsLoading(false));
  }, [placeId]);

  const openAdd = () => {
    setForm(emptyForm(placeId));
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">{offers.length} offer(s)</p>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white
            bg-gradient-to-r from-primary to-orange-500
            shadow-[2px_2px_6px_#b8bec7,-1px_-1px_3px_#ffffff] dark:shadow-[2px_2px_6px_#12151f]
            hover:opacity-90 transition-all"
        >
          <Plus size={12} /> Add Offer
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className={`${neuCard} rounded-2xl p-4 space-y-3`}>
          <input
            required value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Offer Title *" className={inputClass}
          />
          <div className={`px-4 py-2.5 rounded-2xl ${neuInset}`}>
            <textarea
              required rows={2} value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Description *"
              className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 resize-none"
            />
          </div>
          <div className={`flex items-center gap-3 px-4 py-2.5 rounded-full ${neuInset}`}>
            <Percent size={14} className="text-primary shrink-0" />
            <input
              required type="number" min="0" max="100" step="0.01"
              value={form.discount}
              onChange={e => setForm(p => ({ ...p, discount: Number(e.target.value) }))}
              placeholder="Discount % *"
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-gray-400 mb-1 px-1">Start Date</p>
              <input
                required type="date" value={form.startDate}
                onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1 px-1">End Date</p>
              <input
                required type="date" value={form.endDate}
                onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingOffer(null); }}
              className={`px-4 py-2 rounded-full text-xs font-semibold text-gray-500 ${neuSmall}`}
            >
              Cancel
            </button>
            <button
              type="submit" disabled={isSubmitting}
              className="px-4 py-2 rounded-full text-xs font-bold text-white
                bg-gradient-to-r from-primary to-orange-500
                shadow-[2px_2px_6px_#b8bec7] dark:shadow-[2px_2px_6px_#12151f]
                hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Saving...' : editingOffer ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="animate-spin text-primary" size={24} />
        </div>
      ) : offers.length === 0 ? (
        <div className={`${neuCard} rounded-2xl p-6 text-center`}>
          <p className="text-sm text-gray-400">No offers yet. Create your first offer!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map(offer => (
            <div key={offer.id} className={`${neuCard} rounded-2xl p-4`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-sm text-gray-700 dark:text-white truncate">
                      {offer.title}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white bg-gradient-to-r from-primary to-orange-500 shrink-0">
                      {offer.discount}% OFF
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">{offer.description}</p>
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
                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold
                      ${offer.status === 'Active'
                        ? 'text-green-600 bg-green-100 dark:bg-green-900/30'
                        : 'text-gray-400 bg-gray-100 dark:bg-gray-700/30'
                      }`}>
                      {offer.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => openEdit(offer)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg ${neuSmall} text-gray-400 hover:text-primary transition-colors`}
                  >
                    <Edit size={12} />
                  </button>
                  <button
                    onClick={() => setDeletingOffer(offer)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg ${neuSmall} text-gray-400 hover:text-red-500 transition-colors`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
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

export default OffersTab;