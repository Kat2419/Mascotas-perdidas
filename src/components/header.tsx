import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { cerrarSesion } from '@/lib/actions/auth'

export async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-10 border-b border-black/10 dark:border-white/10 bg-white/90 dark:bg-black/70 backdrop-blur">
      <div className="flex w-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span aria-hidden>🐾</span>
          <span className="hidden sm:inline">Mascotas Perdidas en Terremoto de Colombia 2026</span>
          <span className="sm:hidden">Mascotas Perdidas</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 text-sm font-medium border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            Inicio
          </Link>

          <Link
            href="/publicaciones/nueva"
            className="rounded-md bg-orange-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
          >
            Publicar
          </Link>

          {user ? (
            <form action={cerrarSesion}>
              <button
                type="submit"
                className="rounded-md px-3 py-1.5 text-sm font-medium border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                Salir
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="rounded-md px-3 py-1.5 text-sm font-medium border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              Ingresar
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
