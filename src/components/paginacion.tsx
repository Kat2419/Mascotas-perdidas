import Link from 'next/link'

type Props = {
  paginaActual: number
  hayMas: boolean
  searchParams: Record<string, string>
}

function construirHref(searchParams: Record<string, string>, pagina: number) {
  const params = new URLSearchParams(searchParams)
  params.set('page', String(pagina))
  return `/?${params.toString()}`
}

export function Paginacion({ paginaActual, hayMas, searchParams }: Props) {
  if (paginaActual === 1 && !hayMas) return null

  return (
    <div className="flex items-center justify-center gap-3 py-6">
      {paginaActual > 1 ? (
        <Link
          href={construirHref(searchParams, paginaActual - 1)}
          className="rounded-md border border-black/15 dark:border-white/20 px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
        >
          ← Anteriores
        </Link>
      ) : (
        <span className="rounded-md border border-black/5 dark:border-white/5 px-3 py-1.5 text-sm opacity-40">
          ← Anteriores
        </span>
      )}
      <span className="text-sm opacity-60">Página {paginaActual}</span>
      {hayMas ? (
        <Link
          href={construirHref(searchParams, paginaActual + 1)}
          className="rounded-md border border-black/15 dark:border-white/20 px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
        >
          Siguientes →
        </Link>
      ) : (
        <span className="rounded-md border border-black/5 dark:border-white/5 px-3 py-1.5 text-sm opacity-40">
          Siguientes →
        </span>
      )}
    </div>
  )
}
