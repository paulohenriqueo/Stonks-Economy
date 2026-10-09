import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, type LucideIcon } from "lucide-react";

type Variant = "error" | "success" | "info";

const VARIANTS: Record<Variant, { className: string; icon: LucideIcon }> = {
  error: { className: "border-danger/40 bg-danger/10 text-danger-light", icon: CircleAlert },
  success: { className: "border-success/40 bg-success/10 text-success-light", icon: CircleCheck },
  info: { className: "border-primary/40 bg-primary/10 text-primary-softer", icon: Info },
};

interface AlertProps {
  variant?: Variant;
  /** Permite apontar para a mensagem com aria-describedby. */
  id?: string;
  children: ReactNode;
}

export function Alert({ variant = "info", id, children }: AlertProps) {
  const { className, icon: Icon } = VARIANTS[variant];
  return (
    <div
      id={id}
      role={variant === "error" ? "alert" : "status"}
      className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${className}`}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      {/* min-w-0 + wrap-anywhere: textos sem espaço (ex.: e-mails) quebram em vez de vazar */}
      <div className="min-w-0 wrap-anywhere">{children}</div>
    </div>
  );
}
