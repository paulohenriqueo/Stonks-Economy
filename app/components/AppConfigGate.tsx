"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { ConfigErrorScreen } from "./ConfigErrorScreen";

/**
 * Envolve o app inteiro: inicia a escuta do Firebase Auth e, se a configuração do
 * Firebase estiver incompleta, mostra uma tela explicando o que falta em vez de quebrar.
 */
export function AppConfigGate({ children }: { children: ReactNode }) {
  const auth = useAuth();
  if (auth.status === "error") return <ConfigErrorScreen error={auth.error} />;
  return <>{children}</>;
}
