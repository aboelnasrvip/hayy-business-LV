import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, Users, DollarSign, Loader, MapPin } from 'lucide-react';
import { eventsAPI, Event, CreateEventRequest } from '@/services/eventsService';
import { placesAPI, Place } from '@/services/placesService';
import DeleteConfirmModal from '@/components/places/DeleteConfirmModal';
import { toast } from 'sonner';

const neuCard = "rounded-[1.5rem] bg-[#e8ecf3] shadow-[12px_12px_24px_#adb5c0,-12px_-12px_24px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[8px_8px_20px_#0e1020,-8px_-8px_20px_#343750]";
const neuSmall = "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";
const inputClass = `w-full px-4 py-2.5 rounded-full outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 bg-transparent ${neuInset}`;

const emptyForm = (placeId: string): CreateEventRequest & { rowVersion: string } => ({
  placeId, title: '', description: '', datetime: '',
  capacity: 50, price: 0, isWaitlistEnabled: false, waitlistLimit: 0, rowVersion: '',
});

const DashboardEvents = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm(''));

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
    setEventsLoading(true);
    eventsAPI.getByPlace(selectedPlaceId)
      .then(setEvents)
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setEventsLoading(false));
  }, [selectedPlaceId]);

  const openAdd = () => {
    setForm(emptyForm(selectedPlaceId));
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
      rowVersion: event.rowVersion,
    });
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingEvent) {
        const updated = await eventsAPI.update(editingEvent.id, { ...form, rowVersion: form.rowVersion });
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
    <div className="space-y-6 pt-16">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700 dark:text-white">Events</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage events for your places</p>
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
            <Plus size={16} /> Add Event
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
          <p className="text-sm text-gray-300 dark:text-gray-600 mt-1">Add a place first to create events</p>
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
            {editingEvent ? 'Edit Event' : `New Event — ${places.find(p => p.id === selectedPlaceId)?.name}`}
          </h3>
          <input required value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Event Title *" className={inputClass} />
          <div className={`px-4 py-3 rounded-2xl ${neuInset}`}>
            <textarea required rows={2} value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Description *"
              className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 resize-none" />
          </div>
          <input required type="datetime-local" value={form.datetime}
            onChange={e => setForm(p => ({ ...p, datetime: e.target.value }))}
            className={inputClass} />
          <div className="grid grid-cols-2 gap-3">
            <input required type="number" min="1" value={form.capacity}
              onChange={e => setForm(p => ({ ...p, capacity: Number(e.target.value) }))}
              placeholder="Capacity *" className={inputClass} />
            <input required type="number" min="0" value={form.price}
              onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))}
              placeholder="Price *" className={inputClass} />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
            <input type="checkbox" checked={form.isWaitlistEnabled}
              onChange={e => setForm(p => ({ ...p, isWaitlistEnabled: e.target.checked }))}
              className="accent-primary" />
            Enable Waitlist
          </label>
          {form.isWaitlistEnabled && (
            <input type="number" min="0" value={form.waitlistLimit}
              onChange={e => setForm(p => ({ ...p, waitlistLimit: Number(e.target.value) }))}
              placeholder="Waitlist Limit" className={inputClass} />
          )}
          <div className="flex justify-end gap-2">
            <button type="button"
              onClick={() => { setShowForm(false); setEditingEvent(null); }}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold text-gray-500 ${neuSmall}`}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="px-5 py-2.5 rounded-full text-sm font-bold text-white
                bg-gradient-to-r from-primary to-orange-500
                shadow-[3px_3px_8px_#b8bec7] dark:shadow-[3px_3px_8px_#12151f]
                hover:opacity-90 disabled:opacity-50 transition-all">
              {isSubmitting ? 'Saving...' : editingEvent ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {/* Events Grid */}
      {eventsLoading ? (
        <div className="flex justify-center py-10">
          <Loader className="animate-spin text-primary" size={32} />
        </div>
      ) : events.length === 0 && selectedPlaceId ? (
        <div className={`${neuCard} p-12 text-center`}>
          <Calendar size={36} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No events yet</p>
          <p className="text-sm text-gray-300 dark:text-gray-600 mt-1">Create your first event for this place</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`${neuCard} p-5`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-700 dark:text-white truncate mb-1">{event.title}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold
                    ${event.status === 'Active'
                      ? 'text-green-600 bg-green-100 dark:bg-green-900/30'
                      : 'text-gray-400 bg-gray-100 dark:bg-gray-700/30'
                    }`}>
                    {event.status}
                    {event.isSoldOut && ' · Sold Out'}
                  </span>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => openEdit(event)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg ${neuSmall} text-gray-400 hover:text-primary transition-colors`}>
                    <Edit size={12} />
                  </button>
                  <button onClick={() => setDeletingEvent(event)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg ${neuSmall} text-gray-400 hover:text-red-500 transition-colors`}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">{event.description}</p>
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
            </motion.div>
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

export default DashboardEvents;