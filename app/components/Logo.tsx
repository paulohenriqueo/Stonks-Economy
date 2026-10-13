import { TrendingUp } from "lucide-react";

const MARK_SIZES = {
  sm: { box: "size-9 rounded-xl", icon: "size-5" },
  lg: { box: "size-14 rounded-2xl", icon: "size-8" },
};

/** Símbolo da marca: seta de alta ("stonks") no azul principal. */
export function LogoMark({ size = "sm" }: { size?: keyof typeof MARK_SIZES }) {
  const { box, icon } = MARK_SIZES[size];
  return (
    <span
      className={`grid shrink-0 place-items-center bg-primary/15 text-primary-light ring-1 ring-primary/30 ${box}`}
    >
      <TrendingUp className={icon} aria-hidden />
    </span>
  );
}

/** Símbolo + nome, usado no cabeçalho da área logada. Abaixo de 360px fica só o símbolo. */
export function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark />
      <span className="hidden text-lg font-extrabold tracking-tight text-primary-light min-[360px]:inline">
        Stonks Economy
      </span>
    </span>
  );
}
