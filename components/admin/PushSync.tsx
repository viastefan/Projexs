'use client';

import { useEffect } from 'react';
import { syncPushAction } from '@/app/admin/actions/push';
import { currentSubscription, describeDevice, rememberEndpoint, storedEndpoint } from './push-client';

/**
 * Browser erneuern ihr Push-Abo gelegentlich von sich aus. Beim Öffnen der App
 * wird ein neues Abo nachgetragen — sonst kämen danach still keine
 * Benachrichtigungen mehr an. Ohne Änderung passiert nichts.
 */
export function PushSync() {
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    const previous = storedEndpoint();
    if (!previous) return;

    currentSubscription()
      .then(async (subscription) => {
        if (!subscription || subscription.endpoint === previous) return;
        const { endpoint, keys } = subscription.toJSON();
        await syncPushAction({ endpoint, keys, device: describeDevice() }, previous);
        rememberEndpoint(subscription.endpoint);
      })
      .catch(() => undefined);
  }, []);

  return null;
}
