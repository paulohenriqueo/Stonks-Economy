"use client";
import Image from "next/image";
import { useState } from "react";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";

export default function Login() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-sans">
      <main className="flex flex-col items-center justify-center w-full max-w-2xl rounded-3xl shadow-xl bg-dark dark:bg-zinc-900/90 p-10 sm:p-16 gap-10 border border-zinc-200 dark:border-zinc-800">
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
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">Bem-vindo!</h2>
          <p className="max-w-md text-lg leading-7 text-zinc-600 dark:text-zinc-300">
            O <span className="font-bold text-blue-600 dark:text-blue-400">Stonks Economy</span> é o seu novo app de finanças pessoais.<br/>
            Organize, gerencie e conquiste sua liberdade financeira de forma simples e divertida.<br/>
            Chega de perrengue e de ser caçado pelo Serasa!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-colors"
            onClick={() => setModalOpen(true)}
          >
            Entrar
          </button>
          <button className="w-full sm:w-auto px-8 py-3 rounded-lg bg-white border border-blue-600 text-blue-700 dark:bg-zinc-950 dark:text-blue-400 dark:border-blue-400 font-semibold shadow hover:bg-blue-50 dark:hover:bg-zinc-900 transition-colors"
            onClick={() => setModalOpen(true)}>
            Cadastrar
          </button>
        </div>
      </main>
      <LoginModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <RegisterModal isOpen={modalOpen} onClose={() => setModalOpen(false) }/>
    </div>
  );
}
