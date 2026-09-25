import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Encabezado, Seccion, Dato, Estado, Placa } from '@/components/ui';
import { cordobas, dolares, fecha, numero, pct } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function Contrato({ params }) {
  const supabase = createClient();
  const { data: c } = await supabase.from('v_contratos').select('*').eq('id', params.id).maybeSingle();
  if (!c) notFound();

  const [{ data: cl }, { data: v }, { data: anterior }] = await Promise.all([
    supabase.from('clientes').select('*').eq('cod_cliente', c.cod_cliente).single(),
    supabase.from('vehiculos').select('*').eq('id', c.vehiculo_id).single(),
    c.contrato_anterior_id
      ? supabase.from('v_contratos').select('id, contrato_leas, contrato_nuevo, correlativo, fecha_inicio').eq('id', c.contrato_anterior_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const t = Number(c.tasa_cambio);
  const usd = (x) => (x == null ? null : Number(x) / t);
  const conceptos = [
    ['Canon', c.canon], ['Seguro', c.seguro], ['GPS', c.gps], ['Vehículo sustituto', c.vehiculo_sustituto],
    ['Llantas y baterías', c.llantas_baterias], ['PMP', c.pmp],
  ];
  const numeroContrato = c.contrato_nuevo || c.contrato_leas || `#${c.correlativo ?? '—'}`;

  return (
    <>
      <Link href="/contratos" className="text-sm text-niebla hover:text-grafito">Contratos</Link>
      <Encabezado titulo={`Contrato ${numeroContrato}`} detalle={`${c.cliente} · ${c.marca} ${c.modelo}`}>
        <Estado valor={c.estado_vigencia} />
      </Encabezado>

      <div className="grid gap-5 lg:grid-cols-3">
        <Seccion titulo="Generalidades" className="lg:col-span-2">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
            <Dato etiqueta="Fecha de inicio">{fecha(c.fecha_inicio)}</Dato>
            <Dato etiqueta="Plazo">{c.plazo_meses} meses</Dato>
            <Dato etiqueta="Fecha fin">{fecha(c.fecha_fin)}</Dato>
            <Dato etiqueta="Extensión">{c.extension_meses ? `${c.extension_meses} meses` : 'Sin extensión'}</Dato>
            <Dato etiqueta="Fecha de cierre">{fecha(c.fecha_cierre)}</Dato>
            <Dato etiqueta="Cierre real">{fecha(c.fecha_real_cierre)}</Dato>
            <Dato etiqueta="Programa">{c.programa}</Dato>
            <Dato etiqueta="Cartera">{c.cartera}</Dato>
            <Dato etiqueta="Tipo">{c.tipo_contrato}</Dato>
            <Dato etiqueta="Sucursal">{c.sucursal}</Dato>
            <Dato etiqueta="Vendedor auto">{c.vendedor_auto}</Dato>
            <Dato etiqueta="Vendedor VA">{c.vendedor_va}</Dato>
            <Dato etiqueta="Medio de pago">{c.medio_pago}</Dato>
            <Dato etiqueta="Día de débito">{c.dia_debito || '—'}</Dato>
            <Dato etiqueta="Contrato firmado">{c.firma_contrato ? 'Sí' : 'No'}</Dato>
            <Dato etiqueta="Contrato agrupador">{c.contrato_leas}</Dato>
          </dl>
          {anterior && (
            <p className="mt-5 text-sm">Renovación de{' '}
              <Link className="font-medium text-tinta hover:underline" href={`/contratos/${anterior.id}`}>
                {anterior.contrato_nuevo || anterior.contrato_leas || `#${anterior.correlativo}`}
              </Link>{' '}(inició {fecha(anterior.fecha_inicio)})
            </p>
          )}
          {c.comentarios && <p className="mt-5 whitespace-pre-line rounded-md bg-papel p-3 text-sm">{c.comentarios}</p>}
        </Seccion>

        <Seccion titulo="Cliente">
          <Link className="text-base font-semibold text-tinta hover:underline" href={`/clientes/${cl?.cod_cliente}`}>{cl?.nombre}</Link>
          <dl className="mt-4 grid gap-3">
            <Dato etiqueta="Código">{cl?.cod_cliente}</Dato>
            <Dato etiqueta="Tipo">{cl?.tipo_cliente}</Dato>
            <Dato etiqueta="RUC / cédula">{cl?.ruc || cl?.cedula}</Dato>
            <Dato etiqueta="Representante">{cl?.representante}</Dato>
            <Dato etiqueta="Teléfonos">{cl?.telefonos}</Dato>
            <Dato etiqueta="Correos"><span className="break-all">{cl?.correos}</span></Dato>
          </dl>
        </Seccion>

        <Seccion titulo="Condiciones económicas" className="lg:col-span-2">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-niebla">
              <tr><th className="pb-2 font-medium">Concepto mensual</th><th className="pb-2 text-right font-medium">Córdobas</th><th className="pb-2 text-right font-medium">Dólares</th></tr>
            </thead>
            <tbody className="divide-y divide-linea">
              {conceptos.map(([n, val]) => (
                <tr key={n}><td className="py-1.5">{n}</td><td className="py-1.5 text-right">{cordobas(val)}</td><td className="py-1.5 text-right text-niebla">{dolares(usd(val))}</td></tr>
              ))}
              <tr><td className="py-1.5">Subtotal</td><td className="py-1.5 text-right">{cordobas(c.subtotal_cuota)}</td><td className="py-1.5 text-right text-niebla">{dolares(usd(c.subtotal_cuota))}</td></tr>
              <tr><td className="py-1.5">IVA ({pct(c.iva_pct)})</td><td className="py-1.5 text-right">{cordobas(c.iva)}</td><td className="py-1.5 text-right text-niebla">{dolares(usd(c.iva))}</td></tr>
              <tr className="font-semibold"><td className="py-2">Cuota mensual</td><td className="py-2 text-right">{cordobas(c.cuota_mensual)}</td><td className="py-2 text-right">{dolares(c.cuota_mensual_usd)}</td></tr>
            </tbody>
          </table>
          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-linea pt-4 md:grid-cols-4">
            <Dato etiqueta="Anticipo">{cordobas(c.anticipo)}{c.anticipo_pct != null && <span className="text-niebla"> ({pct(c.anticipo_pct)})</span>}</Dato>
            <Dato etiqueta="Depósito">{cordobas(c.deposito)}</Dato>
            <Dato etiqueta="Valor residual">{cordobas(c.valor_residual)}</Dato>
            <Dato etiqueta="Monto total del contrato">{cordobas(c.monto_total_contrato)}</Dato>
          </dl>
          <p className="mt-3 text-xs text-niebla">Dólares calculados a C$ {t} por US$ 1.</p>
        </Seccion>

        <Seccion titulo="Vehículo">
          <Placa valor={v?.placa} />
          <p className="mt-2 text-base font-semibold">{v?.marca} {v?.modelo} {v?.anio}</p>
          <dl className="mt-4 grid gap-3">
            <Dato etiqueta="Modelo de fábrica">{v?.modelo_fabrica}</Dato>
            <Dato etiqueta="Chasis">{v?.chasis}</Dato>
            <Dato etiqueta="Motor">{v?.motor}</Dato>
            <Dato etiqueta="Color">{v?.color}</Dato>
            <Dato etiqueta="Número de activo">{v?.num_activo}</Dato>
          </dl>
        </Seccion>

        <Seccion titulo="Kilometraje pactado" className="lg:col-span-3">
          <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Dato etiqueta="Límite anual">{numero(c.limite_km_anual)} km</Dato>
            <Dato etiqueta="Total del contrato">{numero(c.km_total_contrato)} km</Dato>
            <Dato etiqueta="Km anual PMP">{numero(c.km_anual_pmp)} km</Dato>
            <Dato etiqueta="Penalidad por km excedido">{cordobas(c.penalidad_km)}</Dato>
          </dl>
          <p className="mt-4 text-xs text-niebla">El recorrido real desde el GPS y el estado de mantenimiento se agregan en la fase de kilometraje.</p>
        </Seccion>
      </div>
    </>
  );
}
