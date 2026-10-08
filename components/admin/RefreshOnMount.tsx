'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** Lädt einmal nach: z. B. damit Liste und Zähler zeigen, dass eine Anfrage jetzt gelesen ist. */
export function RefreshOnMount() {
  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, [router]);
  return null;
}
