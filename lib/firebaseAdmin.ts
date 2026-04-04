// lib/firebaseAdmin.ts
import "server-only";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Garante que a chave privada seja formatada corretamente
const formatPrivateKey = (key: string) => key.replace(/\\n/g, "\n");

let app: App | undefined;

// Tenta inicializar o Admin SDK apenas se ele ainda não foi iniciado
if (!getApps().length) {
  try {
    app = initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY!),
      }),
    });
  } catch (error) {
    console.error("Erro ao inicializar Firebase Admin:", error);
  }
}

const adminDb = getFirestore(app!);
export { adminDb };