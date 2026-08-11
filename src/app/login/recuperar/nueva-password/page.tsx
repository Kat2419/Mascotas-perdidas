import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NuevaPasswordForm } from '@/components/nueva-password-form'

export default async function NuevaPasswordPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login/recuperar')
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold mb-2">Pon tu contraseña nueva</h1>
      <p className="text-sm opacity-70 mb-6 max-w-sm">
        Ya verificamos tu correo. Escribe la contraseña que quieres usar de ahora en adelante.
      </p>
      <NuevaPasswordForm />
    </div>
  )
}
