// Ações de autenticação usadas pelas telas.

import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { refreshAuthSnapshot } from "./authStore";
import { getFirebase } from "./client";
import { ensureUserProfile } from "./profile";

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export async function signIn(email: string, password: string): Promise<User> {
  const { auth, db } = getFirebase();
  const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
  try {
    await ensureUserProfile(db, user);
  } catch (error) {
    // Não impede o login: o perfil é recriado no próximo acesso.
    console.warn("Não foi possível criar o perfil do usuário.", error);
  }
  return user;
}

export async function signUp({ name, email, password }: SignUpData): Promise<User> {
  const { auth, db } = getFirebase();
  const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const nome = name.trim();
  // A conta já existe neste ponto. As duas gravações do nome são independentes:
  // se uma falhar, a outra ainda guarda o nome digitado.
  try {
    await updateProfile(user, { displayName: nome });
    refreshAuthSnapshot();
  } catch (error) {
    console.warn("Conta criada, mas não foi possível salvar o nome no Auth.", error);
  }
  try {
    await ensureUserProfile(db, user, nome);
  } catch (error) {
    console.warn("Conta criada, mas não foi possível salvar o perfil.", error);
  }
  return user;
}

export function signOut(): Promise<void> {
  return firebaseSignOut(getFirebase().auth);
}

export function requestPasswordReset(email: string): Promise<void> {
  return sendPasswordResetEmail(getFirebase().auth, email.trim());
}
