'use client'

import { useActionState, useRef } from 'react'
import { crearRespuesta, type EstadoRespuesta } from '@/lib/actions/respuestas'
import { ImageUploader } from '@/components/image-uploader'

const SUGERENCIAS = ['La vi', 'La tengo yo', 'Puede ser la mía', 'Contacté al dueño']

const estadoInicial: EstadoRespuesta = undefined

export function RespuestaForm({
  publicacionId,
  autenticado,
}: {
  publicacionId: string
  autenticado: boolean
}) {
  const [estado, formAction, pending] = useActionState(crearRespuesta, estadoInicial)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function agregarSugerencia(texto: string) {
    const el = textareaRef.current
    if (!el) return
    el.value = el.value ? `${el.value} ${texto}. ` : `${texto}. `
    el.focus()
  }

  if (!autenticado) {
    return (
      <p className="text-sm opacity-70">
        <a href="/login" className="text-orange-600 hover:underline">
          Inicia sesión
        </a>{' '}
        para comentar en esta publicación.
      </p>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="publicacion_id" value={publicacionId} />

      <div className="flex flex-wrap gap-2">
        {SUGERENCIAS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => agregarSugerencia(s)}
            className="rounded-full border border-black/15 dark:border-white/20 px-3 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/10"
          >
            {s}
          </button>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        name="mensaje"
        required
        minLength={3}
        maxLength={500}
        rows={3}
        placeholder="Escribe cualquier información que pueda ayudar: dónde la viste, cómo contactarte, detalles adicionales…"
        className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
      />

      <ImageUploader name="foto_url" />

      {estado?.error && <p className="text-sm text-red-600">{estado.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-orange-600 text-white text-sm font-medium px-4 py-2 hover:bg-orange-700 transition-colors disabled:opacity-60"
      >
        {pending ? 'Enviando…' : 'Comentar'}
      </button>
    </form>
  )
}
