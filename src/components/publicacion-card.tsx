import Image from 'next/image'
import Link from 'next/link'
import type { Publicacion } from '@/lib/types'

const ETIQUETA_TIPO_MASCOTA: Record<string, string> = {
  perro: 'Perro',
  gato: 'Gato',
  conejo: 'Conejo',
  otro: 'Otro',
}

function tiempoRelativo(fechaISO: string) {
  const diffMs = Date.now() - new Date(fechaISO).getTime()
  const horas = Math.floor(diffMs / 3_600_000)
  if (horas < 1) return 'hace menos de 1 hora'
  if (horas < 24) return `hace ${horas} h`
  const dias = Math.floor(horas / 24)
  return `hace ${dias} d`
}

function formatearFechaCorta(fechaISO: string) {
  return new Date(fechaISO).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function PublicacionCard({ publicacion }: { publicacion: Publicacion }) {
  const esPerdido = publicacion.tipo === 'perdido'
  const href = `/publicaciones/${publicacion.id}`

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/20 hover:shadow-lg transition-shadow">
      <Link href={href} className="relative block aspect-[4/3] bg-black/5 dark:bg-white/5">
        {publicacion.foto_url ? (
          <Image
            src={publicacion.foto_url}
            alt={publicacion.nombre_mascota ?? 'Foto de mascota'}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🐾</div>
        )}

        {publicacion.estado === 'reunido' && (
          <span className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
            Reunido 🎉
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold text-white ${
              esPerdido ? 'bg-red-600' : 'bg-emerald-600'
            }`}
          >
            {esPerdido ? 'Perdido' : 'Encontrado'}
          </span>
          <span className="rounded-full bg-black/10 dark:bg-white/10 px-2 py-0.5 text-xs font-medium">
            {ETIQUETA_TIPO_MASCOTA[publicacion.tipo_mascota]}
          </span>
        </div>

        <Link href={href} className="hover:underline">
          <h3 className="font-bold text-sm truncate">
            {publicacion.nombre_mascota || ETIQUETA_TIPO_MASCOTA[publicacion.tipo_mascota]}
          </h3>
        </Link>

        <div className="flex flex-col gap-1 text-xs opacity-70">
          <div className="flex items-center gap-1.5 truncate">
            <span aria-hidden>📍</span>
            <span className="truncate">
              {publicacion.ciudad}, {publicacion.departamento}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span aria-hidden>🕐</span>
            <span title={formatearFechaCorta(publicacion.created_at)}>
              {tiempoRelativo(publicacion.created_at)}
            </span>
          </div>
        </div>

        <Link
          href={href}
          className="mt-auto block rounded-md bg-orange-600 text-white text-sm font-medium text-center py-2 hover:bg-orange-700 transition-colors"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  )
}
