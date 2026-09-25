'use server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const txt = (f, k) => { const v = String(f.get(k) ?? '').trim(); return v === '' ? null : v; };

export async function registrarCliente(_prev, f) {
  const cod = Number(txt(f, 'cod_cliente'));
  if (!Number.isInteger(cod) || cod <= 0) return { error: 'El código de cliente debe ser un número entero.' };
  const ult4 = txt(f, 'tarjeta_ultimos4');
  if (ult4 && !/^\d{4}$/.test(ult4)) return { error: 'De la tarjeta solo se guardan los últimos 4 dígitos.' };

  const supabase = createClient();
  const { error } = await supabase.from('clientes').insert({
    cod_cliente: cod, tipo_cliente: txt(f, 'tipo_cliente'), nombre: txt(f, 'nombre'),
    ruc: txt(f, 'ruc'), cedula: txt(f, 'cedula'), representante: txt(f, 'representante'),
    cedula_representante: txt(f, 'cedula_representante'), correos: txt(f, 'correos'),
    telefonos: txt(f, 'telefonos'), direccion: txt(f, 'direccion'), medio_pago: txt(f, 'medio_pago'),
    tarjeta_ultimos4: ult4,
  });
  if (error) return { error: error.code === '23505' ? `Ya existe un cliente con el código ${cod}.` : `No se pudo registrar el cliente: ${error.message}` };
  redirect(f.get('volver') === 'contrato' ? `/contratos/nuevo?cliente=${cod}` : `/clientes/${cod}`);
}
