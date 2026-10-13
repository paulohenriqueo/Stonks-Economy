"use client";

import { useEffect, useEffectEvent, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusableIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
}

/** Mantém o Tab circulando dentro do modal. */
function trapFocus(event: KeyboardEvent, root: HTMLElement) {
  const items = focusableIn(root);
  if (items.length === 0) {
    event.preventDefault();
    root.focus();
    return;
  }
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && (active === first || !root.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !root.contains(active))) {
    event.preventDefault();
    first.focus();
  }
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** false enquanto algo está em andamento (ex.: envio do formulário): não fecha. */
  dismissible?: boolean;
  children: ReactNode;
}

/**
 * Modal acessível: fecha com Esc, clique fora ou X; prende o foco e o devolve ao fechar.
 * O conteúdo só é montado enquanto está aberto, então formulários começam limpos.
 * Para escolher o campo que recebe o foco inicial, marque-o com data-autofocus.
 */
export function Modal({ open, onClose, title, dismissible = true, children }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const requestClose = () => {
    if (dismissible) onClose();
  };
  const close = useEffectEvent(requestClose);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (panel) {
      const initial =
        panel.querySelector<HTMLElement>("[data-autofocus]") ?? focusableIn(panel)[0] ?? panel;
      initial.focus();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "Tab" && panel) {
        trapFocus(event, panel);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={requestClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-surface-light bg-surface shadow-soft focus:outline-hidden"
      >
        <div className="flex items-center justify-between border-b border-surface-light p-6">
          <h2 id={titleId} className="text-2xl font-semibold text-text-primary">
            {title}
          </h2>
          <button
            type="button"
            onClick={requestClose}
            disabled={!dismissible}
            aria-label="Fechar"
            className="rounded-lg p-1 text-text-secondary transition-colors hover:bg-background-secondary hover:text-text-primary focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
