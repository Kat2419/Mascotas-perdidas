'use client'

import dynamic from 'next/dynamic'

export const UbicacionMapa = dynamic(
  () => import('@/components/ubicacion-mapa-interno').then((m) => m.UbicacionMapaInterno),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full rounded-lg border border-black/10 dark:border-white/10 flex items-center justify-center text-sm opacity-60">
        Cargando mapa…
      </div>
    ),
  }
)
