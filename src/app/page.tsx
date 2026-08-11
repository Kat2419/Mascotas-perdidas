import { createClient } from '@/lib/supabase/server'
import { FiltrosBar } from '@/components/filtros-bar'
import { FiltrosToggle } from '@/components/filtros-toggle'
import { PublicacionCard } from '@/components/publicacion-card'
import { Paginacion } from '@/components/paginacion'
import { PUBLICACIONES_POR_PAGINA } from '@/lib/constants'
import type { Publicacion } from '@/lib/types'

export default async function Home(props: PageProps<'/'>) {
  const sp = await props.searchParams
  const get = (key: string) => {
    const v = sp[key]
    return Array.isArray(v) ? v[0] ?? '' : v ?? ''
  }

  const departamento = get('dep')
  const ciudad = get('ciudad')
  const mascota = get('mascota')
  const tipo = get('tipo')
  const pagina = Math.max(1, Number(get('page')) || 1)

  const supabase = await createClient()

  let query = supabase
    .from('publicaciones')
    .select('*, profiles(nombre, avatar_url)', { count: 'exact' })
    .order('estado', { ascending: true }) // 'activa' antes que 'reunido'/'cerrada' alfabéticamente
    .order('created_at', { ascending: false })

  if (departamento) query = query.eq('departamento', departamento)
  if (ciudad) query = query.eq('ciudad', ciudad)
  if (mascota) query = query.eq('tipo_mascota', mascota)
  if (tipo) query = query.eq('tipo', tipo)

  const desde = (pagina - 1) * PUBLICACIONES_POR_PAGINA
  const hasta = desde + PUBLICACIONES_POR_PAGINA - 1
  query = query.range(desde, hasta)

  const { data, count } = await query
  const publicaciones = (data ?? []) as Publicacion[]
  const hayMas = count != null ? hasta + 1 < count : publicaciones.length === PUBLICACIONES_POR_PAGINA

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold mb-6">Mascotas perdidas y encontradas</h1>

      <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-6">
        <aside className="order-2 sm:order-none sm:sticky sm:top-20 sm:self-start bg-white/70 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl p-4">
          <FiltrosToggle>
            <FiltrosBar defaults={{ departamento, ciudad, tipo, mascota }} />
          </FiltrosToggle>
        </aside>

        <div className="order-1 sm:order-none flex flex-col gap-6 min-w-0">
          {publicaciones.length === 0 ? (
            <div className="rounded-xl border border-dashed border-black/15 dark:border-white/15 py-16 text-center text-sm opacity-60">
              No hay publicaciones con estos filtros todavía.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
              {publicaciones.map((p) => (
                <PublicacionCard key={p.id} publicacion={p} />
              ))}
            </div>
          )}

          <Paginacion
            paginaActual={pagina}
            hayMas={hayMas}
            searchParams={{ dep: departamento, ciudad, mascota, tipo }}
          />
        </div>
      </div>
    </div>
  )
}
