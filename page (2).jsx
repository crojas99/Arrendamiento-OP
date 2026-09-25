import { Encabezado } from '@/components/ui';
import ClienteForm from './ClienteForm';

export default function NuevoCliente({ searchParams }) {
  return (
    <>
      <Encabezado titulo="Registrar cliente" detalle="Usa el mismo código de cliente que tiene en E1." />
      <ClienteForm volver={searchParams?.volver} />
    </>
  );
}
