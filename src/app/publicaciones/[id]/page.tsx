import Image from 'next/image'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Publicacion, Respuesta } from '@/lib/types'
import { WhatsappShareButton } from '@/components/whatsapp-share-button'
import { ReportButton } from '@/components/report-button'
import { MarcarReunidoButton } from '@/components/marcar-reunido-button'
import { RespuestaForm } from '@/components/respuesta-form'
import { UbicacionMapa } from '@/components/ubicacion-mapa'

const ETIQUETA_TIPO_MASCOTA: Record<string, string> = {
  perro: 'Perro',
  gato: 'Gato',
  conejo: 'Conejo',
  otro: 'Otro',
}

function formatearFecha(fechaISO: string) {
  return new Date(fechaISO).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function FilaDetalle({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className="border-b border-black/10 dark:border-white/10 py-2.5">
      <dt className="text-xs text-neutral-500 dark:text-neutral-400">{etiqueta}</dt>
      <dd className="text-sm font-medium mt-0.5">{children}</dd>
    </div>
  )
}

export default async function PublicacionPage(props: PageProps<'/publicaciones/[id]'>) {
  const { id } = await props.params
  const supabase = await createClient()

  const [{ data: publicacion }, { data: respuestas }, { data: userData }] = await Promise.all([
    supabase.from('publicaciones').select('*, profiles(nombre, avatar_url)').eq('id', id).single(),
    supabase
      .from('respuestas')
      .select('*, profiles(nombre, avatar_url)')
      .eq('publicacion_id', id)
      .order('created_at', { ascending: true }),
    supabase.auth.getUser(),
  ])

  if (!publicacion) {
    notFound()
  }

  const pub = publicacion as Publicacion
  const listaRespuestas = (respuestas ?? []) as Respuesta[]
  const usuario = userData.user
  const esDueño = usuario?.id === pub.usuario_id
  const esPerdido = pub.tipo === 'perdido'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const urlPublicacion = `${siteUrl}/publicaciones/${pub.id}`

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 flex flex-col gap-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-black/5 dark:bg-white/5">
          {pub.foto_url ? (
            <Image
              src={pub.foto_url}
              alt={pub.nombre_mascota ?? 'Foto de mascota'}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">🐾</div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold text-white ${
                esPerdido ? 'bg-red-600' : 'bg-emerald-600'
              }`}
            >
              {esPerdido ? 'Perdido' : 'Encontrado'}
            </span>
            <span className="rounded-full bg-black/10 dark:bg-white/10 px-2.5 py-1 text-xs font-medium">
              {ETIQUETA_TIPO_MASCOTA[pub.tipo_mascota]}
            </span>
            {pub.estado === 'reunido' && (
              <span className="rounded-full bg-black/80 text-white px-2.5 py-1 text-xs font-semibold">
                Reunido 🎉
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold">
            {pub.nombre_mascota || ETIQUETA_TIPO_MASCOTA[pub.tipo_mascota]}
          </h1>

          <dl className="rounded-lg border border-black/10 dark:border-white/10 px-3">
            <FilaDetalle etiqueta="Estado">
              {pub.estado === 'reunido' ? 'Reunido con su familia' : esPerdido ? 'Por localizar' : 'Encontrada / en custodia'}
            </FilaDetalle>
            <FilaDetalle etiqueta="Categoría">Terremoto</FilaDetalle>
            <FilaDetalle etiqueta="Tipo de mascota">{ETIQUETA_TIPO_MASCOTA[pub.tipo_mascota]}</FilaDetalle>
            {pub.raza && <FilaDetalle etiqueta="Raza">{pub.raza}</FilaDetalle>}
            <FilaDetalle etiqueta="Último lugar visto">
              {pub.direccion_referencia ? `${pub.direccion_referencia} - ` : ''}
              {pub.ciudad}, {pub.departamento}
            </FilaDetalle>
            <FilaDetalle etiqueta="Publicado">{formatearFecha(pub.created_at)}</FilaDetalle>
            {pub.profiles?.nombre && (
              <FilaDetalle etiqueta="Publicado por">{pub.profiles.nombre}</FilaDetalle>
            )}
            <div className="py-2.5">
              <dt className="text-xs text-neutral-500 dark:text-neutral-400">Descripción adicional</dt>
              <dd className="text-sm mt-0.5 whitespace-pre-line">{pub.descripcion}</dd>
            </div>
          </dl>

          {pub.lat != null && pub.lng != null && (
            <UbicacionMapa lat={pub.lat} lng={pub.lng} />
          )}

          {pub.contacto_whatsapp && (
            <a
              href={`https://wa.me/57${pub.contacto_whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 text-white text-sm font-medium px-3 py-2 hover:bg-emerald-700 transition-colors w-fit"
            >
              Escribir al contacto por WhatsApp
            </a>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            <WhatsappShareButton
              texto={`${esPerdido ? 'Ayúdame a encontrar' : 'Encontré'} a ${
                pub.nombre_mascota || 'esta mascota'
              } en ${pub.ciudad}, ${pub.departamento}.`}
              url={urlPublicacion}
            />
            {esDueño && pub.estado === 'activa' && (
              <MarcarReunidoButton publicacionId={pub.id} />
            )}
          </div>

          {!esDueño && <ReportButton publicacionId={pub.id} />}
        </div>
      </div>

      <section className="flex flex-col gap-4 border-t border-black/10 dark:border-white/10 pt-6">
        <h2 className="text-lg font-semibold">
          Comentarios {listaRespuestas.length > 0 && `(${listaRespuestas.length})`}
        </h2>

        {listaRespuestas.length === 0 ? (
          <p className="text-sm opacity-60">
            Nadie ha comentado todavía. Si tienes información, sé el primero.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {listaRespuestas.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-black/10 dark:border-white/10 p-3 text-sm"
              >
                <p className="whitespace-pre-line">{r.mensaje}</p>
                {r.foto_url && (
                  <a
                    href={r.foto_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block relative w-32 aspect-square overflow-hidden rounded-lg border border-black/10 dark:border-white/10"
                  >
                    <Image
                      src={r.foto_url}
                      alt="Foto adjunta al comentario"
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </a>
                )}
                <p className="mt-1 text-xs opacity-50">
                  {r.profiles?.nombre ?? 'Alguien'} · {formatearFecha(r.created_at)}
                </p>
              </li>
            ))}
          </ul>
        )}

        <RespuestaForm publicacionId={pub.id} autenticado={Boolean(usuario)} />
      </section>
    </div>
  )
}
