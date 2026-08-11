import type { EstadoPublicacion, TipoMascota, TipoPublicacion } from '@/lib/constants'

export type Profile = {
  id: string
  nombre: string
  whatsapp: string | null
  avatar_url: string | null
  created_at: string
}

export type Publicacion = {
  id: string
  usuario_id: string
  tipo: TipoPublicacion
  estado: EstadoPublicacion
  tipo_mascota: TipoMascota
  nombre_mascota: string | null
  raza: string | null
  descripcion: string
  foto_url: string | null
  foto_moderada: boolean
  departamento: string
  ciudad: string
  direccion_referencia: string | null
  contacto_whatsapp: string | null
  lat: number | null
  lng: number | null
  created_at: string
  profiles?: Pick<Profile, 'nombre' | 'avatar_url'> | null
}

export type Respuesta = {
  id: string
  publicacion_id: string
  usuario_id: string
  mensaje: string
  foto_url: string | null
  created_at: string
  profiles?: Pick<Profile, 'nombre' | 'avatar_url'> | null
}
