-- Esquema para "Mascotas Perdidas Colombia"
-- Ejecutar en el SQL Editor de tu proyecto de Supabase (https://app.supabase.com)

-- ============================================================
-- 1. PERFILES (extiende auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null default 'Usuario',
  whatsapp text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Perfiles visibles para todos"
  on public.profiles for select
  using (true);

create policy "Un usuario puede crear su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Un usuario puede editar su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Crea el perfil automáticamente cuando alguien se registra
-- (funciona tanto para registro por correo como por Google OAuth)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nombre, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. PUBLICACIONES (reportes de mascota perdida / encontrada)
-- ============================================================
create table if not exists public.publicaciones (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.profiles (id) on delete cascade,
  tipo text not null check (tipo in ('perdido', 'encontrado')),
  estado text not null default 'activa' check (estado in ('activa', 'reunido', 'cerrada')),
  tipo_mascota text not null check (tipo_mascota in ('perro', 'gato', 'conejo', 'otro')),
  nombre_mascota text,
  raza text,
  descripcion text not null,
  foto_url text,
  foto_moderada boolean not null default false,
  departamento text not null,
  ciudad text not null,
  direccion_referencia text,
  contacto_whatsapp text,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

-- Índices para que los filtros (departamento/ciudad, tipo de mascota, estado) sean rápidos
create index if not exists idx_publicaciones_depto_ciudad on public.publicaciones (departamento, ciudad);
create index if not exists idx_publicaciones_tipo_mascota on public.publicaciones (tipo_mascota);
create index if not exists idx_publicaciones_tipo on public.publicaciones (tipo);
create index if not exists idx_publicaciones_estado on public.publicaciones (estado);
create index if not exists idx_publicaciones_created_at on public.publicaciones (created_at desc);
-- Índice combinado para el caso más común: publicaciones activas ordenadas por fecha
create index if not exists idx_publicaciones_activas on public.publicaciones (estado, created_at desc);

alter table public.publicaciones enable row level security;

create policy "Publicaciones visibles para todos"
  on public.publicaciones for select
  using (true);

create policy "Usuarios autenticados pueden publicar"
  on public.publicaciones for insert
  with check (auth.uid() = usuario_id);

create policy "El autor puede editar su publicación"
  on public.publicaciones for update
  using (auth.uid() = usuario_id);

create policy "El autor puede borrar su publicación"
  on public.publicaciones for delete
  using (auth.uid() = usuario_id);

-- ============================================================
-- 3. RESPUESTAS ("yo lo vi", "yo lo tengo", etc.)
-- ============================================================
create table if not exists public.respuestas (
  id uuid primary key default gen_random_uuid(),
  publicacion_id uuid not null references public.publicaciones (id) on delete cascade,
  usuario_id uuid not null references public.profiles (id) on delete cascade,
  mensaje text not null,
  foto_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_respuestas_publicacion on public.respuestas (publicacion_id, created_at);

alter table public.respuestas enable row level security;

create policy "Respuestas visibles para todos"
  on public.respuestas for select
  using (true);

create policy "Usuarios autenticados pueden responder"
  on public.respuestas for insert
  with check (auth.uid() = usuario_id);

create policy "El autor puede borrar su respuesta"
  on public.respuestas for delete
  using (auth.uid() = usuario_id);

-- ============================================================
-- 4. REPORTES (moderación / contenido inapropiado)
-- ============================================================
create table if not exists public.reportes (
  id uuid primary key default gen_random_uuid(),
  publicacion_id uuid not null references public.publicaciones (id) on delete cascade,
  usuario_id uuid references public.profiles (id) on delete set null,
  motivo text not null,
  created_at timestamptz not null default now()
);

alter table public.reportes enable row level security;

create policy "Usuarios autenticados pueden reportar"
  on public.reportes for insert
  with check (auth.uid() = usuario_id);

-- Nota: por diseño, nadie puede leer la tabla "reportes" desde el cliente
-- (ninguna policy de select). Revísala desde el Table Editor de Supabase
-- con tu rol de administrador, o crea una policy de select restringida
-- a un uid de administrador si prefieres construir un panel de moderación.

-- ============================================================
-- 5. STORAGE: bucket público para las fotos de mascotas
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos-mascotas', 'fotos-mascotas', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Fotos de mascotas visibles para todos"
  on storage.objects for select
  using (bucket_id = 'fotos-mascotas');

create policy "Usuarios autenticados pueden subir fotos"
  on storage.objects for insert
  with check (bucket_id = 'fotos-mascotas' and auth.role() = 'authenticated');

create policy "El dueño puede borrar su foto"
  on storage.objects for delete
  using (bucket_id = 'fotos-mascotas' and owner = auth.uid());
