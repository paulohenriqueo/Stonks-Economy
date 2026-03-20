import React from "react";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-surface rounded-2xl shadow-card p-8 w-full max-w-xs relative border border-background-secondary">
        <button
          className="absolute top-2 right-2 text-text-secondary hover:text-primary transition-colors"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center text-primary">Cadastrar</h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome completo"
            className="rounded border border-background-secondary bg-background text-text-primary px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
            autoFocus
          />
          <input
            type="email"
            placeholder="Email"
            className="rounded border border-background-secondary bg-background text-text-primary px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          <input
            type="text"
            placeholder="Usuário"
            className="rounded border border-background-secondary bg-background text-text-primary px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          <input
            type="password"
            placeholder="Senha"
            className="rounded border border-background-secondary bg-background text-text-primary px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          <button
            type="submit"
            className="mt-2 rounded bg-primary hover:bg-primary-hover text-white font-semibold py-2 transition-colors"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
