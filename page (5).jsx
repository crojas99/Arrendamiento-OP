import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Encabezado, Estado, Placa, Paginacion, limpiarBusqueda } from '@/components/ui';
import { cordobas, fecha, PROGRAMAS, SUCURSALES, VIGENCIAS } from '@/lib/format';

export const dynamic = 'force-dynamic';
const POR_PAGINA = 50;
const ABIERTOS = ['Vigente', 'Próximo a vencer', 'Vencido'];

export default async function Contratos({ searchParams }) {
  const sp = searchParams || {};
  const pagina = Math.max(1, Number(sp.pagina) || 1);
  const estado = sp.estado ?? 'abiertos';
  const supabase = createClient();

  let q = supabase
    .from('v_contratos')
    .select('id, correlativo, contrato_leas, contrato_nuevo, cliente, placa, marca, modelo, programa, sucursal, fecha_inicio, fecha_cierre, cuota_mensual, estado_vigencia', { count: 'exact' })
    .order('fecha_cierre', { ascending: true })
    .range((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA - 1);

  if (estado === 'abiertos') q = q.in('estado_vigencia', ABIERTOS);
  else if (estado) q = q.eq('estado_vigencia', estado);
  if (sp.programa) q = q.eq('programa', sp.programa);
  if (sp.sucursal) q = q.eq('sucursal', sp.sucursal);
  const texto = limpiarBusqueda(sp.q);
  if (texto) {
    q = q.or(['cliente', 'placa', 'chasis', 'contrato_leas', 'contrato_nuevo'].map((c) => `${c}.ilike.%${texto}%`).join(','));
  }

  const [{ data: filas, count, error }, ...conteos] = await Promise.all([
    q,
    ...ABIERTOS.map((v) => supabase.from('v_contratos').select('id', { count: 'exact', head: true }).eq('estado_vigencia', v)),
  ]);

  const params = Object.fromEntries(Object.entries(sp).filter(([k, v]) => k !== 'pagina' && v !== undefined));

  return (
    <>
      <Encabezado titulo="Contratos" detalle="Unidades arrendadas, ordenadas por fecha de cierre.">
        <Link className="btn" href="/contratos/nuevo">Abrir contrato</Link>
      </Encabezado>

      <div className="mb-6 grid grid-cols-3 gap-3">
        {ABIERTOS.map((v, i) => (
          <Link key={v} href={`?estado=${encodeURIComponent(v)}`}
            className={`rounded-lg border bg-white px-4 py-3 hover:border-tinta/40 ${estado === v ? 'border-tinta' : 'border-linea'}`}>
            <p className="text-2xl font-semibold">{(conteos[i].count ?? 0).toLocaleString('en-US')}</p>
            <p className="text-sm text-niebla">{v}</p>
          </Link>
        ))}
      </div>

      <form className="mb-4 grid gap-3 rounded-lg border border-linea bg-white p-4 md:grid-cols-5" method="get">
        <input className="input md:col-span-2" name="q" defaultValue={sp.q || ''} placeholder="Cliente, placa, chasis o número de contrato" />
        <select className="input" name="estado" defaultValue={estado}>
          <option value="abiertos">Abiertos (todos)</option>
          {VIGENCIAS.map((v) => <option key={v} value={v}>{v}</option>)}
          <option value="">Todos los estados</option>
        </select>
        <select className="input" name="programa" defaultValue={sp.programa || ''}>
          <option value="">Todos los programas</option>
          {PROGRAMAS.map((p) => <option key={p}>{p}</option>)}
        </select>
        <div className="flex gap-2">
          <select className="input" name="sucursal" defaultValue={sp.sucursal || ''}>
            <option value="">Todas las sucursales</option>
            {SUCURSALES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button className="btn" type="submit">Filtrar</button>
        </div>
      </form>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">No se pudieron cargar los contratos: {error.message}</p>}

      <div className="overflow-x-auto rounded-lg border border-linea bg-white">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-linea text-left text-xs text-niebla">
            <tr>
              <th className="px-4 py-3 font-medium">Contrato</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Vehículo</th>
              <th className="px-4 py-3 font-medium">Programa</th>
              <th className="px-4 py-3 font-medium">Inicio</th>
              <th className="px-4 py-3 font-medium">Cierre</th>
              <th className="px-4 py-3 text-right font-medium">Cuota mensual</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-linea">
            {(filas || []).map((c) => (
              <tr key={c.id} className="hover:bg-papel">
                <td className="px-4 py-2.5">
                  <Link className="font-medium text-tinta hover:underline" href={`/contratos/${c.id}`}>
                    {c.contrato_nuevo || c.contrato_leas || `#${c.correlativo ?? '—'}`}
                  </Link>
                </td>
                <td className="max-w-[240px] truncate px-4 py-2.5">{c.cliente}</td>
                <td className="px-4 py-2.5"><Placa valor={c.placa} /> <span className="ml-1 text-niebla">{c.marca} {c.modelo}</span></td>
                <td className="px-4 py-2.5">{c.programa}</td>
                <td className="px-4 py-2.5">{fecha(c.fecha_inicio)}</td>
                <td className="px-4 py-2.5">{fecha(c.fecha_cierre)}</td>
                <td className="px-4 py-2.5 text-right">{cordobas(c.cuota_mensual)}</td>
                <td className="px-4 py-2.5"><Estado valor={c.estado_vigencia} /></td>
              </tr>
            ))}
            {filas && filas.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-niebla">Ningún contrato coincide con estos filtros. Prueba quitando alguno.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Paginacion pagina={pagina} total={count || 0} porPagina={POR_PAGINA} params={params} />
    </>
  );
}
