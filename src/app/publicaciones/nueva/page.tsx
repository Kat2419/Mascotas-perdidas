import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NuevaPublicacionForm } from '@/components/nueva-publicacion-form'

export default async function NuevaPublicacionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/publicaciones/nueva')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-1">Publicar mascota</h1>
      <p className="text-sm opacity-70 mb-6">
        Entre más detalles y una buena foto, más rápido la puede reconocer alguien.
      </p>
      <NuevaPublicacionForm />
    </div>
  )
}
