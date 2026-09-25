# Arrendamiento OP

App web interna para administrar los contratos de arrendamiento.
Next.js (App Router) + Supabase + Tailwind. Se publica en Vercel.

## Módulos (fase 1)
- Inicio de sesión (solo usuarios creados en Supabase)
- Contratos: listado con filtros y ficha de generalidades
- Apertura de contrato
- Clientes: listado, ficha y registro

## Variables de entorno (Vercel → Settings → Environment Variables)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Importante
No crear una carpeta `supabase/` en este repositorio sin coordinarlo:
la integración de GitHub en Supabase aplicaría esos archivos a la base de datos de producción.
