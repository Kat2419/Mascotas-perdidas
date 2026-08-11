type Props = {
  texto: string
  url: string
}

export function WhatsappShareButton({ texto, url }: Props) {
  const mensaje = `${texto} ${url}`
  const href = `https://wa.me/?text=${encodeURIComponent(mensaje)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-md bg-emerald-600 text-white text-sm font-medium px-3 py-2 hover:bg-emerald-700 transition-colors"
    >
      Compartir por WhatsApp
    </a>
  )
}
