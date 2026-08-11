'use client'

import { useTransition } from 'react'
import { marcarComoReunido } from '@/lib/actions/publicaciones'

export function MarcarReunidoButton({ publicacionId }: { publicacionId: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm('¿Confirmas que esta mascota ya fue reunida con su familia?')) return
        startTransition(() => marcarComoReunido(publicacionId))
      }}
      className="rounded-md border border-emerald-600 text-emerald-700 dark:text-emerald-400 text-sm font-medium px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors disabled:opacity-50"
    >
      {pending ? 'Actualizando…' : '🎉 Marcar como reunido'}
    </button>
  )
}
