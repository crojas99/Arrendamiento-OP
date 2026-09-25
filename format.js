const n2 = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

export const cordobas = (v) => (v == null ? '—' : 'C$ ' + Number(v).toLocaleString('en-US', n2));
export const dolares = (v) => (v == null ? '—' : 'US$ ' + Number(v).toLocaleString('en-US', n2));
export const numero = (v) => (v == null ? '—' : Number(v).toLocaleString('en-US'));
export const pct = (v) => (v == null ? '—' : (Number(v) * 100).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' %');

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const fecha = (v) => {
  if (!v) return '—';
  const [a, m, d] = String(v).slice(0, 10).split('-');
  return `${d} ${MESES[Number(m) - 1]} ${a}`;
};

export const TASA_CAMBIO = 36.6243;
export const IVA = 0.15;

export const PROGRAMAS = ['GO', 'KINTO ONE', 'CICLO', 'CKINTO ONE'];
export const CARTERAS = ['LEASING', 'CORPORATIVO'];
export const TIPOS_CONTRATO = ['Colocación', 'Renovación'];
export const MEDIOS_PAGO = ['Tarjeta', 'FIDEM', 'Transf', 'Caja'];
export const TIPOS_CLIENTE = ['Empresa', 'Particular', 'Colaborador'];
export const SUCURSALES = ['MANAGUA', 'CHINANDEGA', 'ESTELI', 'MATAGALPA', 'JUIGALPA', 'LEON', 'PUERTO CABEZAS'];
export const VIGENCIAS = ['Vigente', 'Próximo a vencer', 'Vencido', 'Pendiente de firma', 'Pendiente de cierre', 'Cerrado', 'Venta', 'Taller', 'No facturar'];
