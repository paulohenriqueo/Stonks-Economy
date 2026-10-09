import { TriangleAlert } from "lucide-react";
import { ConfigError } from "@/lib/config";

/** Tela mostrada quando a configuração do Firebase está ausente ou inválida. */
export function ConfigErrorScreen({ error }: { error: Error }) {
  const missing = error instanceof ConfigError ? error.missing : [];

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-4 rounded-2xl border border-danger/40 bg-surface p-6 shadow-soft">
        <div className="flex items-center gap-3 text-danger-light">
          <TriangleAlert className="size-6 shrink-0" aria-hidden />
          <h1 className="text-xl font-semibold">Não foi possível iniciar o app</h1>
        </div>
        <p className="text-text-muted">{error.message}</p>
        {missing.length > 0 && (
          <ul className="space-y-1 rounded-lg bg-background-secondary p-3 font-mono text-sm text-text-primary">
            {missing.map((key) => (
              <li key={key}>{key}</li>
            ))}
          </ul>
        )}
        <p className="text-sm text-text-muted">
          Em desenvolvimento, copie <code className="text-primary-softer">.env.example</code> para{" "}
          <code className="text-primary-softer">.env.local</code> e preencha as variáveis com o
          prefixo <code className="text-primary-softer">NEXT_PUBLIC_</code>. No container, defina as
          mesmas chaves sem esse prefixo.
        </p>
      </div>
    </main>
  );
}
