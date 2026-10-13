import { describe, expect, it } from "vitest";
import { HOME_PATH, loginPathFor, safeRedirectPath } from "./navigation";

describe("safeRedirectPath", () => {
  it.each([
    ["/dashboard", "/dashboard"],
    ["/contas?mes=2026-10#topo", "/contas?mes=2026-10#topo"],
    ["/projecao/", "/projecao/"],
  ])("aceita o caminho interno %s", (next, expected) => {
    expect(safeRedirectPath(next)).toBe(expected);
  });

  it.each([
    [null],
    [undefined],
    [""],
    ["dashboard"],
    ["https://malicioso.com"],
    ["//malicioso.com"],
    ["/\\malicioso.com"],
    ["/\t/malicioso.com"],
    ["javascript:alert(1)"],
    // Segmentos de ponto: a URL normaliza para "//malicioso.com" depois da checagem de origem.
    ["/.//malicioso.com"],
    ["/%2e//malicioso.com"],
    ["/%2E//malicioso.com"],
    ["/x/..//malicioso.com"],
    ["/..//malicioso.com"],
    ["/a/../..//malicioso.com"],
    ["/.\\/malicioso.com"],
    ["/./\\malicioso.com"],
  ])("cai no dashboard para o destino inseguro %j", (next) => {
    expect(safeRedirectPath(next)).toBe(HOME_PATH);
  });

  it("nunca devolve um caminho que o navegador resolveria para outro site", () => {
    const payloads = ["/.//x.com", "/%2e%2e//x.com", "/b/%2e%2e//x.com", "/.\\\\x.com", "/\n//x.com"];
    for (const payload of payloads) {
      const target = safeRedirectPath(payload);
      expect(new URL(target, "https://app.exemplo").origin).toBe("https://app.exemplo");
    }
  });

  it("aceita barras duplicadas no meio do caminho (continuam internas)", () => {
    expect(safeRedirectPath("/contas//x")).toBe("/contas//x");
  });

  it("não volta para o login nem para a raiz (evita loop)", () => {
    expect(safeRedirectPath("/login")).toBe(HOME_PATH);
    expect(safeRedirectPath("/login?next=/contas")).toBe(HOME_PATH);
    expect(safeRedirectPath("/")).toBe(HOME_PATH);
  });
});

describe("loginPathFor", () => {
  it("não adiciona ?next= para o dashboard", () => {
    expect(loginPathFor("/dashboard")).toBe("/login");
  });

  it("guarda a página atual em ?next=", () => {
    expect(loginPathFor("/contas?mes=2026-10")).toBe("/login?next=%2Fcontas%3Fmes%3D2026-10");
  });

  it("ignora destinos inseguros", () => {
    expect(loginPathFor("//malicioso.com")).toBe("/login");
  });
});
