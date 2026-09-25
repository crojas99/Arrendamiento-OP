import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Encabezado, Paginacion, limpiarBusqueda } from '@/components/ui';
import { TIPOS_CLIENTE } from '@/lib/format';

export const dynamic = 'force-dynamic';
const POR_PAGINA = 50;

export default async function Clientes({ searchParams }) {
  const sp = searchParams || {};
  const pagina = Math.max(1, Number(sp.pagina) || 1);
  const supabase = createClient();

  let q = supabase.from('clientes')
    .select('cod_cliente, nombre, tipo_cliente, ruc, cedula, telefonos, medio_pago', { count: 'exact' })
    .order('nombre')
    .range((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA - 1);
  const texto = limpiarBusqueda(sp.q);
  if (texto) {
    const filtros = ['nombre', 'ruc', 'cedula'].map((c) => `${c}.ilike.%${texto}%`);
    if (/^-?\d+$/.test(texto)) filtros.push(`cod_cliente.eq.${texto}`);
    q = q.or(filtros.join(','));
  }
  if (sp.tipo) q = q.eq('tipo_cliente', sp.tipo);
  const { data: filas, count, error } = await q;
  const params = Object.fromEntries(Object.entries(sp).filter(([k]) => k !== 'pagina'));

  return (
    <>
      <Encabezado titulo="Clientes" detalle="Datos generales y contratos de cada cliente.">
        <Link className="btn" href="/clientes/nuevo">Registrar cliente</Link>
      </Encabezado>
      <form className="mb-4 flex flex-wrap gap-3 rounded-lg border border-linea bg-white p-4" method="get">
        <input className="input max-w-md" name="q" defaultValue={sp.q || ''} placeholder="Nombre, RUC, cédula o código" />
        <select className="input max-w-[200px]" name="tipo" defaultValue={sp.tipo || ''}>
          <option value="">Todos los tipos</option>
          {TIPOS_CLIENTE.map((t) => <option key={t}>{t}</option>)}
        </select>
        <button className="btn" type="submit">Buscar</button>
      </form>
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">No se pudieron cargar los clientes: {error.message}</p>}
      <div className="overflow-x-auto rounded-lg border border-linea bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-linea text-left text-xs text-niebla">
            <tr>
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">RUC / cédula</th>
              <th className="px-4 py-3 font-medium">Teléfonos</th>
              <th className="px-4 py-3 font-medium">Medio de pago</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-linea">
            {(filas || []).map((c) => (
              <tr key={c.cod_cliente} className="hover:bg-papel">
                <td className="px-4 py-2.5 text-niebla">{c.cod_cliente}</td>
                <td className="px-4 py-2.5"><Link className="font-medium text-tinta hover:underline" href={`/clientes/${c.cod_cliente}`}>{c.nombre}</Link></td>
                <td className="px-4 py-2.5">{c.tipo_cliente}</td>
                <td className="px-4 py-2.5">{c.ruc || c.cedula || '—'}</td>
                <td className="max-w-[200px] truncate px-4 py-2.5">{c.telefonos || '—'}</td>
                <td className="px-4 py-2.5">{c.medio_pago || '—'}</td>
              </tr>
            ))}
            {filas && filas.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-niebla">No hay clientes con esa búsqueda.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Paginacion pagina={pagina} total={count || 0} porPagina={POR_PAGINA} params={params} />
    </>
  );
}
