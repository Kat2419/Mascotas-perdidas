'use client'

import { useState, type ReactNode } from 'react'

export function FiltrosToggle({ children }: { children: ReactNode }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="sm:hidden w-full flex items-center justify-between gap-2 text-sm font-semibold py-1"
      >
        <span className="flex items-center gap-2">
          <span aria-hidden className="text-base leading-none">
            ☰
          </span>
          Filtros de búsqueda
        </span>
        <span aria-hidden className="text-xs opacity-60">
          {abierto ? 'Ocultar ▲' : 'Mostrar ▼'}
        </span>
      </button>

      <div className={`mt-3 sm:mt-0 ${abierto ? 'block' : 'hidden sm:block'}`}>{children}</div>
    </div>
  )
}
