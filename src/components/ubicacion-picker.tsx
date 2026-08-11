'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { COORDENADAS_CIUDAD, COORDENADAS_COLOMBIA } from '@/lib/constants'

const iconoPin = L.divIcon({
  html: '📍',
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})

function ManejadorClick({ onSeleccionar }: { onSeleccionar: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSeleccionar(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function Recentrar({ centro, zoom }: { centro: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(centro, zoom)
  }, [centro, zoom, map])
  return null
}

export function UbicacionPicker({
  departamento,
  ciudad,
}: {
  departamento: string
  ciudad: string
}) {
  const [posicion, setPosicion] = useState<[number, number] | null>(null)

  const centro = useMemo<[number, number]>(() => {
    return COORDENADAS_CIUDAD[`${departamento}|${ciudad}`] ?? COORDENADAS_COLOMBIA
  }, [departamento, ciudad])
  const zoom = ciudad && COORDENADAS_CIUDAD[`${departamento}|${ciudad}`] ? 13 : 6

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name="lat" value={posicion?.[0] ?? ''} />
      <input type="hidden" name="lng" value={posicion?.[1] ?? ''} />

      <div className="h-64 w-full overflow-hidden rounded-md border border-black/15 dark:border-white/15">
        <MapContainer
          center={centro}
          zoom={zoom}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Recentrar centro={centro} zoom={zoom} />
          <ManejadorClick onSeleccionar={(lat, lng) => setPosicion([lat, lng])} />
          {posicion && <Marker position={posicion} icon={iconoPin} />}
        </MapContainer>
      </div>

      <p className="text-xs opacity-60">
        {posicion
          ? 'Ubicación marcada. Toca otro punto del mapa si quieres moverla.'
          : 'Opcional: toca el mapa para marcar el punto exacto donde se perdió o fue vista.'}
      </p>

      {posicion && (
        <button
          type="button"
          onClick={() => setPosicion(null)}
          className="text-xs text-red-600 hover:underline w-fit"
        >
          Quitar ubicación
        </button>
      )}
    </div>
  )
}
