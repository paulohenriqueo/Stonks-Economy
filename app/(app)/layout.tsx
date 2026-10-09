"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { loginPathFor } from "@/lib/navigation";
import { useAuth } from "../hooks/useAuth";
import { AppShell } from "../components/AppShell";
import { FullScreenLoader } from "../components/FullScreenLoader";

/**
 * Área logada. Sem usuário, manda para o login e guarda a página atual em ?next=.
 * Isto protege só a navegação. Quem protege os dados são as regras do Firestore.
 */
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.status === "signedOut") {
      router.replace(loginPathFor(`${window.location.pathname}${window.location.search}`));
    }
  }, [auth.status, router]);

  if (auth.status !== "signedIn") return <FullScreenLoader />;

  return <AppShell user={auth.user}>{children}</AppShell>;
}
