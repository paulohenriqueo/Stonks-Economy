// Tradução dos erros do Firebase Auth para mensagens em português.
// Credenciais erradas e usuário inexistente usam a mesma mensagem, para não revelar
// quais e-mails têm conta.

const INVALID_CREDENTIALS = "E-mail ou senha inválidos.";

const MESSAGES: Record<string, string> = {
  "auth/invalid-credential": INVALID_CREDENTIALS,
  "auth/invalid-login-credentials": INVALID_CREDENTIALS,
  "auth/wrong-password": INVALID_CREDENTIALS,
  "auth/user-not-found": INVALID_CREDENTIALS,
  "auth/invalid-email": "E-mail inválido.",
  "auth/missing-email": "Informe o e-mail.",
  "auth/missing-password": "Informe a senha.",
  "auth/user-disabled": "Esta conta foi desativada.",
  "auth/too-many-requests":
    "Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.",
  "auth/network-request-failed": "Falha de conexão. Verifique sua internet e tente novamente.",
  "auth/email-already-in-use": "Este e-mail já está cadastrado.",
  "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
  "auth/password-does-not-meet-requirements": "A senha não atende aos requisitos de segurança.",
  "auth/operation-not-allowed": "Login por e-mail e senha não está habilitado no Firebase.",
  "auth/invalid-api-key": "Configuração do Firebase inválida (API key).",
  "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
    "Configuração do Firebase inválida (API key).",
};

export const GENERIC_AUTH_ERROR = "Não foi possível concluir a operação. Tente novamente.";

/** Código do erro do Firebase (ex.: "auth/invalid-credential"), ou null. */
export function authErrorCode(error: unknown): string | null {
  if (typeof error === "object" && error !== null && "code" in error) {
    const { code } = error as { code: unknown };
    return typeof code === "string" ? code : null;
  }
  return null;
}

export function mapAuthError(error: unknown): string {
  const code = authErrorCode(error);
  return (code && MESSAGES[code]) || GENERIC_AUTH_ERROR;
}
