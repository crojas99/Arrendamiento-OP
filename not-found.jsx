import Link from 'next/link';
export default function NoEncontrado() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3">
      <p className="text-lg font-semibold">Esta página no existe o el registro fue eliminado.</p>
      <Link className="btn" href="/contratos">Ir a contratos</Link>
    </main>
  );
}
