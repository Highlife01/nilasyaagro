'use client';

import { useEffect, useEffectEvent } from 'react';
import type { RefObject } from 'react';

const dialogStack: HTMLElement[] = [];
const inertElements = new Map<HTMLElement, { count: number; wasInert: boolean }>();
let previousBodyOverflow = '';

function hideOutsideDialog(dialog: HTMLElement) {
  const hidden: HTMLElement[] = [];
  let child: HTMLElement = dialog;
  while (child.parentElement) {
    for (const sibling of Array.from(child.parentElement.children)) {
      if (sibling === child || !(sibling instanceof HTMLElement) || ['SCRIPT', 'STYLE', 'LINK'].includes(sibling.tagName)) continue;
      const current = inertElements.get(sibling);
      inertElements.set(sibling, { count: (current?.count || 0) + 1, wasInert: current?.wasInert ?? sibling.inert });
      sibling.inert = true;
      hidden.push(sibling);
    }
    if (child.parentElement === document.body) break;
    child = child.parentElement;
  }
  return () => {
    for (const element of hidden) {
      const current = inertElements.get(element);
      if (!current) continue;
      if (current.count > 1) inertElements.set(element, { ...current, count: current.count - 1 });
      else { element.inert = current.wasInert; inertElements.delete(element); }
    }
  };
}

export function useDialogFocus(open: boolean, dialogRef: RefObject<HTMLElement | null>, close: () => void) {
  const closeDialog = useEffectEvent(close);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const focusRoot = dialog.matches('[role="dialog"]') ? dialog : dialog.querySelector<HTMLElement>('[role="dialog"]') || dialog;
    const previousFocus = document.activeElement as HTMLElement | null;
    if (!dialogStack.length) previousBodyOverflow = document.body.style.overflow;
    dialogStack.push(dialog);
    document.body.style.overflow = 'hidden';
    const restoreOutside = hideOutsideDialog(dialog);
    const focusable = () => Array.from(focusRoot.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href], [tabindex]'))
      .filter((element) => element.tabIndex >= 0 && !element.matches(':disabled') && !element.closest('[aria-hidden="true"], [inert]') && element.getClientRects().length > 0);
    const focusFirst = () => (focusRoot.querySelector<HTMLElement>('[data-dialog-autofocus]') || focusable()[0] || focusRoot).focus();
    const active = () => dialogStack.at(-1) === dialog;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!active()) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeDialog(); return; }
      if (event.key !== 'Tab') return;
      const elements = focusable();
      if (!elements.length) { event.preventDefault(); focusRoot.focus(); return; }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === focusRoot || !focusRoot.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !focusRoot.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    const handleFocus = (event: FocusEvent) => {
      if (active() && !focusRoot.contains(event.target as Node)) focusFirst();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocus);
    focusFirst();
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocus);
      const stackIndex = dialogStack.indexOf(dialog);
      if (stackIndex !== -1) dialogStack.splice(stackIndex, 1);
      restoreOutside();
      if (!dialogStack.length) document.body.style.overflow = previousBodyOverflow;
      if (previousFocus?.isConnected && !previousFocus.closest('[inert]')) previousFocus.focus();
    };
  }, [open, dialogRef]);
}
