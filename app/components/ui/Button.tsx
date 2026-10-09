import type { ButtonHTMLAttributes } from "react";
import { LoaderCircle } from "lucide-react";

type Variant = "primary" | "outline" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

// outline-hidden (e não outline-none): no modo de alto contraste do sistema o anel some,
// e o Tailwind mantém um contorno visível no lugar.
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors " +
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60";

// Todas as variantes têm borda (transparente quando não aparece) para o botão manter o
// contorno no modo de alto contraste.
const VARIANTS: Record<Variant, string> = {
  // Ação principal (ex.: Entrar, Criar conta)
  primary: "border-transparent bg-primary text-white shadow hover:bg-primary-hover",
  // Ação alternativa em destaque (ex.: Cadastrar)
  outline: "border-primary text-primary-light hover:bg-primary/10",
  // Ação neutra (ex.: Cancelar)
  secondary:
    "border-surface-light text-text-muted hover:bg-background-secondary hover:text-text-primary",
  ghost: "border-transparent text-text-muted hover:bg-surface hover:text-text-primary",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4",
  lg: "h-12 px-8",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Mostra um spinner e desabilita o botão. */
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  type = "button",
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
