import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Testes unitários (funções puras). Os testes das regras do Firestore ficam em
// vitest.rules.config.mts, porque precisam do emulador rodando.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "app/**/*.test.{ts,tsx}"],
  },
});
