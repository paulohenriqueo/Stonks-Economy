// Estado de autenticação como store externa (consumida com useSyncExternalStore).
// A inscrição no Firebase começa no primeiro componente que usa useAuth() e vale
// para o app inteiro.

import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebase } from "./client";

export type AuthSnapshot =
  | { status: "loading" }
  | { status: "signedOut" }
  | { status: "signedIn"; user: User }
  /** Configuração do Firebase ausente ou inválida. */
  | { status: "error"; error: Error };

const LOADING: AuthSnapshot = { status: "loading" };

let snapshot: AuthSnapshot = LOADING;
let started = false;
const listeners = new Set<() => void>();

function publish(next: AuthSnapshot) {
  snapshot = next;
  for (const listener of listeners) listener();
}

function start() {
  if (started) return;
  started = true;
  try {
    const { auth } = getFirebase();
    onAuthStateChanged(auth, (user) => {
      publish(user ? { status: "signedIn", user } : { status: "signedOut" });
    });
  } catch (error) {
    publish({ status: "error", error: error instanceof Error ? error : new Error(String(error)) });
  }
}

export function subscribeAuth(listener: () => void): () => void {
  listeners.add(listener);
  start();
  return () => {
    listeners.delete(listener);
  };
}

export function getAuthSnapshot(): AuthSnapshot {
  return snapshot;
}

/** No servidor (pré-renderização do build estático) o estado é sempre "carregando". */
export function getServerAuthSnapshot(): AuthSnapshot {
  return LOADING;
}

/** Republica o usuário atual. Necessário depois de updateProfile, que não dispara onAuthStateChanged. */
export function refreshAuthSnapshot() {
  if (snapshot.status === "signedIn") publish({ status: "signedIn", user: snapshot.user });
}
