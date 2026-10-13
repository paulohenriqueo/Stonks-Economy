// Helpers de exibição do usuário. Funções puras, sem dependência do Firebase.

export const NAME_MAX_LENGTH = 80;

export interface NamedUser {
  displayName: string | null;
  email: string | null;
}

/** Nome para exibir: displayName do Auth, senão a parte do e-mail antes do @. */
export function displayNameFor(user: NamedUser): string {
  const name = user.displayName?.trim() || user.email?.split("@")[0]?.trim() || "Usuário";
  return name.slice(0, NAME_MAX_LENGTH);
}

/** Primeiro nome, para saudações ("Olá, Paulo!"). */
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? "";
}
