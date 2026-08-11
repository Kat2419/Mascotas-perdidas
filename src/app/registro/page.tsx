import { RegistroForm } from '@/components/registro-form'

export default function RegistroPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold mb-6">Crear cuenta</h1>
      <RegistroForm />
    </div>
  )
}
