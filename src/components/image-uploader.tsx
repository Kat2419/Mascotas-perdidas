'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

type Props = {
  name: string
  required?: boolean
}

type Estado = 'vacio' | 'comprimiendo' | 'subiendo' | 'listo' | 'error'

export function ImageUploader({ name, required }: Props) {
  const [estado, setEstado] = useState<Estado>('vacio')
  const [preview, setPreview] = useState<string | null>(null)
  const [fotoUrl, setFotoUrl] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  async function manejarArchivo(archivo: File | undefined) {
    if (!archivo) return
    setErrorMsg('')

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type)) {
      setErrorMsg('Solo se aceptan imágenes JPG, PNG o WEBP.')
      setEstado('error')
      return
    }

    try {
      setEstado('comprimiendo')
      // Comprimimos en el navegador antes de subir: fotos más livianas,
      // subidas más rápidas y menos consumo de datos para quien publica
      // desde una zona con mala conexión.
      const imageCompression = (await import('browser-image-compression')).default
      const comprimida = await imageCompression(archivo, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
      })

      setPreview(URL.createObjectURL(comprimida))
      setEstado('subiendo')

      const supabase = createClient()
      const extension = archivo.name.split('.').pop() || 'jpg'
      const path = `${crypto.randomUUID()}.${extension}`

      const { error } = await supabase.storage
        .from('fotos-mascotas')
        .upload(path, comprimida, { contentType: comprimida.type || archivo.type })

      if (error) {
        setErrorMsg('No se pudo subir la foto. Intenta de nuevo.')
        setEstado('error')
        return
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('fotos-mascotas').getPublicUrl(path)

      setFotoUrl(publicUrl)
      setEstado('listo')
    } catch {
      setErrorMsg('No se pudo procesar la foto. Intenta con otra imagen.')
      setEstado('error')
    }
  }

  function quitarFoto() {
    setPreview(null)
    setFotoUrl('')
    setEstado('vacio')
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={fotoUrl} />

      {preview ? (
        <div className="relative w-40 aspect-square overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
          <Image src={preview} alt="Vista previa" fill className="object-cover" unoptimized />
        </div>
      ) : null}

      <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border border-black/15 dark:border-white/20 px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          required={required && !fotoUrl}
          onChange={(e) => manejarArchivo(e.target.files?.[0])}
        />
        {fotoUrl ? '📷 Cambiar foto' : '📷 Agregar foto'}
      </label>

      {estado === 'comprimiendo' && (
        <p className="text-xs opacity-60">Optimizando la imagen…</p>
      )}
      {estado === 'subiendo' && <p className="text-xs opacity-60">Subiendo foto…</p>}
      {estado === 'listo' && (
        <button
          type="button"
          onClick={quitarFoto}
          className="text-xs text-red-600 hover:underline w-fit"
        >
          Quitar foto
        </button>
      )}
      {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}

      <p className="text-xs opacity-50">
        Evita fotos borrosas, con groserías o contenido inapropiado — se revisan automáticamente
        y pueden ser rechazadas o reportadas por la comunidad.
      </p>
    </div>
  )
}
