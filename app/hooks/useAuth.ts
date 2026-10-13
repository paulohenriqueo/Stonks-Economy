"use client";

import { useSyncExternalStore } from "react";
import {
  getAuthSnapshot,
  getServerAuthSnapshot,
  subscribeAuth,
  type AuthSnapshot,
} from "@/lib/firebase/authStore";

/** Estado de autenticação atual: loading, signedOut, signedIn (com o usuário) ou error. */
export function useAuth(): AuthSnapshot {
  return useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerAuthSnapshot);
}
