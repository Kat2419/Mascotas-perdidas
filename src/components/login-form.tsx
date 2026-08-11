'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import {
  iniciarSesionConCorreo,
  iniciarSesionConGoogle,
  type EstadoAuth,
} from '@/lib/actions/auth'
import { GOOGLE_AUTH_ENABLED } from '@/lib/constants'

const estadoInicial: EstadoAuth = undefined

export function LoginForm() {
  const [estado, formAction, pending] = useActionState(iniciarSesionConCorreo, estadoInicial)

  return (
    <div className="flex flex-col gap-5 w-full max-w-sm text-left">
      {GOOGLE_AUTH_ENABLED && (
        <>
          <form action={iniciarSesionConGoogle}>
            <button
              type="submit"
              className="w-full rounded-md border border-black/15 dark:border-white/20 px-4 py-2.5 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              Continuar con Google
            </button>
          </form>

          <div className="flex items-center gap-3 text-xs opacity-50">
            <div className="h-px flex-1 bg-current" />
            o con tu correo
            <div className="h-px flex-1 bg-current" />
          </div>
        </>
      )}

      <form action={formAction} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          required
          placeholder="Correo electrónico"
          className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Contraseña"
          className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
        />

        {estado?.error && <p className="text-sm text-red-600">{estado.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-orange-600 text-white font-medium px-4 py-2.5 hover:bg-orange-700 transition-colors disabled:opacity-60"
        >
          {pending ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <p className="text-sm opacity-70">
        <Link href="/login/recuperar" className="text-orange-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </p>

      <p className="text-sm opacity-70">
        ¿No tienes cuenta?{' '}
        <Link href="/registro" className="text-orange-600 hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  )
}
