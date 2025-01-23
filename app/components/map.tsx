// components/Map.tsx
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Corrige ícones do Leaflet no Next.js
import { cn } from "@/lib/utils";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Define as props para o componente
interface MapProps {
  center?: [number, number]; // Coordenadas iniciais do mapa
  markerPosition?: [number, number]; // Coordenadas do marcador
  zoom?: number; // Zoom inicial
  className?: string; // Classes de estilização
}

const Map: React.FC<MapProps> = ({
  center = [51.505, -0.09], // Coordenadas padrão
  markerPosition = [51.505, -0.09], // Posição do marcador padrão
  zoom = 13, // Zoom padrão
  className, // Classes de estilização
}) => {
  return (
    <div className={cn("relative h-[500px] w-full rounded-md overflow-hidden", className)}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full" // Garante que o mapa ocupe todo o espaço do container
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={markerPosition}>
          <Popup>
            Este é o marcador na posição: <br /> {markerPosition.join(", ")}.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;