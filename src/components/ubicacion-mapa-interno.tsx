'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import L from 'leaflet'

const iconoPin = L.divIcon({
  html: '📍',
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})

export function UbicacionMapaInterno({ lat, lng }: { lat: number; lng: number }) {
  return (
    <div className="h-64 w-full overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={iconoPin} />
      </MapContainer>
    </div>
  )
}
