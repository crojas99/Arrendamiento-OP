import Menu from '@/components/Menu';
import { cerrarSesion } from './actions';
import { createClient } from '@/lib/supabase/server';

export default async function AppLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <div className="min-h-screen md:flex">
      <aside className="flex flex-col bg-tinta px-4 py-5 md:fixed md:inset-y-0 md:w-60">
        <span className="mb-8 inline-block self-start rounded-[3px] border border-white/60 bg-placa px-2 py-0.5 text-sm font-semibold tracking-wider text-grafito">ARRENDAMIENTO OP</span>
        <Menu />
        <form action={cerrarSesion} className="mt-auto border-t border-white/10 pt-4">
          <p className="truncate px-3 text-xs text-white/50">{user?.email}</p>
          <button className="mt-2 px-3 text-sm text-white/70 hover:text-white" type="submit">Cerrar sesión</button>
        </form>
      </aside>
      <main className="flex-1 px-5 py-8 md:ml-60 md:px-10">{children}</main>
    </div>
  );
}
