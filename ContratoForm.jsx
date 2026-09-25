'use client';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { abrirContrato } from './actions';
import { Seccion } from '@/components/ui';
import { cordobas, dolares, TASA_CAMBIO, IVA, PROGRAMAS, CARTERAS, TIPOS_CONTRATO, MEDIOS_PAGO, SUCURSALES } from '@/lib/format';

function Campo({ etiqueta, name, children, className = '', ...props }) {
  return (
    <div className={className}>
      <label className="label" htmlFor={name}>{etiqueta}</label>
      {children || <input className="input" id={name} name={name} {...props} />}
    </div>
  );
}

function Lista({ etiqueta, name, opciones, required = true, defaultValue = '' }) {
  return (
    <Campo etiqueta={etiqueta} name={name}>
      <select className="input" id={name} name={name} required={required} defaultValue={defaultValue}>
        <option value="">Seleccionar</option>
        {opciones.map((o) => <option key={o}>{o}</option>)}
      </select>
    </Campo>
  );
}

function Guardar() {
  const { pending } = useFormStatus();
  return <button className="btn" type="submit" disabled={pending}>{pending ? 'Abriendo contrato…' : 'Abrir contrato'}</button>;
}

const MONTOS = ['canon', 'seguro', 'gps', 'vehiculo_sustituto', 'llantas_baterias', 'pmp'];

export default function ContratoForm({ clientes, vehiculos, clienteInicial }) {
  const [estado, accion] = useFormState(abrirContrato, null);
  const [modo, setModo] = useState('existente');
  const [montos, setMontos] = useState({});
  const [plazo, setPlazo] = useState('');

  const subtotal = MONTOS.reduce((s, k) => s + (Number(montos[k]) || 0), 0);
  const cuota = subtotal * (1 + IVA);

  return (
    <form action={accion} className="grid gap-5">
      {estado?.error && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">{estado.error}</p>}

      <Seccion titulo="Cliente y vehículo">
        <div className="grid gap-4 md:grid-cols-2">
          <Campo etiqueta="Cliente" name="cod_cliente">
            <select className="input" id="cod_cliente" name="cod_cliente" required defaultValue={clienteInicial}>
              <option value="">Seleccionar cliente</option>
              {clientes.map((c) => <option key={c.cod_cliente} value={c.cod_cliente}>{c.nombre} ({c.cod_cliente})</option>)}
            </select>
          </Campo>
          <fieldset>
            <legend className="label">Vehículo</legend>
            <div className="flex gap-4 py-2 text-sm">
              <label className="flex items-center gap-2"><input type="radio" name="vehiculo_modo" value="existente" checked={modo === 'existente'} onChange={() => setModo('existente')} /> Ya registrado</label>
              <label className="flex items-center gap-2"><input type="radio" name="vehiculo_modo" value="nuevo" checked={modo === 'nuevo'} onChange={() => setModo('nuevo')} /> Vehículo nuevo</label>
            </div>
          </fieldset>
        </div>

        {modo === 'existente' ? (
          <Campo className="mt-4" etiqueta="Chasis del vehículo" name="chasis_existente" list="lista-vehiculos" placeholder="Escribe el chasis o la placa" required autoComplete="off">
          </Campo>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <Campo etiqueta="Chasis" name="chasis" required />
            <Campo etiqueta="Placa" name="placa" />
            <Campo etiqueta="Motor" name="motor" />
            <Campo etiqueta="Color" name="color" />
            <Campo etiqueta="Marca" name="marca" required />
            <Campo etiqueta="Modelo" name="modelo" required />
            <Campo etiqueta="Modelo de fábrica" name="modelo_fabrica" />
            <Campo etiqueta="Año" name="anio" type="number" min="1990" max="2100" />
            <Campo etiqueta="Número de activo" name="num_activo" />
            <Campo etiqueta="Costo (US$)" name="costo_usd" type="number" step="0.01" />
            <Campo etiqueta="Precio (US$)" name="precio_usd" type="number" step="0.01" />
          </div>
        )}
        <datalist id="lista-vehiculos">
          {vehiculos.map((v) => <option key={v.chasis} value={v.chasis}>{[v.placa, v.marca, v.modelo, v.anio].filter(Boolean).join(' ')}</option>)}
        </datalist>
      </Seccion>

      <Seccion titulo="Datos del contrato">
        <div className="grid gap-4 md:grid-cols-4">
          <Campo etiqueta="Número de contrato" name="contrato_nuevo" />
          <Campo etiqueta="Contrato agrupador (leasing)" name="contrato_leas" />
          <Lista etiqueta="Programa" name="programa" opciones={PROGRAMAS} />
          <Lista etiqueta="Cartera" name="cartera" opciones={CARTERAS} />
          <Lista etiqueta="Tipo de contrato" name="tipo_contrato" opciones={TIPOS_CONTRATO} defaultValue="Colocación" />
          <Lista etiqueta="Sucursal" name="sucursal" opciones={SUCURSALES} defaultValue="MANAGUA" />
          <Campo etiqueta="Vendedor auto" name="vendedor_auto" />
          <Campo etiqueta="Vendedor VA" name="vendedor_va" />
          <Lista etiqueta="Medio de pago" name="medio_pago" opciones={MEDIOS_PAGO} />
          <Campo etiqueta="Día de débito" name="dia_debito" type="number" min="0" max="31" />
          <Campo etiqueta="Unidad de negocio" name="und" />
        </div>
      </Seccion>

      <Seccion titulo="Plazo y kilometraje">
        <div className="grid gap-4 md:grid-cols-4">
          <Campo etiqueta="Fecha de inicio" name="fecha_inicio" type="date" required />
          <Campo etiqueta="Plazo (meses)" name="plazo_meses" type="number" min="1" required value={plazo} onChange={(e) => setPlazo(e.target.value)} />
          <Campo etiqueta="Extensión (meses)" name="extension_meses" type="number" min="0" defaultValue="0" />
          <div />
          <Campo etiqueta="Límite km anual" name="limite_km_anual" type="number" min="0" required />
          <Campo etiqueta="Km anual PMP" name="km_anual_pmp" type="number" min="0" />
          <Campo etiqueta="Penalidad por km (C$)" name="penalidad_km" type="number" step="0.01" min="0" />
        </div>
      </Seccion>

      <Seccion titulo="Condiciones económicas (C$)">
        <div className="grid gap-4 md:grid-cols-3">
          {[['canon', 'Canon'], ['seguro', 'Seguro'], ['gps', 'GPS'], ['vehiculo_sustituto', 'Vehículo sustituto'], ['llantas_baterias', 'Llantas y baterías'], ['pmp', 'PMP']].map(([k, t]) => (
            <Campo key={k} etiqueta={t} name={k} type="number" step="0.01" min="0" value={montos[k] ?? ''} onChange={(e) => setMontos({ ...montos, [k]: e.target.value })} />
          ))}
        </div>
        <div className="mt-5 grid gap-2 rounded-md bg-papel p-4 text-sm md:grid-cols-4">
          <p><span className="text-niebla">Subtotal</span><br /><b>{cordobas(subtotal)}</b></p>
          <p><span className="text-niebla">IVA 15 %</span><br /><b>{cordobas(subtotal * IVA)}</b></p>
          <p><span className="text-niebla">Cuota mensual</span><br /><b>{cordobas(cuota)}</b> <span className="text-niebla">({dolares(cuota / TASA_CAMBIO)})</span></p>
          <p><span className="text-niebla">Monto total del contrato</span><br /><b>{cordobas(subtotal * (Number(plazo) || 0))}</b></p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <Campo etiqueta="Anticipo (%)" name="anticipo_pct" type="number" step="0.01" min="0" max="100" />
          <Campo etiqueta="Anticipo (C$)" name="anticipo" type="number" step="0.01" min="0" />
          <Campo etiqueta="Depósito (C$)" name="deposito" type="number" step="0.01" min="0" />
          <Campo etiqueta="Valor residual (C$)" name="valor_residual" type="number" step="0.01" min="0" />
          <Campo etiqueta="Monto estimado de venta (US$)" name="monto_estimado_venta_usd" type="number" step="0.01" min="0" />
        </div>
      </Seccion>

      <Seccion titulo="Comentarios">
        <textarea className="input min-h-[90px]" name="comentarios" aria-label="Comentarios" />
      </Seccion>

      <div className="flex justify-end"><Guardar /></div>
    </form>
  );
}
