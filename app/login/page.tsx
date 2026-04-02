"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { RegisterModal } from "../components/RegisterModal";

export default function Login() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleRegister = (data: { name: string; email: string; password: string }) => {
    console.log('Dados do cadastro:', data);
    setIsRegisterOpen(false);
    // Opcional: abrir modal de login após cadastro
  };

  const handleLogin = (email: string, password: string) => {
    console.log('Login com:', { email, password });
    // Aqui você autentica o usuário
    // Se sucesso, redireciona para o dashboard
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-sans">
      <main className="flex flex-col items-center justify-center w-full max-w-2xl rounded-3xl shadow-xl bg-zinc-900/90 p-10 sm:p-16 gap-10 border border-zinc-800">
        <div className="flex flex-col items-center gap-4">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={80}
            height={20}
            priority
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400 drop-shadow-lg text-center">
            Stonks Economy
          </h1>
        </div>
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-semibold text-zinc-100">Bem-vindo!</h2>
          <p className="max-w-md text-lg leading-7 text-zinc-300">
            O <span className="font-bold text-blue-400">Stonks Economy</span> é o seu novo app de finanças pessoais.<br/>
            Organize, gerencie e conquiste sua liberdade financeira de forma simples e divertida.<br/>
            Chega de perrengue e de ser caçado pelo Serasa!
          </p>
        </div>
        
        {/* Formulário de login */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleLogin(formData.get('email') as string, formData.get('password') as string);
          }}
          className="w-full max-w-sm space-y-4"
        >
          {/* Campo de e-mail */}
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-black placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Campo de senha com botão de mostrar/esconder */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Senha"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-black placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 inset-y-0 my-auto text-gray-500 hover:text-gray-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-colors"
            >
              Entrar
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-transparent border border-blue-600 text-blue-400 font-semibold hover:bg-blue-950 transition-colors"
              onClick={() => setIsRegisterOpen(true)}
            >
              Cadastrar
            </button>
          </div>
        </form>
      </main>
      
      {/* Modal de cadastro */}
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)}
        onRegister={handleRegister}
      />
    </div>
  );
}