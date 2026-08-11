'use client'

import { useState, useTransition } from 'react'
import { reportarPublicacion } from '@/lib/actions/publicaciones'

export function ReportButton({ publicacionId }: { publicacionId: string }) {
  const [pending, startTransition] = useTransition()
  const [enviado, setEnviado] = useState(false)

  function manejarClick() {
    const motivo = window.prompt(
      '¿Por qué reportas esta publicación? (contenido inapropiado, spam, información falsa, etc.)'
    )
    if (motivo === null) return

    startTransition(async () => {
      await reportarPublicacion(publicacionId, motivo)
      setEnviado(true)
    })
  }

  if (enviado) {
    return <p className="text-xs opacity-60">Gracias, revisaremos esta publicación.</p>
  }

  return (
    <button
      type="button"
      onClick={manejarClick}
      disabled={pending}
      className="text-xs text-red-600 hover:underline disabled:opacity-50"
    >
      🚩 Reportar publicación
    </button>
  )
}
