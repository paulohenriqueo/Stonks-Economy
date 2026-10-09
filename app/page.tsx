"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";
import { FullScreenLoader } from "./components/FullScreenLoader";
import { HOME_PATH, LOGIN_PATH } from "@/lib/navigation";

/** Raiz: manda para o dashboard quem está logado e para o login quem não está. */
export default function Home() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.status === "signedIn") router.replace(HOME_PATH);
    else if (auth.status === "signedOut") router.replace(LOGIN_PATH);
  }, [auth.status, router]);

  return <FullScreenLoader />;
}
