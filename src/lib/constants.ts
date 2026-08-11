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

// Coordenadas aproximadas del centro de cada ciudad, solo para centrar el
// mapa al publicar — el pin final lo pone la persona a mano, así que no
// necesitan ser exactas al metro. La llave incluye el departamento porque
// hay nombres de ciudad repetidos (ej. "Riosucio" existe en Chocó y en
// Caldas, son pueblos distintos a cientos de km de distancia).
export const COORDENADAS_CIUDAD: Record<string, [number, number]> = {
  'Chocó|Quibdó': [5.6947, -76.6611],
  'Chocó|Istmina': [5.1564, -76.6836],
  'Chocó|Condoto': [5.0989, -76.6144],
  'Chocó|Tadó': [5.263, -76.5561],
  'Chocó|Bahía Solano': [6.2308, -77.4022],
  'Chocó|Nuquí': [5.7075, -77.2694],
  'Chocó|Riosucio': [7.4406, -77.1197],
  'Antioquia|Medellín': [6.2442, -75.5812],
  'Antioquia|Bello': [6.3373, -75.5581],
  'Antioquia|Itagüí': [6.1719, -75.6119],
  'Antioquia|Envigado': [6.1689, -75.5911],
  'Antioquia|Apartadó': [7.8828, -76.6247],
  'Antioquia|Turbo': [8.0947, -76.7286],
  'Antioquia|Rionegro': [6.1536, -75.3733],
  'Antioquia|Urrao': [6.3125, -76.1381],
  'Valle del Cauca|Cali': [3.4516, -76.532],
  'Valle del Cauca|Buenaventura': [3.8801, -77.0313],
  'Valle del Cauca|Palmira': [3.5394, -76.3036],
  'Valle del Cauca|Tuluá': [4.0847, -76.1958],
  'Valle del Cauca|Buga': [3.9009, -76.2983],
  'Valle del Cauca|Cartago': [4.7455, -75.9198],
  'Valle del Cauca|Jamundí': [3.2617, -76.5419],
  'Cauca|Popayán': [2.4448, -76.6147],
  'Cauca|Santander de Quilichao': [3.0111, -76.4842],
  'Cauca|Puerto Tejada': [3.2333, -76.4167],
  'Cauca|Patía': [2.0264, -77.0728],
  'Cauca|Piendamó': [2.6389, -76.5333],
  'Cauca|Silvia': [2.6169, -76.3811],
  'Cauca|Timbío': [2.3486, -76.6817],
  'Cauca|El Tambo': [2.4436, -76.8125],
  'Risaralda|Pereira': [4.8133, -75.6961],
  'Risaralda|Dosquebradas': [4.8339, -75.6714],
  'Risaralda|Santa Rosa de Cabal': [4.8703, -75.6222],
  'Risaralda|La Virginia': [4.8983, -75.8825],
  'Risaralda|Marsella': [4.9358, -75.7392],
  'Risaralda|Belén de Umbría': [5.2011, -75.8703],
  'Quindío|Armenia': [4.5389, -75.6811],
  'Quindío|Calarcá': [4.5228, -75.6436],
  'Quindío|Montenegro': [4.5686, -75.7503],
  'Quindío|La Tebaida': [4.4533, -75.7825],
  'Quindío|Circasia': [4.6167, -75.6333],
  'Quindío|Quimbaya': [4.6231, -75.7622],
  'Caldas|Manizales': [5.0689, -75.5174],
  'Caldas|La Dorada': [5.4522, -74.6683],
  'Caldas|Chinchiná': [4.9819, -75.6053],
  'Caldas|Villamaría': [5.0392, -75.5111],
  'Caldas|Anserma': [5.2311, -75.7889],
  'Caldas|Riosucio': [5.4183, -75.7025],
}

// Centro aproximado de Colombia, usado cuando todavía no se ha elegido
// ciudad.
export const COORDENADAS_COLOMBIA: [number, number] = [4.5709, -74.2973]

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
