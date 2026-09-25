import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Encabezado } from '@/components/ui';
import ContratoForm from './ContratoForm';

export const dynamic = 'force-dynamic';

export default async function NuevoContrato({ searchParams }) {
  const supabase = createClient();
  const [{ data: clientes }, { data: vehiculos }] = await Promise.all([
    supabase.from('clientes').select('cod_cliente, nombre').eq('activo', true).order('nombre').limit(5000),
    supabase.from('vehiculos').select('chasis, placa, marca, modelo, anio').order('chasis').limit(10000),
  ]);
  return (
    <>
      <Encabezado titulo="Apertura de contrato" detalle="El contrato se crea en estado Pendiente de firma.">
        <Link className="btn-sec" href="/clientes/nuevo?volver=contrato">Registrar cliente nuevo</Link>
      </Encabezado>
      <ContratoForm clientes={clientes || []} vehiculos={vehiculos || []} clienteInicial={searchParams?.cliente || ''} />
    </>
  );
}
