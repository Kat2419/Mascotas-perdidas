import { RecuperarForm } from '@/components/recuperar-form'

export default function RecuperarPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold mb-2">Recuperar contraseña</h1>
      <p className="text-sm opacity-70 mb-6 max-w-sm">
        Te enviaremos un link a tu correo para que puedas poner una contraseña nueva.
      </p>
      <RecuperarForm />
    </div>
  )
}
