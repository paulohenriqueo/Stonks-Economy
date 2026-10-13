// Regras de navegação entre as áreas pública e protegida.

/** Página inicial de quem está logado. */
export const HOME_PATH = "/dashboard";
export const LOGIN_PATH = "/login";

// Origem fictícia, usada só para interpretar o caminho com a API URL.
const PARSE_ORIGIN = "https://stonks.invalid";

/**
 * Valida o destino pós-login vindo de ?next=. Só aceita caminhos internos.
 * Isso evita open redirect, como ?next=//site-malicioso.com ou ?next=/.//site-malicioso.com.
 */
export function safeRedirectPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/")) return HOME_PATH;

  let url: URL;
  try {
    url = new URL(next, PARSE_ORIGIN);
  } catch {
    return HOME_PATH;
  }

  if (url.origin !== PARSE_ORIGIN) return HOME_PATH;
  // A normalização da URL remove segmentos "." e ".." depois de fixar a origem:
  // "/.//site.com" vira o caminho "//site.com", que o navegador trataria como outro site.
  if (url.pathname.startsWith("//")) return HOME_PATH;
  if (url.pathname === "/" || url.pathname.startsWith(LOGIN_PATH)) return HOME_PATH;

  const target = `${url.pathname}${url.search}${url.hash}`;
  // Confere o resultado final, que é o que vai para o router.
  return new URL(target, PARSE_ORIGIN).origin === PARSE_ORIGIN ? target : HOME_PATH;
}

/** URL do login que traz o usuário de volta para `currentPath` depois de entrar. */
export function loginPathFor(currentPath: string): string {
  const target = safeRedirectPath(currentPath);
  return target === HOME_PATH ? LOGIN_PATH : `${LOGIN_PATH}?next=${encodeURIComponent(target)}`;
}
