// Testes das regras do Firestore para users/{uid}. Rodam contra o emulador:
//   docker compose exec web npm run test:rules
// Sem Docker (emulador local rodando): FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run test:rules

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  setLogLevel,
  Timestamp,
  updateDoc,
  type Firestore,
} from "firebase/firestore";

// Projeto próprio para os testes: não mistura com os dados do app (demo-stonks-economy).
const PROJECT_ID = "demo-stonks-economy-rules";
const ALICE = { uid: "alice", email: "alice@exemplo.com" };
const BOB = { uid: "bob", email: "bob@exemplo.com" };

let env: RulesTestEnvironment;

beforeAll(async () => {
  setLogLevel("error");
  env = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(fileURLToPath(new URL("../../firestore.rules", import.meta.url)), "utf8"),
    },
  });
});

afterAll(async () => {
  await env?.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
});

// O rules-unit-testing devolve a instância "compat" do Firestore. As funções modulares
// (doc, getDoc...) aceitam essa instância em runtime; o cast só ajusta os tipos.
function asModular(db: unknown): Firestore {
  return db as Firestore;
}

function dbAs(user: { uid: string; email: string }): Firestore {
  return asModular(env.authenticatedContext(user.uid, { email: user.email }).firestore());
}

function anonymousDb(): Firestore {
  return asModular(env.unauthenticatedContext().firestore());
}

function newProfile(overrides: Record<string, unknown> = {}) {
  return { nome: "Alice", email: ALICE.email, criadoEm: serverTimestamp(), ...overrides };
}

async function seedProfile(uid: string, data: Record<string, unknown>) {
  await env.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(asModular(context.firestore()), "users", uid), data);
  });
}

const STORED_PROFILE = {
  nome: "Alice",
  email: ALICE.email,
  criadoEm: Timestamp.fromDate(new Date("2026-10-01T12:00:00Z")),
};

describe("users/{uid}: leitura", () => {
  it("o dono lê o próprio perfil", async () => {
    await seedProfile(ALICE.uid, STORED_PROFILE);
    await assertSucceeds(getDoc(doc(dbAs(ALICE), "users", ALICE.uid)));
  });

  it("o dono consegue ler o próprio perfil mesmo antes de existir", async () => {
    await assertSucceeds(getDoc(doc(dbAs(ALICE), "users", ALICE.uid)));
  });

  it("outro usuário não lê o perfil", async () => {
    await seedProfile(ALICE.uid, STORED_PROFILE);
    await assertFails(getDoc(doc(dbAs(BOB), "users", ALICE.uid)));
  });

  it("visitante sem login não lê nada", async () => {
    await seedProfile(ALICE.uid, STORED_PROFILE);
    await assertFails(getDoc(doc(anonymousDb(), "users", ALICE.uid)));
  });

  it("ninguém lista a coleção de usuários", async () => {
    await seedProfile(ALICE.uid, STORED_PROFILE);
    await assertFails(getDocs(collection(dbAs(ALICE), "users")));
  });
});

describe("users/{uid}: criação", () => {
  it("o dono cria o próprio perfil válido", async () => {
    await assertSucceeds(setDoc(doc(dbAs(ALICE), "users", ALICE.uid), newProfile()));
  });

  it("o e-mail é opcional", async () => {
    await assertSucceeds(
      setDoc(doc(dbAs(ALICE), "users", ALICE.uid), { nome: "Alice", criadoEm: serverTimestamp() }),
    );
  });

  // Os dados abaixo seriam válidos para o próprio autor: só a checagem de dono pode negar.
  it("não cria perfil de outro usuário", async () => {
    await assertFails(
      setDoc(doc(dbAs(BOB), "users", ALICE.uid), newProfile({ nome: "Bob", email: BOB.email })),
    );
    await assertFails(
      setDoc(doc(dbAs(BOB), "users", ALICE.uid), { nome: "Bob", criadoEm: serverTimestamp() }),
    );
  });

  it("visitante sem login não cria perfil", async () => {
    await assertFails(
      setDoc(doc(anonymousDb(), "users", ALICE.uid), { nome: "X", criadoEm: serverTimestamp() }),
    );
  });

  it("rejeita campos extras", async () => {
    await assertFails(
      setDoc(doc(dbAs(ALICE), "users", ALICE.uid), newProfile({ admin: true })),
    );
  });

  it("rejeita e-mail diferente do da conta", async () => {
    await assertFails(
      setDoc(doc(dbAs(ALICE), "users", ALICE.uid), newProfile({ email: BOB.email })),
    );
  });

  it("exige criadoEm com a hora do servidor", async () => {
    await assertFails(
      setDoc(
        doc(dbAs(ALICE), "users", ALICE.uid),
        newProfile({ criadoEm: Timestamp.fromDate(new Date("2020-01-01")) }),
      ),
    );
    await assertFails(
      setDoc(doc(dbAs(ALICE), "users", ALICE.uid), { nome: "Alice", email: ALICE.email }),
    );
  });

  it.each([
    ["vazio", ""],
    ["longo demais", "a".repeat(81)],
    ["que é número", 123],
    // Lista e mapa têm size(): só a checagem `is string` barra esses casos.
    ["que é lista", ["Alice"]],
    ["que é mapa", { a: 1 }],
  ])("rejeita nome %s", async (_caso, nome) => {
    await assertFails(setDoc(doc(dbAs(ALICE), "users", ALICE.uid), newProfile({ nome })));
  });

  it.each([
    ["com 1 caractere", "A"],
    ["com 80 caracteres", "a".repeat(80)],
    ["com 80 caracteres acentuados", "é".repeat(80)],
  ])("aceita nome %s", async (_caso, nome) => {
    await assertSucceeds(setDoc(doc(dbAs(ALICE), "users", ALICE.uid), newProfile({ nome })));
  });
});

describe("users/{uid}: atualização e exclusão", () => {
  beforeEach(async () => {
    await seedProfile(ALICE.uid, STORED_PROFILE);
  });

  it("o dono muda o próprio nome", async () => {
    await assertSucceeds(updateDoc(doc(dbAs(ALICE), "users", ALICE.uid), { nome: "Alice Souza" }));
  });

  it("não muda outros campos", async () => {
    await assertFails(updateDoc(doc(dbAs(ALICE), "users", ALICE.uid), { email: BOB.email }));
    await assertFails(
      updateDoc(doc(dbAs(ALICE), "users", ALICE.uid), { criadoEm: serverTimestamp() }),
    );
    await assertFails(updateDoc(doc(dbAs(ALICE), "users", ALICE.uid), { admin: true }));
  });

  it("não muda outros campos nem junto com o nome", async () => {
    const ref = doc(dbAs(ALICE), "users", ALICE.uid);
    await assertFails(updateDoc(ref, { nome: "Alice Souza", email: BOB.email }));
    await assertFails(updateDoc(ref, { nome: "Alice Souza", admin: true }));
    await assertFails(updateDoc(ref, { nome: "Alice Souza", criadoEm: serverTimestamp() }));
  });

  it("não aceita nome inválido na atualização", async () => {
    const ref = doc(dbAs(ALICE), "users", ALICE.uid);
    await assertFails(updateDoc(ref, { nome: "" }));
    await assertFails(updateDoc(ref, { nome: "a".repeat(81) }));
    await assertFails(updateDoc(ref, { nome: ["Alice"] }));
  });

  it("aceita nome com 80 caracteres na atualização", async () => {
    await assertSucceeds(updateDoc(doc(dbAs(ALICE), "users", ALICE.uid), { nome: "a".repeat(80) }));
  });

  it("outro usuário não altera o perfil", async () => {
    await assertFails(updateDoc(doc(dbAs(BOB), "users", ALICE.uid), { nome: "Hackeado" }));
  });

  it("ninguém apaga o perfil", async () => {
    await assertFails(deleteDoc(doc(dbAs(ALICE), "users", ALICE.uid)));
  });
});

describe("tudo fora do perfil é negado por padrão", () => {
  it("subcoleções do próprio usuário ainda não estão liberadas (fase 2)", async () => {
    await assertFails(
      setDoc(doc(dbAs(ALICE), "users", ALICE.uid, "meses", "2026-10"), { salarioCentavos: 1 }),
    );
    await assertFails(getDoc(doc(dbAs(ALICE), "users", ALICE.uid, "meses", "2026-10")));
  });

  it("coleções fora de users/ são negadas", async () => {
    await assertFails(setDoc(doc(dbAs(ALICE), "qualquer", "coisa"), { a: 1 }));
    await assertFails(getDoc(doc(dbAs(ALICE), "qualquer", "coisa")));
  });
});
