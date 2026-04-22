import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, MapPin, Edit, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LocationPicker from "@/components/dashboard/LocationPicker";
import { placesAPI, CreatePlaceRequest, Place } from "@/services/placesService";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";

const DashboardPlaces = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    latitude: 30.0444,
    longitude: 31.2357,
    categoryId: "", // يمكنك جلب الـ categories من API
  });

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    setIsLoading(true);
    try {
      const data = await placesAPI.getPlaces();
      setPlaces(data);
    } catch (error: any) {
      toast.error("Failed to load places");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("User not found");
      return;
    }

    const placeData: CreatePlaceRequest = {
      ...formData,
      businessId: user.id,
      tagIds: [],
      openingHours: [
        // مثال: يمكنك تعديله حسب احتياجك
        { dayOfWeek: 1, openTime: "09:00", closeTime: "18:00" },
        { dayOfWeek: 2, openTime: "09:00", closeTime: "18:00" },
        { dayOfWeek: 3, openTime: "09:00", closeTime: "18:00" },
        { dayOfWeek: 4, openTime: "09:00", closeTime: "18:00" },
        { dayOfWeek: 5, openTime: "09:00", closeTime: "18:00" },
      ],
    };

    try {
      await placesAPI.createPlace(placeData);
      toast.success("Place created successfully!");
      setIsDialogOpen(false);
      fetchPlaces();
      // Reset form
      setFormData({
        name: "",
        description: "",
        latitude: 30.0444,
        longitude: 31.2357,
        categoryId: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create place");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Places</h1>
          <p className="text-muted-foreground mt-1">Manage your business locations</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90 shadow-glow">
              <Plus className="w-5 h-5 me-2" />
              Add Place
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Place</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Place Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Main Branch"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your place..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Category ID *</Label>
                <Input
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  placeholder="Enter category GUID"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Select Location on Map *</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Click on the map to set your location
                </p>
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  defaultLat={formData.latitude}
                  defaultLng={formData.longitude}
                />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Latitude</Label>
                    <p className="text-sm font-mono">{formData.latitude.toFixed(6)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Longitude</Label>
                    <p className="text-sm font-mono">{formData.longitude.toFixed(6)}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-primary">
                  Create Place
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Places List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : places.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No places yet</h3>
          <p className="text-muted-foreground">Add your first business location to get started</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {places.map((place, index) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{place.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{place.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                    </span>
                    {place.openingHours && place.openingHours.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {place.openingHours[0].openTime} - {place.openingHours[0].closeTime}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPlaces;