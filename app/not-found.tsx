import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-4">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <Compass className="size-12 text-primary-light" aria-hidden />
        <h1 className="text-2xl font-semibold text-text-primary">Página não encontrada</h1>
        <p className="text-text-muted">O endereço acessado não existe ou mudou de lugar.</p>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-lg bg-primary px-5 font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
