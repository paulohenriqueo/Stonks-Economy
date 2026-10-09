import { LoaderCircle } from "lucide-react";

export function FullScreenLoader({ label = "Carregando…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-dvh items-center justify-center bg-background"
    >
      <LoaderCircle className="size-8 animate-spin text-primary-light" aria-hidden />
      <span className="sr-only">{label}</span>
    </div>
  );
}
