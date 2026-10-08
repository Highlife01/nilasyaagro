'use client';

import { useEffect } from 'react';
import type { RefObject } from 'react';

export function useDialogFocus(open: boolean, dialogRef: RefObject<HTMLElement | null>, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href], [tabindex]') || [])
      .filter((element) => element.tabIndex >= 0 && !element.hasAttribute('disabled') && !element.closest('[aria-hidden="true"]') && element.getClientRects().length > 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close(); return; }
      if (event.key !== 'Tab') return;
      const elements = focusable();
      if (!elements.length) { event.preventDefault(); dialogRef.current?.focus(); return; }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    (dialogRef.current?.querySelector<HTMLElement>('[data-dialog-autofocus]') || focusable()[0] || dialogRef.current)?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open, dialogRef, close]);
}
