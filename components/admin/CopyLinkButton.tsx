'use client';

import { useState } from 'react';
import { Check, Link2 } from 'lucide-react';
import ui from './ui.module.css';

/** Kopiert einen Link in die Zwischenablage — zum Weitergeben per Mail oder Nachricht. */
export function CopyLinkButton({ url, label = 'Link kopieren' }: { url: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Ohne Zugriff auf die Zwischenablage: zum Markieren und Kopieren anzeigen.
      window.prompt('Link kopieren:', url);
    }
  }

  return (
    <button type="button" className={`${ui.button} ${ui.ghost}`} onClick={copy}>
      {copied ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />} {copied ? 'Kopiert' : label}
    </button>
  );
}
