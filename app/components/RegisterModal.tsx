'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Lock, Mail, User } from 'lucide-react';
import { mapAuthError } from '@/lib/auth/errors';
import {
  hasErrors,
  validateRegisterForm,
  type RegisterFormErrors,
  type RegisterFormValues,
} from '@/lib/auth/validation';
import type { SignUpData } from '@/lib/firebase/auth';
import { Alert } from './ui/Alert';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { TextField } from './ui/TextField';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Cria a conta. Se falhar, o erro é exibido no próprio modal. */
  onRegister: (data: SignUpData) => Promise<void>;
  /** true enquanto o cadastro está sendo enviado: o modal não pode ser fechado. */
  submitting?: boolean;
}

export function RegisterModal({ isOpen, onClose, onRegister, submitting = false }: RegisterModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose} title="Criar conta" dismissible={!submitting}>
      <RegisterForm onCancel={onClose} onRegister={onRegister} />
    </Modal>
  );
}

const EMPTY_FORM: RegisterFormValues = { name: '', email: '', password: '', confirmPassword: '' };

function RegisterForm({
  onCancel,
  onRegister,
}: {
  onCancel: () => void;
  onRegister: RegisterModalProps['onRegister'];
}) {
  const [formData, setFormData] = useState<RegisterFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[name as keyof RegisterFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const validation = validateRegisterForm(formData);
    setErrors(validation);
    if (hasErrors(validation)) {
      // Leva o foco ao primeiro campo com erro, para o leitor de tela anunciar a mensagem.
      const firstInvalid = (Object.keys(EMPTY_FORM) as (keyof RegisterFormValues)[]).find(
        (field) => validation[field],
      );
      if (firstInvalid) {
        requestAnimationFrame(() => {
          (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
        });
      }
      return;
    }

    setSubmitError(null);
    setSubmitting(true);
    try {
      await onRegister({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      // Sucesso: a página de login redireciona para o dashboard.
    } catch (error) {
      setSubmitError(mapAuthError(error));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 p-6">
      <TextField
        label="Nome completo"
        name="name"
        icon={User}
        autoComplete="name"
        placeholder="Seu nome"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        data-autofocus
      />
      <TextField
        label="E-mail"
        type="email"
        name="email"
        icon={Mail}
        autoComplete="email"
        placeholder="seu@email.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <TextField
        label="Senha"
        name="password"
        icon={Lock}
        revealable
        autoComplete="new-password"
        placeholder="••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      <TextField
        label="Confirmar senha"
        name="confirmPassword"
        icon={Lock}
        revealable
        autoComplete="new-password"
        placeholder="••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />

      {submitError && <Alert variant="error">{submitError}</Alert>}

      <div className="space-y-3 pt-4">
        <Button type="submit" className="w-full" loading={submitting}>
          Criar conta
        </Button>
        <Button variant="secondary" className="w-full" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
