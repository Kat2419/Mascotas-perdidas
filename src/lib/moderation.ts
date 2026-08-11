// Moderación automática de imágenes usando la API de Sightengine
// (https://sightengine.com). Capa gratuita disponible.
//
// Si no configuras SIGHTENGINE_API_USER / SIGHTENGINE_API_SECRET en .env.local,
// esta función no bloquea nada (moderationConfigured: false) y la publicación
// depende solo del botón "Reportar". Configúrala antes de un lanzamiento real.

type ResultadoModeracion = {
  moderationConfigured: boolean
  aprobada: boolean
  motivo?: string
}

const UMBRAL_DESNUDEZ = 0.5
const UMBRAL_OFENSIVO = 0.5
const UMBRAL_GORE = 0.5

export async function moderarImagen(urlImagen: string): Promise<ResultadoModeracion> {
  const apiUser = process.env.SIGHTENGINE_API_USER
  const apiSecret = process.env.SIGHTENGINE_API_SECRET

  if (!apiUser || !apiSecret) {
    return { moderationConfigured: false, aprobada: true }
  }

  const params = new URLSearchParams({
    url: urlImagen,
    models: 'nudity-2.1,offensive,gore-2.0',
    api_user: apiUser,
    api_secret: apiSecret,
  })

  try {
    const res = await fetch(`https://api.sightengine.com/1.0/check.json?${params.toString()}`, {
      // La revisión de una foto no debería tardar más de unos segundos.
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      // Si el servicio de moderación falla, dejamos pasar la publicación
      // en vez de bloquear a alguien que está buscando a su mascota.
      return { moderationConfigured: true, aprobada: true }
    }

    const data = await res.json()

    const desnudez = Math.max(
      data?.nudity?.sexual_activity ?? 0,
      data?.nudity?.sexual_display ?? 0,
      data?.nudity?.erotica ?? 0
    )
    const ofensivo = data?.offensive?.prob ?? 0
    const gore = data?.gore?.prob ?? 0

    if (desnudez >= UMBRAL_DESNUDEZ) {
      return { moderationConfigured: true, aprobada: false, motivo: 'contenido sexual' }
    }
    if (ofensivo >= UMBRAL_OFENSIVO) {
      return { moderationConfigured: true, aprobada: false, motivo: 'contenido ofensivo' }
    }
    if (gore >= UMBRAL_GORE) {
      return { moderationConfigured: true, aprobada: false, motivo: 'contenido violento/gore' }
    }

    return { moderationConfigured: true, aprobada: true }
  } catch {
    // Timeout u otro error de red: no bloqueamos la publicación por esto.
    return { moderationConfigured: true, aprobada: true }
  }
}
