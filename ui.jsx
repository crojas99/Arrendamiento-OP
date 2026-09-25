import Link from 'next/link';

export function Encabezado({ titulo, detalle, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{titulo}</h1>
        {detalle && <p className="mt-1 text-sm text-niebla">{detalle}</p>}
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}

export function Seccion({ titulo, children, className = '' }) {
  return (
    <section className={`rounded-lg border border-linea bg-white ${className}`}>
      {titulo && <h2 className="border-b border-linea px-5 py-3 text-sm font-semibold">{titulo}</h2>}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Dato({ etiqueta, children }) {
  return (
    <div>
      <dt className="text-xs text-niebla">{etiqueta}</dt>
      <dd className="mt-0.5 text-sm font-medium">{children ?? '—'}</dd>
    </div>
  );
}

const TONOS = {
  'Vigente': 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
  'Próximo a vencer': 'bg-amber-50 text-amber-800 ring-amber-600/25',
  'Vencido': 'bg-red-50 text-red-800 ring-red-600/20',
  'Pendiente de firma': 'bg-sky-50 text-sky-800 ring-sky-600/20',
  'Pendiente de cierre': 'bg-violet-50 text-violet-800 ring-violet-600/20',
};

export function Estado({ valor }) {
  const tono = TONOS[valor] || 'bg-gray-100 text-gray-700 ring-gray-500/20';
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${tono}`}>{valor}</span>;
}

// La placa se muestra como una plaquita amarilla: es lo primero que el equipo busca.
export function Placa({ valor }) {
  if (!valor) return <span className="text-niebla">Sin placa</span>;
  return (
    <span className="inline-block whitespace-nowrap rounded-[3px] border border-grafito/70 bg-placa px-1.5 py-px font-semibold tracking-wider text-grafito" style={{ fontSize: 12 }}>
      {valor}
    </span>
  );
}

export function Paginacion({ pagina, total, porPagina, params }) {
  const paginas = Math.max(1, Math.ceil(total / porPagina));
  const enlace = (p) => {
    const q = new URLSearchParams(params);
    q.set('pagina', String(p));
    return '?' + q.toString();
  };
  return (
    <div className="flex items-center justify-between px-1 py-3 text-sm text-niebla">
      <span>{total.toLocaleString('en-US')} resultados</span>
      <div className="flex items-center gap-2">
        {pagina > 1 && <Link className="btn-sec py-1" href={enlace(pagina - 1)}>Anterior</Link>}
        <span>Página {pagina} de {paginas}</span>
        {pagina < paginas && <Link className="btn-sec py-1" href={enlace(pagina + 1)}>Siguiente</Link>}
      </div>
    </div>
  );
}

// Limpia el texto de búsqueda para usarlo dentro de un filtro .or() de Supabase
export const limpiarBusqueda = (q) => (q || '').replace(/[,()%*]/g, ' ').trim();
