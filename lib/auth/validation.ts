// Validação dos formulários de autenticação (funções puras).

import { NAME_MAX_LENGTH } from "@/lib/user";

export const NAME_MIN_LENGTH = 3;
/** Mínimo exigido pelo Firebase Auth. */
export const PASSWORD_MIN_LENGTH = 6;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>;

export function validateRegisterForm(values: RegisterFormValues): RegisterFormErrors {
  const errors: RegisterFormErrors = {};

  const name = values.name.trim();
  if (!name) {
    errors.name = "Nome é obrigatório";
  } else if (name.length < NAME_MIN_LENGTH) {
    errors.name = `Nome deve ter pelo menos ${NAME_MIN_LENGTH} caracteres`;
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.name = `Nome deve ter no máximo ${NAME_MAX_LENGTH} caracteres`;
  }

  if (!values.email.trim()) {
    errors.email = "E-mail é obrigatório";
  } else if (!isValidEmail(values.email)) {
    errors.email = "E-mail inválido";
  }

  if (!values.password) {
    errors.password = "Senha é obrigatória";
  } else if (values.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirme sua senha";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "As senhas não coincidem";
  }

  return errors;
}

export function hasErrors(errors: RegisterFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}
