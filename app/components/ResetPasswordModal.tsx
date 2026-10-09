'use client';

import { useId, useState, type FormEvent } from 'react';
import { Mail } from 'lucide-react';
import { authErrorCode, mapAuthError } from '@/lib/auth/errors';
import { isValidEmail } from '@/lib/auth/validation';
import { requestPasswordReset } from '@/lib/firebase/auth';
import { Alert } from './ui/Alert';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { TextField } from './ui/TextField';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** E-mail já digitado na tela de login, para não precisar digitar de novo. */
  initialEmail?: string;
}

export function ResetPasswordModal({ isOpen, onClose, initialEmail = '' }: ResetPasswordModalProps) {
  // Enquanto o pedido está sendo enviado o modal não fecha, para o resultado não se perder.
  const [sending, setSending] = useState(false);
  return (
    <Modal open={isOpen} onClose={onClose} title="Recuperar senha" dismissible={!sending}>
      <ResetPasswordForm initialEmail={initialEmail} onClose={onClose} onSendingChange={setSending} />
    </Modal>
  );
}

type Status = 'idle' | 'sending' | 'sent';

interface ResetPasswordFormProps {
  initialEmail: string;
  onClose: () => void;
  onSendingChange: (sending: boolean) => void;
}

function ResetPasswordForm({ initialEmail, onClose, onSendingChange }: ResetPasswordFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatusState] = useState<Status>('idle');
  const setStatus = (next: Status) => {
    setStatusState(next);
    onSendingChange(next === 'sending');
  };
  // Erro de preenchimento (fica no campo) e erro do envio (alerta), como no cadastro.
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const successId = useId();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitError(null);
    if (!isValidEmail(email)) {
      setFieldError('Informe um e-mail válido.');
      // Volta o foco ao campo, para o leitor de tela anunciar o erro.
      requestAnimationFrame(() => (form.elements.namedItem('email') as HTMLElement | null)?.focus());
      return;
    }
    setFieldError(null);
    setStatus('sending');
    try {
      await requestPasswordReset(email);
      setStatus('sent');
    } catch (err) {
      // Mesmo resultado para e-mail sem conta: não revela quem é cadastrado.
      if (authErrorCode(err) === 'auth/user-not-found') {
        setStatus('sent');
        return;
      }
      setSubmitError(mapAuthError(err));
      setStatus('idle');
    }
  };

  if (status === 'sent') {
    return (
      <div className="space-y-4 p-6">
        <Alert variant="success" id={successId}>
          Se existir uma conta com <strong>{email.trim()}</strong>, você vai receber um e-mail com o
          link para criar uma nova senha.
        </Alert>
        <Button className="w-full" onClick={onClose} aria-describedby={successId} autoFocus>
          Voltar ao login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 p-6">
      <p className="text-sm text-text-muted">
        Informe o e-mail da sua conta e enviaremos um link para você criar uma nova senha.
      </p>
      <TextField
        label="E-mail"
        type="email"
        name="email"
        icon={Mail}
        autoComplete="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldError ?? undefined}
        data-autofocus
      />

      {submitError && <Alert variant="error">{submitError}</Alert>}

      <div className="space-y-3 pt-2">
        <Button type="submit" className="w-full" loading={status === 'sending'}>
          Enviar link
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={onClose}
          disabled={status === 'sending'}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
