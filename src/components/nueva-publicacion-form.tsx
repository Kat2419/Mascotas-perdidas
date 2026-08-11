'use client'

import { useActionState, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  DEPARTAMENTOS,
  DEPARTAMENTOS_CIUDADES,
  TIPOS_MASCOTA,
  TIPOS_PUBLICACION,
} from '@/lib/constants'
import { crearPublicacion, type EstadoPublicar } from '@/lib/actions/publicaciones'
import { ImageUploader } from '@/components/image-uploader'

const UbicacionPicker = dynamic(
  () => import('@/components/ubicacion-picker').then((m) => m.UbicacionPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full rounded-md border border-black/15 dark:border-white/15 flex items-center justify-center text-sm opacity-60">
        Cargando mapa…
      </div>
    ),
  }
)

const estadoInicial: EstadoPublicar = undefined

export function NuevaPublicacionForm() {
  const [estado, formAction, pending] = useActionState(crearPublicacion, estadoInicial)
  const [departamento, setDepartamento] = useState('')
  const [ciudad, setCiudad] = useState('')
  const ciudades = departamento ? DEPARTAMENTOS_CIUDADES[departamento] ?? [] : []

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-xl">
      <fieldset className="flex gap-4">
        {TIPOS_PUBLICACION.map((t, i) => (
          <label key={t.valor} className="flex items-center gap-2 text-sm">
            <input type="radio" name="tipo" value={t.valor} defaultChecked={i === 0} required />
            {t.valor === 'perdido' ? 'Se me perdió' : 'La encontré / la tengo'}
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-1">
        <label htmlFor="tipo_mascota" className="text-sm font-medium">
          Tipo de mascota
        </label>
        <select
          id="tipo_mascota"
          name="tipo_mascota"
          required
          className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
        >
          {TIPOS_MASCOTA.map((t) => (
            <option key={t.valor} value={t.valor}>
              {t.etiqueta}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="nombre_mascota" className="text-sm font-medium">
          Nombre de la mascota (opcional)
        </label>
        <input
          id="nombre_mascota"
          name="nombre_mascota"
          type="text"
          maxLength={60}
          className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="raza" className="text-sm font-medium">
          Raza (opcional)
        </label>
        <input
          id="raza"
          name="raza"
          type="text"
          maxLength={60}
          placeholder="Ej: Criollo/mestizo, Labrador, Siamés… si no sabes, déjalo en blanco"
          className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="descripcion" className="text-sm font-medium">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          required
          minLength={10}
          maxLength={800}
          rows={4}
          placeholder="Raza, color, tamaño, características, en qué circunstancias se perdió o fue encontrada…"
          className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="departamento" className="text-sm font-medium">
            Departamento
          </label>
          <select
            id="departamento"
            name="departamento"
            required
            value={departamento}
            onChange={(e) => {
              setDepartamento(e.target.value)
              setCiudad('')
            }}
            className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Selecciona
            </option>
            {DEPARTAMENTOS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="ciudad" className="text-sm font-medium">
            Ciudad
          </label>
          <select
            id="ciudad"
            name="ciudad"
            required
            disabled={!departamento}
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm disabled:opacity-50"
          >
            <option value="" disabled>
              {departamento ? 'Selecciona' : 'Elige un departamento primero'}
            </option>
            {ciudades.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="direccion_referencia" className="text-sm font-medium">
          Punto de referencia o dirección aproximada (opcional)
        </label>
        <input
          id="direccion_referencia"
          name="direccion_referencia"
          type="text"
          maxLength={200}
          placeholder="Ej: cerca al parque principal, barrio El Jardín…"
          className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">Marcar ubicación en el mapa (opcional)</span>
        <UbicacionPicker departamento={departamento} ciudad={ciudad} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="contacto_whatsapp" className="text-sm font-medium">
          WhatsApp de contacto
        </label>
        <input
          id="contacto_whatsapp"
          name="contacto_whatsapp"
          type="tel"
          required
          placeholder="Ej: 3001234567"
          maxLength={20}
          className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">Foto</span>
        <ImageUploader name="foto_url" />
      </div>

      {estado?.error && (
        <p className="rounded-md bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm px-3 py-2">
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-orange-600 text-white font-medium px-4 py-2.5 hover:bg-orange-700 transition-colors disabled:opacity-60"
      >
        {pending ? 'Publicando…' : 'Publicar'}
      </button>
    </form>
  )
}
