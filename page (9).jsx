import { iniciarSesion } from './actions';

export default function Login({ searchParams }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-tinta px-4">
      <form action={iniciarSesion} className="w-full max-w-sm rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-6">
          <span className="inline-block rounded-[3px] border border-grafito/70 bg-placa px-2 py-0.5 text-sm font-semibold tracking-wider">ARRENDAMIENTO OP</span>
          <p className="mt-3 text-sm text-niebla">Ingresa con tu correo de la empresa.</p>
        </div>
        {searchParams?.error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">Correo o contraseña incorrectos. Revísalos e intenta de nuevo.</p>
        )}
        <label className="label" htmlFor="email">Correo</label>
        <input className="input mb-4" id="email" name="email" type="email" autoComplete="email" required />
        <label className="label" htmlFor="password">Contraseña</label>
        <input className="input mb-6" id="password" name="password" type="password" autoComplete="current-password" required />
        <button className="btn w-full" type="submit">Ingresar</button>
      </form>
    </main>
  );
}
