import { describe, expect, it } from "vitest";
import { ConfigError, mergeConfigSources, parseAppConfig, type RawConfig } from "./config";

const COMPLETE: RawConfig = {
  FIREBASE_API_KEY: "chave",
  FIREBASE_AUTH_DOMAIN: "projeto.firebaseapp.com",
  FIREBASE_PROJECT_ID: "projeto",
  FIREBASE_APP_ID: "1:123:web:abc",
};

describe("parseAppConfig", () => {
  it("monta a configuração do Firebase com os campos obrigatórios", () => {
    expect(parseAppConfig(COMPLETE)).toEqual({
      firebase: {
        apiKey: "chave",
        authDomain: "projeto.firebaseapp.com",
        projectId: "projeto",
        appId: "1:123:web:abc",
      },
      emulator: null,
    });
  });

  it("inclui os campos opcionais quando preenchidos", () => {
    const config = parseAppConfig({
      ...COMPLETE,
      FIREBASE_STORAGE_BUCKET: "projeto.firebasestorage.app",
      FIREBASE_MESSAGING_SENDER_ID: "123",
    });
    expect(config.firebase.storageBucket).toBe("projeto.firebasestorage.app");
    expect(config.firebase.messagingSenderId).toBe("123");
  });

  it("ignora opcionais vazios em vez de mandar string vazia ao Firebase", () => {
    const config = parseAppConfig({ ...COMPLETE, FIREBASE_STORAGE_BUCKET: "  " });
    expect(config.firebase).not.toHaveProperty("storageBucket");
  });

  it("remove espaços em volta dos valores", () => {
    expect(parseAppConfig({ ...COMPLETE, FIREBASE_API_KEY: "  chave \n" }).firebase.apiKey).toBe(
      "chave",
    );
  });

  it("lista todas as chaves obrigatórias que faltam", () => {
    try {
      parseAppConfig({ FIREBASE_AUTH_DOMAIN: "x", FIREBASE_APP_ID: "" });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect((error as ConfigError).missing).toEqual([
        "FIREBASE_API_KEY",
        "FIREBASE_PROJECT_ID",
        "FIREBASE_APP_ID",
      ]);
    }
  });

  it("liga o emulador com as portas padrão quando há host", () => {
    expect(parseAppConfig({ ...COMPLETE, FIREBASE_EMULATOR_HOST: "localhost" }).emulator).toEqual({
      host: "localhost",
      authPort: 9099,
      firestorePort: 8080,
    });
  });

  it("aceita portas customizadas do emulador", () => {
    const config = parseAppConfig({
      ...COMPLETE,
      FIREBASE_EMULATOR_HOST: "127.0.0.1",
      FIREBASE_AUTH_EMULATOR_PORT: "19099",
      FIRESTORE_EMULATOR_PORT: "18080",
    });
    expect(config.emulator).toEqual({ host: "127.0.0.1", authPort: 19099, firestorePort: 18080 });
  });

  it.each(["0", "70000", "abc", "80.5"])("rejeita a porta inválida %s", (port) => {
    expect(() =>
      parseAppConfig({
        ...COMPLETE,
        FIREBASE_EMULATOR_HOST: "localhost",
        FIRESTORE_EMULATOR_PORT: port,
      }),
    ).toThrow(ConfigError);
  });

  it("não liga o emulador quando só as portas estão definidas", () => {
    expect(parseAppConfig({ ...COMPLETE, FIRESTORE_EMULATOR_PORT: "8080" }).emulator).toBeNull();
  });
});

describe("mergeConfigSources", () => {
  it("dá prioridade ao valor de runtime", () => {
    const merged = mergeConfigSources(
      { FIREBASE_PROJECT_ID: "runtime" },
      { FIREBASE_PROJECT_ID: "build", FIREBASE_API_KEY: "chave-build" },
    );
    expect(merged.FIREBASE_PROJECT_ID).toBe("runtime");
    expect(merged.FIREBASE_API_KEY).toBe("chave-build");
  });

  it("usa o valor do build quando o de runtime está vazio", () => {
    const merged = mergeConfigSources({ FIREBASE_API_KEY: " " }, { FIREBASE_API_KEY: "chave" });
    expect(merged.FIREBASE_API_KEY).toBe("chave");
  });

  it("ignora valores de runtime que não são texto", () => {
    const runtime = { FIREBASE_API_KEY: 123 } as unknown as RawConfig;
    expect(mergeConfigSources(runtime, { FIREBASE_API_KEY: "chave" }).FIREBASE_API_KEY).toBe(
      "chave",
    );
  });
});
