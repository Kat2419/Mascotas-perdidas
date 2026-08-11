'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type EstadoAuth = { error?: string; ok?: boolean } | undefined

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

export async function registrarConCorreo(
  _prevState: EstadoAuth,
  formData: FormData
): Promise<EstadoAuth> {
  const nombre = String(formData.get('nombre') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!nombre || !email || !password) {
    return { error: 'Completa tu nombre, correo y contraseña.' }
  }
  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: nombre },
      emailRedirectTo: `${siteUrl()}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Si la confirmación de correo está desactivada en Supabase, signUp ya
  // devuelve una sesión activa y no hace falta pasar por "revisa tu correo".
  if (data.session) {
    revalidatePath('/', 'layout')
    redirect('/')
  }

  redirect('/registro/revisa-tu-correo')
}

export async function iniciarSesionConCorreo(
  _prevState: EstadoAuth,
  formData: FormData
): Promise<EstadoAuth> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Completa tu correo y contraseña.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Correo o contraseña incorrectos.' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

// Recuperar contraseña con el link que Supabase ya envía gratis por
// defecto (sin necesitar SMTP propio). Al abrirlo, /auth/callback crea la
// sesión y manda al usuario a poner su contraseña nueva.
export async function solicitarRecuperacion(
  _prevState: EstadoAuth,
  formData: FormData
): Promise<EstadoAuth> {
  const email = String(formData.get('email') ?? '').trim()

  if (!email) {
    return { error: 'Escribe tu correo.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/auth/callback?next=/login/recuperar/nueva-password`,
  })

  if (error) {
    return { error: 'No pudimos enviar el correo. Intenta de nuevo en unos segundos.' }
  }

  return { ok: true }
}

export async function actualizarPasswordRecuperacion(
  _prevState: EstadoAuth,
  formData: FormData
): Promise<EstadoAuth> {
  const nuevaPassword = String(formData.get('password') ?? '')

  if (nuevaPassword.length < 6) {
    return { error: 'La nueva contraseña debe tener al menos 6 caracteres.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'El link venció. Solicita uno nuevo desde "Olvidaste tu contraseña".' }
  }

  const { error } = await supabase.auth.updateUser({ password: nuevaPassword })
  if (error) {
    return { error: 'No se pudo actualizar la contraseña. Intenta de nuevo.' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function iniciarSesionConGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl()}/auth/callback`,
    },
  })

  if (error || !data.url) {
    redirect('/login?error=google')
  }

  redirect(data.url)
}

export async function cerrarSesion() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
