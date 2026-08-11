'use client'

import { useActionState } from 'react'
import { actualizarPasswordRecuperacion, type EstadoAuth } from '@/lib/actions/auth'

const estadoInicial: EstadoAuth = undefined

export function NuevaPasswordForm() {
  const [estado, formAction, pending] = useActionState(
    actualizarPasswordRecuperacion,
    estadoInicial
  )

  return (
    <form action={formAction} className="flex flex-col gap-3 w-full max-w-sm">
      <input
        name="password"
        type="password"
        required
        minLength={6}
        placeholder="Nueva contraseña (mínimo 6 caracteres)"
        className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
      />

      {estado?.error && <p className="text-sm text-red-600">{estado.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-orange-600 text-white font-medium px-4 py-2.5 hover:bg-orange-700 transition-colors disabled:opacity-60"
      >
        {pending ? 'Guardando…' : 'Cambiar contraseña'}
      </button>
    </form>
  )
}
