'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { registrarCliente } from './actions';
import { Seccion } from '@/components/ui';
import { TIPOS_CLIENTE, MEDIOS_PAGO } from '@/lib/format';

function Guardar() {
  const { pending } = useFormStatus();
  return <button className="btn" type="submit" disabled={pending}>{pending ? 'Registrando…' : 'Registrar cliente'}</button>;
}

function C({ e, n, ...p }) {
  return <div><label className="label" htmlFor={n}>{e}</label><input className="input" id={n} name={n} {...p} /></div>;
}

export default function ClienteForm({ volver }) {
  const [estado, accion] = useFormState(registrarCliente, null);
  return (
    <form action={accion} className="grid gap-5">
      <input type="hidden" name="volver" value={volver || ''} />
      {estado?.error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">{estado.error}</p>}
      <Seccion titulo="Identificación">
        <div className="grid gap-4 md:grid-cols-3">
          <C e="Código de cliente" n="cod_cliente" type="number" required />
          <C e="Nombre o razón social" n="nombre" required />
          <div>
            <label className="label" htmlFor="tipo_cliente">Tipo de cliente</label>
            <select className="input" id="tipo_cliente" name="tipo_cliente" required defaultValue="">
              <option value="">Seleccionar</option>
              {TIPOS_CLIENTE.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <C e="RUC" n="ruc" />
          <C e="Cédula" n="cedula" />
          <C e="Representante" n="representante" />
          <C e="Cédula del representante" n="cedula_representante" />
        </div>
      </Seccion>
      <Seccion titulo="Contacto y pago">
        <div className="grid gap-4 md:grid-cols-3">
          <C e="Correos (separados por ;)" n="correos" />
          <C e="Teléfonos" n="telefonos" />
          <C e="Dirección" n="direccion" />
          <div>
            <label className="label" htmlFor="medio_pago">Medio de pago</label>
            <select className="input" id="medio_pago" name="medio_pago" defaultValue="">
              <option value="">Seleccionar</option>
              {MEDIOS_PAGO.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <C e="Tarjeta: últimos 4 dígitos" n="tarjeta_ultimos4" inputMode="numeric" maxLength={4} pattern="\d{4}" />
        </div>
        <p className="mt-3 text-xs text-niebla">Por seguridad, la app nunca guarda el número completo de la tarjeta.</p>
      </Seccion>
      <div className="flex justify-end"><Guardar /></div>
    </form>
  );
}
