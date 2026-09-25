'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ACTIVOS = [
  { href: '/contratos', texto: 'Contratos' },
  { href: '/contratos/nuevo', texto: 'Apertura de contrato' },
  { href: '/clientes', texto: 'Clientes' },
];
const PROXIMOS = ['Facturación', 'Cobro', 'Kilometraje GPS', 'Siniestros', 'Renovaciones'];

export default function Menu() {
  const ruta = usePathname();
  const activo = (href) =>
    href === '/contratos' ? ruta === '/contratos' || (/^\/contratos\/(?!nuevo)/.test(ruta)) : ruta.startsWith(href);
  return (
    <nav className="flex flex-col gap-1 text-sm">
      {ACTIVOS.map((i) => (
        <Link key={i.href} href={i.href}
          className={`rounded-md px-3 py-2 ${activo(i.href) ? 'bg-white/10 font-medium text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
          {i.texto}
        </Link>
      ))}
      <p className="mt-6 px-3 pb-1 text-xs text-white/40">Próximas fases</p>
      {PROXIMOS.map((t) => (
        <span key={t} className="cursor-default px-3 py-1.5 text-white/35">{t}</span>
      ))}
    </nav>
  );
}
