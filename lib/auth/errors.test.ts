import { describe, expect, it } from "vitest";
import { authErrorCode, GENERIC_AUTH_ERROR, mapAuthError } from "./errors";

describe("mapAuthError", () => {
  it("usa a mesma mensagem para senha errada e usuário inexistente", () => {
    const messages = [
      "auth/invalid-credential",
      "auth/wrong-password",
      "auth/user-not-found",
    ].map((code) => mapAuthError({ code }));
    expect(new Set(messages)).toEqual(new Set(["E-mail ou senha inválidos."]));
  });

  it("traduz erros conhecidos", () => {
    expect(mapAuthError({ code: "auth/email-already-in-use" })).toBe(
      "Este e-mail já está cadastrado.",
    );
    expect(mapAuthError({ code: "auth/too-many-requests" })).toMatch(/Muitas tentativas/);
  });

  it("tem mensagem genérica para erros desconhecidos", () => {
    expect(mapAuthError({ code: "auth/algo-novo" })).toBe(GENERIC_AUTH_ERROR);
    expect(mapAuthError(new Error("boom"))).toBe(GENERIC_AUTH_ERROR);
    expect(mapAuthError(null)).toBe(GENERIC_AUTH_ERROR);
    expect(mapAuthError("texto")).toBe(GENERIC_AUTH_ERROR);
  });
});

describe("authErrorCode", () => {
  it("extrai o código quando existe", () => {
    expect(authErrorCode({ code: "auth/user-not-found" })).toBe("auth/user-not-found");
  });

  it("retorna null quando não há código em texto", () => {
    expect(authErrorCode({ code: 42 })).toBeNull();
    expect(authErrorCode(undefined)).toBeNull();
  });
});
