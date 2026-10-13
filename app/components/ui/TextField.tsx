"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  /** Mantém o rótulo só para leitores de tela (o visual fica com o placeholder). */
  hideLabel?: boolean;
  icon?: LucideIcon;
  error?: string;
  /** Campo de senha com botão de mostrar/esconder. */
  revealable?: boolean;
}

export function TextField({
  label,
  hideLabel = false,
  icon: Icon,
  error,
  revealable = false,
  id,
  type = "text",
  className = "",
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-erro`;
  const [revealed, setRevealed] = useState(false);
  const inputType = revealable ? (revealed ? "text" : "password") : type;

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className={hideLabel ? "sr-only" : "mb-2 block text-sm font-medium text-text-muted"}
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-text-secondary"
            aria-hidden
          />
        )}
        <input
          id={inputId}
          type={inputType}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-lg border bg-background-secondary py-2.5 text-text-primary placeholder:text-text-muted focus:ring-2 focus:outline-hidden ${
            Icon ? "pl-10" : "pl-4"
          } ${revealable ? "pr-11" : "pr-4"} ${
            error
              ? "border-danger focus:ring-danger-light"
              : "border-surface-light focus:border-primary focus:ring-primary-light"
          }`}
          {...props}
        />
        {revealable && (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? "Ocultar senha" : "Mostrar senha"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-text-secondary hover:text-text-primary focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-hidden"
          >
            {revealed ? (
              <EyeOff className="size-5" aria-hidden />
            ) : (
              <Eye className="size-5" aria-hidden />
            )}
          </button>
        )}
      </div>
      {/* role="alert": o leitor de tela anuncia o erro quando ele aparece, mesmo que o foco
          já esteja no campo (ex.: envio com Enter). */}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-danger-light">
          {error}
        </p>
      )}
    </div>
  );
}
