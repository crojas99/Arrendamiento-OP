import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Encabezado, Seccion, Dato, Estado, Placa } from '@/components/ui';
import { cordobas, fecha } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function Cliente({ params }) {
  const supabase = createClient();
  const cod = Number(params.cod);
  if (!Number.isFinite(cod)) notFound();
  const [{ data: c }, { data: contratos }] = await Promise.all([
    supabase.from('clientes').select('*').eq('cod_cliente', cod).maybeSingle(),
    supabase.from('v_contratos')
      .select('id, correlativo, contrato_leas, contrato_nuevo, placa, marca, modelo, programa, fecha_inicio, fecha_cierre, cuota_mensual, estado_vigencia')
      .eq('cod_cliente', cod).order('fecha_inicio', { ascending: false }),
  ]);
  if (!c) notFound();
  const abiertos = (contratos || []).filter((x) => ['Vigente', 'Próximo a vencer', 'Vencido'].includes(x.estado_vigencia));
  const cuotaTotal = abiertos.reduce((s, x) => s + Number(x.cuota_mensual || 0), 0);

  return (
    <>
      <Link href="/clientes" className="text-sm text-niebla hover:text-grafito">Clientes</Link>
      <Encabezado titulo={c.nombre} detalle={`Código ${c.cod_cliente} · ${c.tipo_cliente}`}>
        <Link className="btn" href={`/contratos/nuevo?cliente=${c.cod_cliente}`}>Abrir contrato para este cliente</Link>
      </Encabezado>
      <div className="grid gap-5 lg:grid-cols-3">
        <Seccion titulo="Datos del cliente" className="lg:col-span-2">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
            <Dato etiqueta="RUC">{c.ruc}</Dato>
            <Dato etiqueta="Cédula">{c.cedula}</Dato>
            <Dato etiqueta="Medio de pago">{c.medio_pago}{c.tarjeta_ultimos4 && ` terminada en ${c.tarjeta_ultimos4}`}</Dato>
            <Dato etiqueta="Representante">{c.representante}</Dato>
            <Dato etiqueta="Cédula del representante">{c.cedula_representante}</Dato>
            <Dato etiqueta="Teléfonos">{c.telefonos}</Dato>
          </dl>
          <dl className="mt-4 grid gap-4">
            <Dato etiqueta="Correos"><span className="break-all">{c.correos}</span></Dato>
            <Dato etiqueta="Dirección">{c.direccion}</Dato>
          </dl>
        </Seccion>
        <Seccion titulo="Resumen">
          <dl className="grid gap-4">
            <Dato etiqueta="Contratos abiertos">{abiertos.length}</Dato>
            <Dato etiqueta="Cuota mensual total (abiertos)">{cordobas(cuotaTotal)}</Dato>
            <Dato etiqueta="Contratos en historial">{(contratos || []).length}</Dato>
          </dl>
        </Seccion>
      </div>

      <h2 className="mb-3 mt-8 text-base font-semibold">Contratos</h2>
      <div className="overflow-x-auto rounded-lg border border-linea bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-linea text-left text-xs text-niebla">
            <tr>
              <th className="px-4 py-3 font-medium">Contrato</th>
              <th className="px-4 py-3 font-medium">Vehículo</th>
              <th className="px-4 py-3 font-medium">Programa</th>
              <th className="px-4 py-3 font-medium">Inicio</th>
              <th className="px-4 py-3 font-medium">Cierre</th>
              <th className="px-4 py-3 text-right font-medium">Cuota mensual</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-linea">
            {(contratos || []).map((x) => (
              <tr key={x.id} className="hover:bg-papel">
                <td className="px-4 py-2.5"><Link className="font-medium text-tinta hover:underline" href={`/contratos/${x.id}`}>{x.contrato_nuevo || x.contrato_leas || `#${x.correlativo ?? '—'}`}</Link></td>
                <td className="px-4 py-2.5"><Placa valor={x.placa} /> <span className="ml-1 text-niebla">{x.marca} {x.modelo}</span></td>
                <td className="px-4 py-2.5">{x.programa}</td>
                <td className="px-4 py-2.5">{fecha(x.fecha_inicio)}</td>
                <td className="px-4 py-2.5">{fecha(x.fecha_cierre)}</td>
                <td className="px-4 py-2.5 text-right">{cordobas(x.cuota_mensual)}</td>
                <td className="px-4 py-2.5"><Estado valor={x.estado_vigencia} /></td>
              </tr>
            ))}
            {(!contratos || contratos.length === 0) && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-niebla">Este cliente aún no tiene contratos.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
