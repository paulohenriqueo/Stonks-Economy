import { defineConfig } from "vitest/config";

// Testes das regras do Firestore contra o emulador.
// Precisa de FIRESTORE_EMULATOR_HOST (o docker compose já define no container "web").
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/rules/**/*.test.ts"],
    testTimeout: 20_000,
    hookTimeout: 30_000,
    // Os arquivos compartilham o mesmo emulador e limpam os dados entre os testes.
    fileParallelism: false,
  },
});
