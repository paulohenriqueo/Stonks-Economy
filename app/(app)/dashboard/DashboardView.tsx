"use client";

import { PiggyBank, Receipt, Wallet, type LucideIcon } from "lucide-react";
import { displayNameFor, firstName } from "@/lib/user";
import { useAuth } from "../../hooks/useAuth";

interface NextStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

const NEXT_STEPS: NextStep[] = [
  {
    icon: Wallet,
    title: "Salário do mês",
    description: "Informe quanto entrou e veja a divisão entre contas, lazer e investimentos.",
  },
  {
    icon: Receipt,
    title: "Contas e parcelas",
    description: "Cadastre as contas fixas e as compras parceladas uma vez só.",
  },
  {
    icon: PiggyBank,
    title: "Quanto sobra",
    description: "Acompanhe o que já está comprometido e o que ainda está livre no mês.",
  },
];

export function DashboardView() {
  const auth = useAuth();
  const name = auth.status === "signedIn" ? firstName(displayNameFor(auth.user)) : "";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold wrap-anywhere text-text-primary">Olá, {name}!</h1>
        <p className="mt-1 text-text-muted">Aqui você verá o resumo das suas finanças.</p>
      </div>

      <section
        aria-labelledby="proximos-passos"
        className="rounded-2xl border border-surface-light/70 bg-surface p-6 shadow-card"
      >
        <h2 id="proximos-passos" className="text-lg font-semibold text-text-primary">
          Em breve por aqui
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {NEXT_STEPS.map(({ icon: Icon, title, description }) => (
            <li key={title} className="rounded-xl bg-background-secondary p-4">
              <Icon className="size-6 text-primary-light" aria-hidden />
              <p className="mt-3 font-medium text-text-primary">{title}</p>
              <p className="mt-1 text-sm text-text-muted">{description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
