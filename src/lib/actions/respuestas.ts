'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { moderarImagen } from '@/lib/moderation'

export type EstadoRespuesta = { error?: string } | undefined

async function borrarFotoStorage(fotoUrl: string) {
  const supabase = await createClient()
  const marcador = '/fotos-mascotas/'
  const idx = fotoUrl.indexOf(marcador)
  if (idx === -1) return
  const path = fotoUrl.slice(idx + marcador.length)
  await supabase.storage.from('fotos-mascotas').remove([path])
}

export async function crearRespuesta(
  _prevState: EstadoRespuesta,
  formData: FormData
): Promise<EstadoRespuesta> {
  const publicacionId = String(formData.get('publicacion_id') ?? '')
  const mensaje = String(formData.get('mensaje') ?? '').trim()
  const fotoUrl = String(formData.get('foto_url') ?? '').trim() || null

  if (!publicacionId) {
    return { error: 'Publicación inválida.' }
  }
  if (mensaje.length < 3) {
    return { error: 'Escribe un mensaje un poco más completo.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Debes iniciar sesión para responder.' }
  }

  if (fotoUrl) {
    const moderacion = await moderarImagen(fotoUrl)
    if (!moderacion.aprobada) {
      await borrarFotoStorage(fotoUrl)
      return {
        error: `La foto fue rechazada automáticamente (${moderacion.motivo}). Intenta con otra foto.`,
      }
    }
  }

  const { error } = await supabase.from('respuestas').insert({
    publicacion_id: publicacionId,
    usuario_id: user.id,
    mensaje,
    foto_url: fotoUrl,
  })

  if (error) {
    return { error: 'No se pudo enviar tu respuesta. Intenta de nuevo.' }
  }

  revalidatePath(`/publicaciones/${publicacionId}`)
  return undefined
}
