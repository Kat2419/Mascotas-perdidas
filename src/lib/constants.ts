// Cambia esto a `true` cuando actives el proveedor de Google en
// Supabase (Authentication → Providers → Google). Ver README.
export const GOOGLE_AUTH_ENABLED = false

export const DEPARTAMENTOS_CIUDADES: Record<string, string[]> = {
  Chocó: ['Quibdó', 'Istmina', 'Condoto', 'Tadó', 'Bahía Solano', 'Nuquí', 'Riosucio'],
  Antioquia: [
    'Medellín',
    'Bello',
    'Itagüí',
    'Envigado',
    'Apartadó',
    'Turbo',
    'Rionegro',
    'Urrao',
  ],
  'Valle del Cauca': [
    'Cali',
    'Buenaventura',
    'Palmira',
    'Tuluá',
    'Buga',
    'Cartago',
    'Jamundí',
  ],
  Cauca: [
    'Popayán',
    'Santander de Quilichao',
    'Puerto Tejada',
    'Patía',
    'Piendamó',
    'Silvia',
    'Timbío',
    'El Tambo',
  ],
  Risaralda: [
    'Pereira',
    'Dosquebradas',
    'Santa Rosa de Cabal',
    'La Virginia',
    'Marsella',
    'Belén de Umbría',
  ],
  Quindío: [
    'Armenia',
    'Calarcá',
    'Montenegro',
    'La Tebaida',
    'Circasia',
    'Quimbaya',
  ],
  Caldas: [
    'Manizales',
    'La Dorada',
    'Chinchiná',
    'Villamaría',
    'Riosucio',
    'Anserma',
  ],
}

export const DEPARTAMENTOS = Object.keys(DEPARTAMENTOS_CIUDADES)

export const TIPOS_MASCOTA = [
  { valor: 'perro', etiqueta: 'Perro' },
  { valor: 'gato', etiqueta: 'Gato' },
  { valor: 'conejo', etiqueta: 'Conejo' },
  { valor: 'otro', etiqueta: 'Otro' },
] as const

export type TipoMascota = (typeof TIPOS_MASCOTA)[number]['valor']

export const TIPOS_PUBLICACION = [
  { valor: 'perdido', etiqueta: 'Perdido' },
  { valor: 'encontrado', etiqueta: 'Encontrado' },
] as const

export type TipoPublicacion = (typeof TIPOS_PUBLICACION)[number]['valor']

export const ESTADOS_PUBLICACION = [
  { valor: 'activa', etiqueta: 'Buscando' },
  { valor: 'reunido', etiqueta: 'Reunido con su familia' },
  { valor: 'cerrada', etiqueta: 'Cerrada' },
] as const

export type EstadoPublicacion = (typeof ESTADOS_PUBLICACION)[number]['valor']

export const PUBLICACIONES_POR_PAGINA = 24
