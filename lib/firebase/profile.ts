import type { User } from "firebase/auth";
import { doc, runTransaction, serverTimestamp, type Firestore } from "firebase/firestore";
import { displayNameFor, NAME_MAX_LENGTH } from "@/lib/user";

/**
 * Garante que o perfil users/{uid} exista. O documento é { nome, email, criadoEm }.
 *
 * - Sem `name` (login): cria o perfil se faltar, com o nome do Auth ou do e-mail.
 *   Isso cobre contas criadas antes de o perfil existir.
 * - Com `name` (cadastro): cria o perfil ou corrige o nome, caso o documento já
 *   tenha sido criado antes com um nome provisório.
 *
 * Usa transação para ser seguro mesmo se duas abas chamarem ao mesmo tempo.
 */
export async function ensureUserProfile(db: Firestore, user: User, name?: string): Promise<void> {
  const ref = doc(db, "users", user.uid);
  const nome = name?.trim().slice(0, NAME_MAX_LENGTH);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) {
      tx.set(ref, {
        nome: nome || displayNameFor(user),
        ...(user.email ? { email: user.email } : {}),
        criadoEm: serverTimestamp(),
      });
    } else if (nome && snap.get("nome") !== nome) {
      tx.update(ref, { nome });
    }
  });
}
