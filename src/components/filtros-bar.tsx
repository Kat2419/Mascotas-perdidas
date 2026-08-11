'use client'

import { useState, type ReactNode } from 'react'
import { DEPARTAMENTOS, DEPARTAMENTOS_CIUDADES, TIPOS_MASCOTA, TIPOS_PUBLICACION } from '@/lib/constants'

type Props = {
  defaults: {
    departamento: string
    ciudad: string
    tipo: string
    mascota: string
  }
}

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <details open className="group border-b border-black/10 dark:border-white/10 pb-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold">
        {titulo}
        <span className="transition-transform group-open:rotate-45 text-lg leading-none opacity-60">
          +
        </span>
      </summary>
      <div className="mt-3 flex flex-col gap-2">{children}</div>
    </details>
  )
}

function OpcionRadio({
  nombre,
  valor,
  etiqueta,
  defaultChecked,
}: {
  nombre: string
  valor: string
  etiqueta: string
  defaultChecked: boolean
}) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80">
      <input type="radio" name={nombre} value={valor} defaultChecked={defaultChecked} />
      {etiqueta}
    </label>
  )
}

export function FiltrosBar({ defaults }: Props) {
  const [departamento, setDepartamento] = useState(defaults.departamento)

  return (
    <form method="get" className="flex flex-col gap-4">
      <Seccion titulo="Departamento">
        <label className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80">
          <input
            type="radio"
            name="dep"
            value=""
            defaultChecked={!defaults.departamento}
            onChange={() => setDepartamento('')}
          />
          Todos
        </label>
        {DEPARTAMENTOS.map((d) => (
          <label key={d} className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80">
            <input
              type="radio"
              name="dep"
              value={d}
              defaultChecked={defaults.departamento === d}
              onChange={() => setDepartamento(d)}
            />
            {d}
          </label>
        ))}
      </Seccion>

      <Seccion titulo="Ciudad">
        <select
          id="ciudad"
          name="ciudad"
          defaultValue={defaults.ciudad}
          className="rounded-md border border-black/15 dark:border-white/15 bg-transparent px-2 py-2 text-sm"
        >
          <option value="">Todas</option>
          {departamento ? (
            DEPARTAMENTOS_CIUDADES[departamento]?.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))
          ) : (
            DEPARTAMENTOS.map((dep) => (
              <optgroup key={dep} label={dep}>
                {DEPARTAMENTOS_CIUDADES[dep].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </optgroup>
            ))
          )}
        </select>
      </Seccion>

      <Seccion titulo="Tipo de mascota">
        <OpcionRadio nombre="mascota" valor="" etiqueta="Todas" defaultChecked={!defaults.mascota} />
        {TIPOS_MASCOTA.map((t) => (
          <OpcionRadio
            key={t.valor}
            nombre="mascota"
            valor={t.valor}
            etiqueta={t.etiqueta}
            defaultChecked={defaults.mascota === t.valor}
          />
        ))}
      </Seccion>

      <Seccion titulo="Estoy buscando">
        <OpcionRadio nombre="tipo" valor="" etiqueta="Perdidos y encontrados" defaultChecked={!defaults.tipo} />
        {TIPOS_PUBLICACION.map((t) => (
          <OpcionRadio
            key={t.valor}
            nombre="tipo"
            valor={t.valor}
            etiqueta={t.valor === 'perdido' ? 'Mascotas perdidas' : 'Mascotas encontradas'}
            defaultChecked={defaults.tipo === t.valor}
          />
        ))}
      </Seccion>

      <button
        type="submit"
        className="rounded-md bg-orange-600 text-white text-sm font-medium px-4 py-2 hover:bg-orange-700 transition-colors"
      >
        Filtrar
      </button>
    </form>
  )
}
