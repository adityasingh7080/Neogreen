"use client";

import { MapContainer, TileLayer, Marker, Popup, Rectangle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface ProjectMapProps {
  lat?: number;
  lng?: number;
}

export default function ProjectMap({ lat = 37.7749, lng = -122.4194 }: ProjectMapProps) {
  const bounds: L.LatLngBoundsExpression = [
    [lat - 0.005, lng - 0.008],
    [lat + 0.005, lng + 0.008],
  ];

  return (
    <div className="h-full min-h-[450px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri"
        />
        <Rectangle
          bounds={bounds}
          pathOptions={{ color: "#10b981", weight: 2, fillOpacity: 0.15 }}
        />
        <Marker position={[lat, lng]} icon={customIcon}>
          <Popup>
            <div className="text-xs text-slate-900">
              <strong>Target Analysis Center</strong>
              <br />
              Lat: {lat}, Lng: {lng}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}