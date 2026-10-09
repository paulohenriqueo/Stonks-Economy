import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";
import { readAppConfig } from "@/lib/config";

export interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

// Guardado em globalThis para sobreviver ao hot reload em desenvolvimento
// (conectar a mesma instância ao emulador duas vezes gera erro).
const globalForFirebase = globalThis as typeof globalThis & {
  __stonksFirebase?: FirebaseServices;
};

/**
 * Inicializa o Firebase sob demanda e só no navegador. Inicializar no import quebraria
 * o build estático, que pré-renderiza as páginas fora do navegador.
 * Lança ConfigError se a configuração estiver incompleta.
 */
export function getFirebase(): FirebaseServices {
  if (typeof window === "undefined") {
    throw new Error("O Firebase só pode ser usado no navegador.");
  }
  if (globalForFirebase.__stonksFirebase) return globalForFirebase.__stonksFirebase;

  const config = readAppConfig();
  const app = getApps().length > 0 ? getApp() : initializeApp(config.firebase);
  const auth = getAuth(app);
  auth.languageCode = "pt-BR"; // idioma dos e-mails do Firebase (ex.: redefinição de senha)
  const db = getFirestore(app);

  if (config.emulator) {
    const { host, authPort, firestorePort } = config.emulator;
    connectAuthEmulator(auth, `http://${host}:${authPort}`, { disableWarnings: true });
    connectFirestoreEmulator(db, host, firestorePort);
  }

  globalForFirebase.__stonksFirebase = { app, auth, db };
  return globalForFirebase.__stonksFirebase;
}
