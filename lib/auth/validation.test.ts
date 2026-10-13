import { describe, expect, it } from "vitest";
import { hasErrors, isValidEmail, validateRegisterForm, type RegisterFormValues } from "./validation";

const VALID: RegisterFormValues = {
  name: "Paulo Henrique",
  email: "paulo@exemplo.com",
  password: "segredo1",
  confirmPassword: "segredo1",
};

describe("validateRegisterForm", () => {
  it("aceita um cadastro válido", () => {
    const errors = validateRegisterForm(VALID);
    expect(errors).toEqual({});
    expect(hasErrors(errors)).toBe(false);
  });

  it("exige todos os campos", () => {
    expect(
      validateRegisterForm({ name: "", email: "", password: "", confirmPassword: "" }),
    ).toEqual({
      name: "Nome é obrigatório",
      email: "E-mail é obrigatório",
      password: "Senha é obrigatória",
      confirmPassword: "Confirme sua senha",
    });
  });

  it("conta o tamanho do nome sem os espaços das pontas", () => {
    expect(validateRegisterForm({ ...VALID, name: "  ab  " }).name).toBe(
      "Nome deve ter pelo menos 3 caracteres",
    );
    expect(validateRegisterForm({ ...VALID, name: "   " }).name).toBe("Nome é obrigatório");
  });

  it("limita o nome a 80 caracteres", () => {
    expect(validateRegisterForm({ ...VALID, name: "a".repeat(81) }).name).toBe(
      "Nome deve ter no máximo 80 caracteres",
    );
  });

  it("aceita os limites exatos de nome e senha", () => {
    expect(validateRegisterForm({ ...VALID, name: "Ana" }).name).toBeUndefined();
    expect(validateRegisterForm({ ...VALID, name: "a".repeat(80) }).name).toBeUndefined();
    expect(
      validateRegisterForm({ ...VALID, password: "123456", confirmPassword: "123456" }).password,
    ).toBeUndefined();
  });

  it("valida o formato do e-mail", () => {
    expect(validateRegisterForm({ ...VALID, email: "paulo@" }).email).toBe("E-mail inválido");
  });

  it("exige senha com pelo menos 6 caracteres", () => {
    const errors = validateRegisterForm({ ...VALID, password: "12345", confirmPassword: "12345" });
    expect(errors.password).toBe("Senha deve ter pelo menos 6 caracteres");
  });

  it("exige que as senhas coincidam", () => {
    expect(validateRegisterForm({ ...VALID, confirmPassword: "outra-senha" }).confirmPassword).toBe(
      "As senhas não coincidem",
    );
  });
});

describe("isValidEmail", () => {
  it.each(["a@b.co", "  paulo@exemplo.com.br  "])("aceita %j", (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each(["", "paulo", "paulo@", "@exemplo.com", "pa ulo@exemplo.com", "paulo@exemplo"])(
    "rejeita %j",
    (email) => {
      expect(isValidEmail(email)).toBe(false);
    },
  );
});
