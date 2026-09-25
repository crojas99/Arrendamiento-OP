'use server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const txt = (f, k) => { const v = String(f.get(k) ?? '').trim(); return v === '' ? null : v; };
const num = (f, k) => { const v = txt(f, k); return v == null ? null : Number(v); };

export async function abrirContrato(_prev, f) {
  const supabase = createClient();

  // 1. Vehículo: existente (por chasis) o nuevo
  let vehiculoId = null;
  if (f.get('vehiculo_modo') === 'nuevo') {
    const nuevo = {
      chasis: txt(f, 'chasis'), placa: txt(f, 'placa'), motor: txt(f, 'motor'),
      marca: txt(f, 'marca'), modelo: txt(f, 'modelo'), modelo_fabrica: txt(f, 'modelo_fabrica'),
      anio: num(f, 'anio'), color: txt(f, 'color'), num_activo: txt(f, 'num_activo'),
      costo_usd: num(f, 'costo_usd'), precio_usd: num(f, 'precio_usd'),
    };
    if (!nuevo.chasis || !nuevo.marca || !nuevo.modelo) return { error: 'Para un vehículo nuevo, el chasis, la marca y el modelo son obligatorios.' };
    const { data, error } = await supabase.from('vehiculos').insert(nuevo).select('id').single();
    if (error) return { error: error.code === '23505' ? 'Ya existe un vehículo con ese chasis. Selecciónalo como vehículo existente.' : `No se pudo guardar el vehículo: ${error.message}` };
    vehiculoId = data.id;
  } else {
    const chasis = txt(f, 'chasis_existente');
    if (!chasis) return { error: 'Selecciona el vehículo por su chasis.' };
    const { data } = await supabase.from('vehiculos').select('id').eq('chasis', chasis).maybeSingle();
    if (!data) return { error: `No hay ningún vehículo con el chasis ${chasis}. Revisa el dato o regístralo como vehículo nuevo.` };
    vehiculoId = data.id;
  }

  // 2. Contrato
  const contrato = {
    cod_cliente: num(f, 'cod_cliente'),
    vehiculo_id: vehiculoId,
    contrato_leas: txt(f, 'contrato_leas'), contrato_nuevo: txt(f, 'contrato_nuevo'), und: txt(f, 'und'),
    programa: txt(f, 'programa'), cartera: txt(f, 'cartera'), tipo_contrato: txt(f, 'tipo_contrato'),
    sucursal: txt(f, 'sucursal'), vendedor_auto: txt(f, 'vendedor_auto'), vendedor_va: txt(f, 'vendedor_va'),
    medio_pago: txt(f, 'medio_pago'), dia_debito: num(f, 'dia_debito'),
    fecha_inicio: txt(f, 'fecha_inicio'), plazo_meses: num(f, 'plazo_meses'), extension_meses: num(f, 'extension_meses') ?? 0,
    limite_km_anual: num(f, 'limite_km_anual'), km_anual_pmp: num(f, 'km_anual_pmp'), penalidad_km: num(f, 'penalidad_km') ?? 0,
    anticipo_pct: num(f, 'anticipo_pct') == null ? null : num(f, 'anticipo_pct') / 100,
    anticipo: num(f, 'anticipo'), deposito: num(f, 'deposito') ?? 0,
    canon: num(f, 'canon') ?? 0, seguro: num(f, 'seguro') ?? 0, gps: num(f, 'gps') ?? 0,
    vehiculo_sustituto: num(f, 'vehiculo_sustituto') ?? 0, llantas_baterias: num(f, 'llantas_baterias') ?? 0, pmp: num(f, 'pmp') ?? 0,
    valor_residual: num(f, 'valor_residual'), monto_estimado_venta_usd: num(f, 'monto_estimado_venta_usd'),
    comentarios: txt(f, 'comentarios'),
    estado: 'Pendiente de firma',
  };
  if (!contrato.cod_cliente) return { error: 'Selecciona el cliente.' };
  if (!contrato.fecha_inicio || !contrato.plazo_meses) return { error: 'La fecha de inicio y el plazo son obligatorios.' };

  const { data, error } = await supabase.from('contratos').insert(contrato).select('id').single();
  if (error) return { error: `No se pudo abrir el contrato: ${error.message}` };
  redirect(`/contratos/${data.id}`);
}
