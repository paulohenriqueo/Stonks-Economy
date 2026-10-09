"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { mapAuthError } from "@/lib/auth/errors";
import { signIn, signUp, type SignUpData } from "@/lib/firebase/auth";
import { safeRedirectPath } from "@/lib/navigation";
import { useAuth } from "../hooks/useAuth";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { LogoMark } from "../components/Logo";
import { RegisterModal } from "../components/RegisterModal";
import { ResetPasswordModal } from "../components/ResetPasswordModal";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/TextField";

/** Destino depois de entrar: o ?next= da URL (se for um caminho interno) ou o dashboard. */
function redirectTarget(): string {
  return safeRedirectPath(new URLSearchParams(window.location.search).get("next"));
}

export function LoginView() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // true enquanto um login/cadastro está em andamento (a navegação fica por conta do handler)
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  // Quem já está logado não precisa ver o login.
  useEffect(() => {
    if (auth.status === "signedIn" && !busy) router.replace(redirectTarget());
  }, [auth.status, busy, router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signIn(email, password);
      router.replace(redirectTarget());
    } catch (err) {
      setError(mapAuthError(err));
      setBusy(false);
    }
  };

  const handleRegister = async (data: SignUpData) => {
    setBusy(true);
    try {
      await signUp(data);
      router.replace(redirectTarget());
    } catch (err) {
      setBusy(false);
      throw err; // o modal mostra a mensagem
    }
  };

  // Enquanto o estado do login carrega, nada de formulário. No HTML estático isso evita um
  // formulário "morto": enviado antes do JavaScript carregar, ele mandaria a senha na URL.
  // Também evita mostrar o formulário por um instante para quem já está logado.
  if (auth.status === "loading") return <FullScreenLoader />;
  if (auth.status === "signedIn" && !busy) return <FullScreenLoader label="Entrando…" />;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-10 font-sans">
      <main className="flex w-full max-w-2xl flex-col items-center justify-center gap-8 rounded-3xl border border-surface-light/70 bg-surface/90 p-6 shadow-soft sm:gap-10 sm:p-16">
        <div className="flex flex-col items-center gap-4">
          <LogoMark size="lg" />
          <h1 className="text-center text-4xl font-extrabold tracking-tight text-primary-light drop-shadow-lg sm:text-5xl">
            Stonks Economy
          </h1>
        </div>
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-semibold text-text-primary">Bem-vindo!</h2>
          <p className="max-w-md text-lg leading-7 text-text-muted">
            O <span className="font-bold text-primary-light">Stonks Economy</span> é o seu novo app de
            finanças pessoais.
            <br />
            Organize, gerencie e conquiste sua liberdade financeira de forma simples e divertida.
            <br />
            Chega de perrengue e de ser caçado pelo Serasa!
          </p>
        </div>

        {/* Formulário de login */}
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <TextField
            label="E-mail"
            hideLabel
            type="email"
            name="email"
            autoComplete="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="space-y-2">
            <TextField
              label="Senha"
              hideLabel
              revealable
              name="password"
              autoComplete="current-password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsResetOpen(true)}
                className="rounded text-sm text-primary-light hover:underline focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-hidden"
              >
                Esqueci minha senha
              </button>
            </div>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button type="submit" size="lg" loading={busy} className="w-full sm:w-auto">
              Entrar
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => setIsRegisterOpen(true)}
              disabled={busy}
            >
              Cadastrar
            </Button>
          </div>
        </form>
      </main>

      {/* Modais de cadastro e de recuperação de senha */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegister={handleRegister}
        submitting={busy}
      />
      <ResetPasswordModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        initialEmail={email}
      />
    </div>
  );
}
