'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { moderarImagen } from '@/lib/moderation'
import {
  DEPARTAMENTOS_CIUDADES,
  TIPOS_MASCOTA,
  TIPOS_PUBLICACION,
} from '@/lib/constants'

export type EstadoPublicar = { error?: string } | undefined

function esCiudadValida(departamento: string, ciudad: string) {
  const ciudades = DEPARTAMENTOS_CIUDADES[departamento]
  return Boolean(ciudades && ciudades.includes(ciudad))
}

async function borrarFotoStorage(fotoUrl: string) {
  const supabase = await createClient()
  const marcador = '/fotos-mascotas/'
  const idx = fotoUrl.indexOf(marcador)
  if (idx === -1) return
  const path = fotoUrl.slice(idx + marcador.length)
  await supabase.storage.from('fotos-mascotas').remove([path])
}

export async function crearPublicacion(
  _prevState: EstadoPublicar,
  formData: FormData
): Promise<EstadoPublicar> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Debes iniciar sesión para publicar.' }
  }

  const tipo = String(formData.get('tipo') ?? '')
  const tipoMascota = String(formData.get('tipo_mascota') ?? '')
  const nombreMascota = String(formData.get('nombre_mascota') ?? '').trim() || null
  const raza = String(formData.get('raza') ?? '').trim() || null
  const descripcion = String(formData.get('descripcion') ?? '').trim()
  const departamento = String(formData.get('departamento') ?? '')
  const ciudad = String(formData.get('ciudad') ?? '')
  const direccionReferencia =
    String(formData.get('direccion_referencia') ?? '').trim() || null
  const contactoWhatsapp = String(formData.get('contacto_whatsapp') ?? '').trim() || null
  const fotoUrl = String(formData.get('foto_url') ?? '').trim() || null

  if (!TIPOS_PUBLICACION.some((t) => t.valor === tipo)) {
    return { error: 'Selecciona si la mascota está perdida o fue encontrada.' }
  }
  if (!TIPOS_MASCOTA.some((t) => t.valor === tipoMascota)) {
    return { error: 'Selecciona el tipo de mascota.' }
  }
  if (descripcion.length < 10) {
    return { error: 'Escribe una descripción un poco más detallada (mínimo 10 caracteres).' }
  }
  if (!esCiudadValida(departamento, ciudad)) {
    return { error: 'Selecciona un departamento y ciudad válidos.' }
  }
  if (!contactoWhatsapp) {
    return { error: 'Escribe un número de WhatsApp de contacto para que te puedan avisar.' }
  }

  if (fotoUrl) {
    const moderacion = await moderarImagen(fotoUrl)
    if (!moderacion.aprobada) {
      await borrarFotoStorage(fotoUrl)
      return {
        error: `La foto fue rechazada automáticamente (${moderacion.motivo}). Sube otra foto de la mascota.`,
      }
    }
  }

  const { data, error } = await supabase
    .from('publicaciones')
    .insert({
      usuario_id: user.id,
      tipo,
      tipo_mascota: tipoMascota,
      nombre_mascota: nombreMascota,
      raza,
      descripcion,
      departamento,
      ciudad,
      direccion_referencia: direccionReferencia,
      contacto_whatsapp: contactoWhatsapp,
      foto_url: fotoUrl,
      foto_moderada: Boolean(fotoUrl),
    })
    .select('id')
    .single()

  if (error || !data) {
    return { error: 'No se pudo publicar. Intenta de nuevo en unos segundos.' }
  }

  revalidatePath('/')
  redirect(`/publicaciones/${data.id}`)
}

export async function marcarComoReunido(publicacionId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('publicaciones')
    .update({ estado: 'reunido' })
    .eq('id', publicacionId)
    .eq('usuario_id', user.id)

  revalidatePath('/')
  revalidatePath(`/publicaciones/${publicacionId}`)
}

export async function reportarPublicacion(publicacionId: string, motivo: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes iniciar sesión para reportar una publicación.' }

  await supabase.from('reportes').insert({
    publicacion_id: publicacionId,
    usuario_id: user.id,
    motivo: motivo || 'Sin motivo especificado',
  })

  return { ok: true }
}
