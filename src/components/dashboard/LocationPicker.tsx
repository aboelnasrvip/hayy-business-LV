import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  defaultLat?: number;
  defaultLng?: number;
  flyTo?: [number, number] | null;
}

function FlyToLocation({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 15, { duration: 1.5 });
  }, [coords, map]);
  return null;
}

const LocationPicker = ({
  onLocationSelect,
  defaultLat = 30.0444,
  defaultLng = 31.2357,
  flyTo,
}: LocationPickerProps) => {
  const [position, setPosition] = useState<[number, number]>([
    defaultLat,
    defaultLng,
  ]);

  useEffect(() => {
    if (flyTo) {
      setPosition(flyTo);
    }
  }, [flyTo]);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
      },
    });
    return <Marker position={position} />;
  }

  return (
    <MapContainer
      center={[defaultLat, defaultLng]}
      zoom={13}
      style={{ height: "400px", borderRadius: "12px", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {flyTo && <FlyToLocation coords={flyTo} />}
      <LocationMarker />
    </MapContainer>
  );
};

export default LocationPicker;
