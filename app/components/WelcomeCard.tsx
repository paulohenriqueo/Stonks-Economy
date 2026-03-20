import React from "react";

export default function WelcomeCard() {
  return (
    <div className="rounded-xl bg-blue-50 dark:bg-zinc-800 p-6 shadow text-center">
      <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">Bem-vindo ao Stonks Economy!</h2>
      <p className="text-zinc-600 dark:text-zinc-200">Gerencie suas finanças de forma simples e eficiente.</p>
    </div>
  );
}
