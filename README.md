# Mascotas Perdidas Colombia — Terremoto 2026

Sitio comunitario para publicar y buscar mascotas perdidas/encontradas tras el terremoto en Chocó, Antioquia, Valle del Cauca, Cauca, Risaralda, Quindío y Caldas.

- **Frontend:** Next.js 16 (App Router) + Tailwind CSS
- **Backend/DB/Auth/Storage:** Supabase (Postgres + autenticación + almacenamiento de fotos)
- **Hosting recomendado:** Vercel (frontend) + Supabase (todo lo demás)

## 1. Crear el proyecto de Supabase

1. Ve a [supabase.com](https://supabase.com) → **New project** (capa gratuita es suficiente para empezar).
2. Cuando esté listo, entra a **SQL Editor** → pega el contenido de [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
   Esto crea las tablas (`profiles`, `publicaciones`, `respuestas`, `reportes`), sus índices, las reglas de seguridad (RLS) y el bucket de Storage `fotos-mascotas` para las fotos.
3. Ve a **Project Settings → API** y copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Completa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` con los valores del paso anterior.

## 3. Login y recuperación de contraseña (sin configuración adicional)

El login con correo/contraseña, y "¿Olvidaste tu contraseña?" (que manda un link de recuperación
por correo), **ya funcionan de una vez** — usan el servicio de email gratis que trae Supabase
incluido, sin necesitar SMTP propio ni tocar plantillas.

**Nota sobre límites gratis:** el envío de correos de Supabase en el plan gratuito tiene un límite
bajo por hora (uso compartido entre proyectos). Si esperas mucho volumen de registros/recuperaciones
durante la emergencia, considera configurar un SMTP propio (por ejemplo [Resend](https://resend.com),
gratis hasta cierto volumen) en **Project Settings → Auth → SMTP Settings**.

Opcionalmente puedes activar **Google** como método adicional (por ejemplo para el equipo
administrador): crea credenciales **OAuth 2.0 Client ID** en [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
agrega la URL de callback que te muestra Supabase en **Authentication → Providers → Google**, copia
el Client ID/Secret ahí, y cambia `GOOGLE_AUTH_ENABLED` a `true` en [`src/lib/constants.ts`](src/lib/constants.ts).

## 4. Moderación automática de fotos (opcional pero recomendado)

Por defecto, cualquier foto se publica sin revisión automática (solo queda el botón "Reportar publicación" para que la comunidad marque contenido inapropiado).

Para bloquear automáticamente fotos con contenido sexual, ofensivo o violento **antes** de publicarlas:

1. Crea una cuenta gratuita en [sightengine.com](https://sightengine.com) (~2000 revisiones/mes gratis).
2. Copia tu `API User` y `API Secret` a `SIGHTENGINE_API_USER` / `SIGHTENGINE_API_SECRET` en `.env.local`.

La lógica ya está implementada en [`src/lib/moderation.ts`](src/lib/moderation.ts) — no necesitas tocar nada más.

## 5. Correr en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 6. Desplegar en producción (Vercel)

1. Sube este proyecto a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com) → **Add New Project** → importa el repositorio.
3. Agrega las mismas variables de entorno de `.env.local` (incluyendo `NEXT_PUBLIC_SITE_URL` con tu dominio real, ej. `https://mascotas-perdidas.vercel.app`) en **Settings → Environment Variables**.
4. En Supabase, ve a **Authentication → URL Configuration** y agrega tu dominio de Vercel tanto en `Site URL` como en `Redirect URLs` (necesario para la confirmación de correo y, si lo activaste, el login con Google).
5. Deploy. Vercel te da HTTPS y CDN global automáticamente — importante para que las fotos carguen rápido en todo el país.

## Decisiones de diseño pensadas para velocidad

- Las fotos se **comprimen en el navegador** antes de subirse (máx. ~1MB, 1600px), así los formularios se envían rápido incluso con conexión débil tras la emergencia.
- El listado y los filtros funcionan con un `<form method="get">` normal — **no dependen de JavaScript** para filtrar, así cargan rápido y funcionan incluso en navegadores/redes limitadas.
- Las imágenes se sirven optimizadas automáticamente (`next/image`, WebP, tamaños responsivos) desde el storage de Supabase.
- Paginación de 24 publicaciones por página con índices en Postgres sobre `(departamento, ciudad)`, `tipo_mascota` y `estado` para que los filtros respondan rápido incluso con miles de publicaciones.
- Cada publicación tiene un botón de **"Compartir por WhatsApp"** con la foto y el link — es el canal que más tráfico mueve en Colombia.
- Los comentarios son de **texto libre** (con sugerencias rápidas tipo "La vi", "La tengo yo" que solo autocompletan el cuadro de texto, no lo limitan), para que la gente pueda dar cualquier detalle útil.

## Ideas para siguientes iteraciones

- Vista de mapa con pines por ciudad.
- Alertas por correo/WhatsApp cuando aparece una publicación que coincide con un filtro guardado.
- Panel de administración simple para revisar la tabla `reportes` y ocultar publicaciones.
- Progressive Web App (ícono en pantalla de inicio) para acceso más rápido desde el celular.
