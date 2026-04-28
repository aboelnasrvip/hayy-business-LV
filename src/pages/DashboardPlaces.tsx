import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MapPin, Edit, Trash2, Clock, Loader } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LocationPicker from "@/components/dashboard/LocationPicker";
import { placesAPI, CreatePlaceRequest, Place } from "@/services/placesService";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";

// ── Neumorphic tokens ────────────────────────────────────────────────────────
const neuCard  = "rounded-[1.5rem] bg-[#e8ecf3] shadow-[12px_12px_24px_#adb5c0,-12px_-12px_24px_#ffffff] dark:bg-[#2b2e42] dark:shadow-[8px_8px_20px_#0e1020,-8px_-8px_20px_#343750]";
const neuSmall = "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";
const neuInput = `w-full px-4 py-3 rounded-full outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 bg-transparent ${neuInset}`;

const DashboardPlaces = () => {
  const [places, setPlaces]         = useState<Place[]>([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "", description: "", latitude: 30.0444, longitude: 31.2357, categoryId: "",
  });

  useEffect(() => { fetchPlaces(); }, []);

  const fetchPlaces = async () => {
    setIsLoading(true);
    try { setPlaces(await placesAPI.getPlaces()); }
    catch { toast.error("Failed to load places"); }
    finally { setIsLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) { toast.error("User not found"); return; }
    const placeData: CreatePlaceRequest = {
      ...formData, businessId: user.id, tagIds: [],
      openingHours: [1,2,3,4,5].map((d) => ({ dayOfWeek: d, openTime: "09:00", closeTime: "18:00" })),
    };
    try {
      await placesAPI.createPlace(placeData);
      toast.success("Place created successfully!");
      setIsDialogOpen(false);
      fetchPlaces();
      setFormData({ name: "", description: "", latitude: 30.0444, longitude: 31.2357, categoryId: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create place");
    }
  };

  return (
    <div className="space-y-6 pt-16">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700 dark:text-white">Places</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your business locations</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-white text-sm
              bg-gradient-to-r from-primary to-orange-500
              shadow-[4px_4px_10px_#b8bec7,-2px_-2px_6px_#ffffff,inset_0_1px_0_rgba(255,255,255,0.15)]
              dark:shadow-[4px_4px_10px_#12151f,-2px_-2px_6px_#2e3248]
              hover:opacity-90 active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25)] transition-all">
              <Plus size={16} /> Add Place
            </button>
          </DialogTrigger>

          {/* ── Dialog ── */}
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-0
            rounded-[2rem] bg-[#e0e5ec] shadow-[16px_16px_32px_#b8bec7,-16px_-16px_32px_#ffffff]
            dark:bg-[#252838] dark:shadow-[12px_12px_28px_#12151f,-12px_-12px_28px_#2e3248]">
            <DialogHeader>
              <DialogTitle className="text-gray-700 dark:text-white font-bold text-lg">Add New Place</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              {/* Name */}
              <div className={`flex items-center gap-3 px-5 py-1 ${neuInset} rounded-full`}>
                <MapPin size={16} className="text-gray-400 shrink-0" />
                <input
                  required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Place Name *"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 py-3"
                />
              </div>

              {/* Description */}
              <div className={`px-5 py-3 rounded-2xl ${neuInset}`}>
                <textarea
                  required rows={3} value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description *"
                  className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 resize-none"
                />
              </div>

              {/* Category ID */}
              <div className={`flex items-center gap-3 px-5 py-1 ${neuInset} rounded-full`}>
                <input
                  required value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  placeholder="Category ID (GUID) *"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 py-3"
                />
              </div>

              {/* Map */}
              <div>
                <p className="text-xs text-gray-400 mb-2 px-1">Click on the map to set your location</p>
                <div className={`rounded-2xl overflow-hidden ${neuInset} p-2`}>
                  <LocationPicker
                    onLocationSelect={(lat, lng) => setFormData((p) => ({ ...p, latitude: lat, longitude: lng }))}
                    defaultLat={formData.latitude}
                    defaultLng={formData.longitude}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {[["Latitude", formData.latitude], ["Longitude", formData.longitude]].map(([label, val]) => (
                    <div key={label as string} className={`px-4 py-2.5 rounded-xl ${neuInset}`}>
                      <p className="text-[10px] text-gray-400 mb-0.5">{label as string}</p>
                      <p className="text-sm font-mono font-semibold text-gray-700 dark:text-white">
                        {(val as number).toFixed(6)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsDialogOpen(false)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold text-gray-500 dark:text-gray-400 ${neuSmall} transition-all`}>
                  Cancel
                </button>
                <button type="submit"
                  className="px-5 py-2.5 rounded-full text-sm font-bold text-white
                    bg-gradient-to-r from-primary to-orange-500
                    shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff]
                    dark:shadow-[3px_3px_8px_#12151f,-1px_-1px_4px_#2e3248]
                    hover:opacity-90 transition-all">
                  Create Place
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader className="animate-spin text-primary" size={36} />
        </div>
      )}

      {/* ── Empty State ── */}
      {!isLoading && places.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`${neuCard} p-14 flex flex-col items-center gap-4`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${neuInset}`}>
            <MapPin size={28} className="text-primary" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-gray-700 dark:text-white">No places yet</h3>
            <p className="text-sm text-gray-400 mt-1">Add your first business location to get started</p>
          </div>
          <button onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white
              bg-gradient-to-r from-primary to-orange-500
              shadow-[4px_4px_10px_#b8bec7,-2px_-2px_6px_#ffffff]
              dark:shadow-[4px_4px_10px_#12151f,-2px_-2px_6px_#2e3248]
              hover:opacity-90 transition-all">
            <Plus size={15} /> Add First Place
          </button>
        </motion.div>
      )}

      {/* ── Places Grid ── */}
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
                className={`${neuCard} p-6 relative overflow-hidden`}>
                {/* accent line */}
                <div className="absolute top-0 left-6 right-6 h-[3px] rounded-full bg-gradient-to-r from-primary to-orange-400 opacity-60" />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    {/* icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${neuInset}`}>
                      <MapPin size={20} className="text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-700 dark:text-white mb-1">{place.name}</h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{place.description}</p>

                      <div className="flex flex-wrap gap-3">
                        <span className={`flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 px-3 py-1.5 rounded-full ${neuSmall}`}>
                          <MapPin size={11} className="text-primary" />
                          {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                        </span>
                        {place.openingHours?.length > 0 && (
                          <span className={`flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 px-3 py-1.5 rounded-full ${neuSmall}`}>
                            <Clock size={11} className="text-primary" />
                            {place.openingHours[0].openTime} – {place.openingHours[0].closeTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button className={`w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-primary transition-colors ${neuSmall}`}>
                      <Edit size={15} />
                    </button>
                    <button className={`w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 transition-colors ${neuSmall}`}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default DashboardPlaces;