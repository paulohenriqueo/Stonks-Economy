"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "firebase/auth";
import { CircleUserRound, LayoutDashboard, LogOut, type LucideIcon } from "lucide-react";
import { signOut } from "@/lib/firebase/auth";
import { HOME_PATH } from "@/lib/navigation";
import { displayNameFor } from "@/lib/user";
import { Logo } from "./Logo";
import { Button } from "./ui/Button";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Novas telas (mês, contas, parcelas, projeção) entram aqui nas próximas fases.
const NAV_ITEMS: NavItem[] = [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }];

/** Estrutura da área logada: cabeçalho com navegação e saída. */
export function AppShell({ user, children }: { user: User; children: ReactNode }) {
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      // O layout protegido redireciona para o login quando o estado muda para "signedOut".
      await signOut();
    } catch (error) {
      console.error("Erro ao sair:", error);
      setSigningOut(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-surface-light/60 bg-background-secondary/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:gap-6 sm:px-6">
          <Link
            href={HOME_PATH}
            aria-label="Stonks Economy, ir para o dashboard"
            className="shrink-0 rounded-lg focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-hidden"
          >
            <Logo />
          </Link>

          <nav aria-label="Principal" className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  // Anel e contorno por dentro do link: a navegação rola na horizontal e
                  // cortaria qualquer indicador de foco desenhado por fora. O contorno
                  // transparente só aparece no modo de alto contraste do sistema.
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-inset focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-transparent ${
                    active
                      ? "bg-surface text-text-primary"
                      : "text-text-muted hover:bg-surface hover:text-text-primary"
                  }`}
                >
                  <Icon className="size-4" aria-hidden />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sr-only sm:hidden">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden max-w-48 items-center gap-2 truncate text-sm text-text-muted md:inline-flex">
              <CircleUserRound className="size-5 shrink-0" aria-hidden />
              <span className="truncate">{displayNameFor(user)}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              loading={signingOut}
              aria-label="Sair da conta"
            >
              {!signingOut && <LogOut className="size-4" aria-hidden />}
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
