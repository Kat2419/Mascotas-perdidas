'use client'

import { useActionState } from 'react'
import { solicitarRecuperacion, type EstadoAuth } from '@/lib/actions/auth'

const estadoInicial: EstadoAuth = undefined

export function RecuperarForm() {
  const [estado, formAction, pending] = useActionState(solicitarRecuperacion, estadoInicial)

  if (estado?.ok) {
    return (
      <p className="text-sm w-full max-w-sm rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-2">
        Listo, revisa tu correo y haz clic en el link para poner una contraseña nueva.
      </p>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-3 w-full max-w-sm">
      <input
        name="email"
        type="email"
        required
        placeholder="Tu correo electrónico"
        className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
      />

      {estado?.error && <p className="text-sm text-red-600">{estado.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-orange-600 text-white font-medium px-4 py-2.5 hover:bg-orange-700 transition-colors disabled:opacity-60"
      >
        {pending ? 'Enviando…' : 'Enviar link de recuperación'}
      </button>
    </form>
  )
}
