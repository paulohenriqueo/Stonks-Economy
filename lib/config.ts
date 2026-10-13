// Configuração do app (Firebase e, opcionalmente, Firebase Emulator).
//
// Os valores podem vir de dois lugares, nesta ordem de prioridade:
// 1. window.__STONKS_CONFIG__, definido em /config.js. Em produção esse arquivo é
//    gerado pelo container a partir das variáveis de ambiente (ex.: FIREBASE_API_KEY),
//    então dá para trocar a configuração sem rebuild;
// 2. variáveis NEXT_PUBLIC_* (ex.: NEXT_PUBLIC_FIREBASE_API_KEY), embutidas no build.
//    É o caminho usado em desenvolvimento, via .env.local.

export const CONFIG_KEYS = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
  "FIREBASE_EMULATOR_HOST",
  "FIREBASE_AUTH_EMULATOR_PORT",
  "FIRESTORE_EMULATOR_PORT",
] as const;

export type ConfigKey = (typeof CONFIG_KEYS)[number];
export type RawConfig = Partial<Record<ConfigKey, string | undefined>>;

const REQUIRED_KEYS = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_APP_ID",
] as const satisfies readonly ConfigKey[];

export const DEFAULT_AUTH_EMULATOR_PORT = 9099;
export const DEFAULT_FIRESTORE_EMULATOR_PORT = 8080;

export interface FirebaseWebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  storageBucket?: string;
  messagingSenderId?: string;
}

export interface EmulatorConfig {
  host: string;
  authPort: number;
  firestorePort: number;
}

export interface AppConfig {
  firebase: FirebaseWebConfig;
  /** null = usa o Firebase real. */
  emulator: EmulatorConfig | null;
}

export class ConfigError extends Error {
  /** Chaves obrigatórias ausentes, sem o prefixo NEXT_PUBLIC_. */
  readonly missing: string[];

  constructor(message: string, missing: string[] = []) {
    super(message);
    this.name = "ConfigError";
    this.missing = missing;
  }
}

declare global {
  interface Window {
    __STONKS_CONFIG__?: RawConfig;
  }
}

function clean(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

function parsePort(value: string | undefined, fallback: number, key: ConfigKey): number {
  if (value === undefined) return fallback;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new ConfigError(`Porta inválida em ${key}: "${value}".`);
  }
  return port;
}

/** Junta as duas fontes: um valor de runtime preenchido vence o valor do build. */
export function mergeConfigSources(runtime: RawConfig, build: RawConfig): RawConfig {
  const merged: RawConfig = {};
  for (const key of CONFIG_KEYS) {
    merged[key] = clean(runtime[key]) ?? clean(build[key]);
  }
  return merged;
}

/** Valida a configuração bruta e monta o objeto usado pelo app. */
export function parseAppConfig(raw: RawConfig): AppConfig {
  const value = (key: ConfigKey) => clean(raw[key]);

  const missing = REQUIRED_KEYS.filter((key) => value(key) === undefined);
  if (missing.length > 0) {
    throw new ConfigError(
      `Configuração do Firebase incompleta. Faltando: ${missing.join(", ")}.`,
      missing,
    );
  }

  const storageBucket = value("FIREBASE_STORAGE_BUCKET");
  const messagingSenderId = value("FIREBASE_MESSAGING_SENDER_ID");
  const emulatorHost = value("FIREBASE_EMULATOR_HOST");

  return {
    firebase: {
      apiKey: value("FIREBASE_API_KEY")!,
      authDomain: value("FIREBASE_AUTH_DOMAIN")!,
      projectId: value("FIREBASE_PROJECT_ID")!,
      appId: value("FIREBASE_APP_ID")!,
      ...(storageBucket ? { storageBucket } : {}),
      ...(messagingSenderId ? { messagingSenderId } : {}),
    },
    emulator: emulatorHost
      ? {
          host: emulatorHost,
          authPort: parsePort(
            value("FIREBASE_AUTH_EMULATOR_PORT"),
            DEFAULT_AUTH_EMULATOR_PORT,
            "FIREBASE_AUTH_EMULATOR_PORT",
          ),
          firestorePort: parsePort(
            value("FIRESTORE_EMULATOR_PORT"),
            DEFAULT_FIRESTORE_EMULATOR_PORT,
            "FIRESTORE_EMULATOR_PORT",
          ),
        }
      : null,
  };
}

/**
 * Lê a configuração no navegador.
 * As variáveis NEXT_PUBLIC_* precisam aparecer escritas por extenso para o Next
 * conseguir embutir os valores no build.
 */
export function readAppConfig(): AppConfig {
  const runtime: RawConfig =
    (typeof window !== "undefined" ? window.__STONKS_CONFIG__ : undefined) ?? {};

  const build: RawConfig = {
    FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    FIREBASE_EMULATOR_HOST: process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST,
    FIREBASE_AUTH_EMULATOR_PORT: process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT,
    FIRESTORE_EMULATOR_PORT: process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT,
  };

  return parseAppConfig(mergeConfigSources(runtime, build));
}
