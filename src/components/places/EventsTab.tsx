import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Users, DollarSign, Loader } from 'lucide-react';
import { eventsAPI, Event, CreateEventRequest } from '@/services/eventsService';
import DeleteConfirmModal from './DeleteConfirmModal';
import { toast } from 'sonner';

const neuSmall = "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";
const neuCard = "bg-[#e0e5ec] shadow-[6px_6px_14px_#b8bec7,-6px_-6px_14px_#ffffff] dark:bg-[#252838] dark:shadow-[5px_5px_12px_#12151f,-5px_-5px_12px_#2e3248]";

const inputClass = `w-full px-4 py-2.5 rounded-full outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 bg-transparent ${neuInset}`;

interface Props { placeId: string; }

const emptyForm = (placeId: string): CreateEventRequest => ({
  placeId,
  title: '',
  description: '',
  datetime: '',
  capacity: 50,
  price: 0,
  isWaitlistEnabled: false,
  waitlistLimit: 0,
});

const EventsTab = ({ placeId }: Props) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<CreateEventRequest & { rowVersion: string }>(
    { ...emptyForm(placeId), rowVersion: '' }
  );

  useEffect(() => {
    eventsAPI.getByPlace(placeId)
      .then(setEvents)
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setIsLoading(false));
  }, [placeId]);

  const openAdd = () => {
    setForm({ ...emptyForm(placeId), rowVersion: '' });
    setEditingEvent(null);
    setShowForm(true);
  };

  const openEdit = (event: Event) => {
    setForm({
      placeId: event.placeId,
      title: event.title,
      description: event.description,
      datetime: event.datetime.slice(0, 16),
      capacity: event.capacity,
      price: event.price,
      isWaitlistEnabled: event.isWaitlistEnabled,
      waitlistLimit: 0,
      rowVersion: event.rowVersion, // ← زود دا
    });
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingEvent) {
        const updated = await eventsAPI.update(editingEvent.id, { ...form, rowVersion: editingEvent.rowVersion });
        setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? updated : ev));
        toast.success('Event updated!');
      } else {
        const created = await eventsAPI.create(form);
        setEvents(prev => [created, ...prev]);
        toast.success('Event created!');
      }
      setShowForm(false);
      setEditingEvent(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingEvent) return;
    setIsSubmitting(true);
    try {
      await eventsAPI.delete(deletingEvent.id);
      setEvents(prev => prev.filter(ev => ev.id !== deletingEvent.id));
      setDeletingEvent(null);
      toast.success('Event deleted!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">{events.length} event(s)</p>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white
            bg-gradient-to-r from-primary to-orange-500
            shadow-[2px_2px_6px_#b8bec7,-1px_-1px_3px_#ffffff] dark:shadow-[2px_2px_6px_#12151f]
            hover:opacity-90 transition-all"
        >
          <Plus size={12} /> Add Event
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className={`${neuCard} rounded-2xl p-4 space-y-3`}>
          <input
            required value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Event Title *" className={inputClass}
          />
          <div className={`px-4 py-2.5 rounded-2xl ${neuInset}`}>
            <textarea
              required rows={2} value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Description *"
              className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 resize-none"
            />
          </div>
          <input
            required type="datetime-local" value={form.datetime}
            onChange={e => setForm(p => ({ ...p, datetime: e.target.value }))}
            className={inputClass}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required type="number" min="1" value={form.capacity}
              onChange={e => setForm(p => ({ ...p, capacity: Number(e.target.value) }))}
              placeholder="Capacity *" className={inputClass}
            />
            <input
              required type="number" min="0" value={form.price}
              onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))}
              placeholder="Price *" className={inputClass}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox" checked={form.isWaitlistEnabled}
              onChange={e => setForm(p => ({ ...p, isWaitlistEnabled: e.target.checked }))}
              className="accent-primary"
            />
            Enable Waitlist
          </label>
          {form.isWaitlistEnabled && (
            <input
              type="number" min="0" value={form.waitlistLimit}
              onChange={e => setForm(p => ({ ...p, waitlistLimit: Number(e.target.value) }))}
              placeholder="Waitlist Limit" className={inputClass}
            />
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingEvent(null); }}
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
              {isSubmitting ? 'Saving...' : editingEvent ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="animate-spin text-primary" size={24} />
        </div>
      ) : events.length === 0 ? (
        <div className={`${neuCard} rounded-2xl p-6 text-center`}>
          <p className="text-sm text-gray-400">No events yet. Create your first event!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map(event => (
            <div key={event.id} className={`${neuCard} rounded-2xl p-4`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-sm text-gray-700 dark:text-white truncate">
                      {event.title}
                    </h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0
                      ${event.status === 'Active'
                        ? 'text-green-600 bg-green-100 dark:bg-green-900/30'
                        : 'text-gray-400 bg-gray-100 dark:bg-gray-700/30'
                      }`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">{event.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`flex items-center gap-1 text-[10px] text-gray-500 px-2 py-1 rounded-full ${neuSmall}`}>
                      <Calendar size={9} className="text-primary" />
                      {new Date(event.datetime).toLocaleString()}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] text-gray-500 px-2 py-1 rounded-full ${neuSmall}`}>
                      <Users size={9} className="text-primary" />
                      {event.bookedTickets}/{event.capacity}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] text-gray-500 px-2 py-1 rounded-full ${neuSmall}`}>
                      <DollarSign size={9} className="text-primary" />
                      {event.price}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => openEdit(event)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg ${neuSmall} text-gray-400 hover:text-primary transition-colors`}
                  >
                    <Edit size={12} />
                  </button>
                  <button
                    onClick={() => setDeletingEvent(event)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg ${neuSmall} text-gray-400 hover:text-red-500 transition-colors`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              {event.isSoldOut && (
                <p className="text-[10px] text-red-500 font-semibold mt-1">Sold Out</p>
              )}
            </div>
          ))}
        </div>
      )}

      {deletingEvent && (
        <DeleteConfirmModal
          title={`Delete "${deletingEvent.title}"?`}
          description="This will permanently remove the event."
          onConfirm={handleDelete}
          onCancel={() => setDeletingEvent(null)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default EventsTab;