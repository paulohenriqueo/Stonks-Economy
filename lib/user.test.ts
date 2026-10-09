import { describe, expect, it } from "vitest";
import { displayNameFor, firstName, NAME_MAX_LENGTH } from "./user";

describe("displayNameFor", () => {
  it("usa o displayName do Auth", () => {
    expect(displayNameFor({ displayName: "Paulo Araújo", email: "p@x.com" })).toBe("Paulo Araújo");
  });

  it("usa a parte do e-mail antes do @ quando não há nome", () => {
    expect(displayNameFor({ displayName: null, email: "paulo.henrique@x.com" })).toBe(
      "paulo.henrique",
    );
    expect(displayNameFor({ displayName: "   ", email: "ana@x.com" })).toBe("ana");
  });

  it("tem um nome padrão quando não há nome nem e-mail", () => {
    expect(displayNameFor({ displayName: null, email: null })).toBe("Usuário");
  });

  it("limita o tamanho do nome", () => {
    const name = displayNameFor({ displayName: "a".repeat(200), email: null });
    expect(name).toHaveLength(NAME_MAX_LENGTH);
  });
});

describe("firstName", () => {
  it("pega o primeiro nome", () => {
    expect(firstName("  Paulo   Henrique Araújo ")).toBe("Paulo");
    expect(firstName("Ana")).toBe("Ana");
  });
});
