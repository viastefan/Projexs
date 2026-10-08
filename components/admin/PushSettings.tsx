'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { Bell, BellOff, Send, Trash2 } from 'lucide-react';
import { disablePushAction, enablePushAction, removePushDeviceAction, testPushAction } from '@/app/admin/actions/push';
import { idle, type ActionState } from '@/app/admin/actions/state';
import styles from '@/app/admin/(app)/pages.module.css';
import { FormMessage } from './FormMessage';
import {
  currentSubscription,
  describeDevice,
  forgetEndpoint,
  keyBytes,
  pushSupport,
  registerWorker,
  rememberEndpoint,
  subscribedWithKey,
  type PushSupport,
} from './push-client';
import ui from './ui.module.css';

export type PushDevice = { id: string; device: string; since: string; endpoint: string };

const noSubscription = () => () => {};
const onServer = (): PushSupport | 'checking' => 'checking';

export function PushSettings({ publicKey, devices }: { publicKey: string | null; devices: PushDevice[] }) {
  // Browserfähigkeiten gibt es erst im Browser — auf dem Server „wird geprüft“.
  const support = useSyncExternalStore<PushSupport | 'checking'>(noSubscription, pushSupport, onServer);
  // undefined: noch nicht nachgesehen, null: dieser Browser hat kein Abo
  const [endpoint, setEndpoint] = useState<string | null | undefined>(undefined);
  const [state, setState] = useState<ActionState>(idle);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (support !== 'ok') return;
    let cancelled = false;
    currentSubscription()
      .then((subscription) => !cancelled && setEndpoint(subscription?.endpoint ?? null))
      .catch(() => !cancelled && setEndpoint(null));
    return () => {
      cancelled = true;
    };
  }, [support]);

  const active = Boolean(endpoint && devices.some((device) => device.endpoint === endpoint));
  const others = devices.filter((device) => device.endpoint !== endpoint);

  async function run(task: () => Promise<ActionState>) {
    setBusy(true);
    setState(idle);
    try {
      setState(await task());
    } catch (error) {
      console.error('[Push]', error);
      setState({ status: 'error', message: 'Das hat nicht geklappt. Bitte noch einmal versuchen.' });
    } finally {
      setBusy(false);
    }
  }

  const enable = () =>
    run(async () => {
      if (!publicKey) return { status: 'error', message: 'Push ist auf dem Server noch nicht bereit.' };
      // Die Erlaubnis zuerst: iOS fragt nur, wenn das unmittelbar auf ein Tippen folgt.
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return {
          status: 'error',
          message:
            permission === 'denied'
              ? 'Benachrichtigungen sind abgelehnt. In den Einstellungen des Geräts lassen sie sich wieder erlauben.'
              : 'Ohne Erlaubnis kann die App keine Benachrichtigungen zeigen.',
        };
      }
      const registration = await registerWorker();
      let subscription = await registration.pushManager.getSubscription();
      if (subscription && !subscribedWithKey(subscription, publicKey)) {
        await subscription.unsubscribe();
        subscription = null;
      }
      subscription ??= await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: keyBytes(publicKey),
      });
      const { endpoint: address, keys } = subscription.toJSON();
      const result = await enablePushAction({ endpoint: address, keys, device: describeDevice() });
      if (result.status === 'ok') {
        rememberEndpoint(subscription.endpoint);
        setEndpoint(subscription.endpoint);
      }
      return result;
    });

  const disable = () =>
    run(async () => {
      const subscription = await currentSubscription();
      const result = await disablePushAction(subscription?.endpoint ?? endpoint ?? '');
      await subscription?.unsubscribe();
      forgetEndpoint();
      setEndpoint(null);
      return result;
    });

  const remove = (device: PushDevice) => {
    if (!window.confirm(`${device.device} keine Benachrichtigungen mehr schicken?`)) return;
    void run(() => removePushDeviceAction(device.id));
  };

  return (
    <div className={ui.stack}>
      {support === 'checking' || (support === 'ok' && endpoint === undefined) ? (
        <p className={ui.hint}>Wird geprüft …</p>
      ) : null}

      {support === 'install' ? (
        <div className={`${ui.notice} ${ui.noticeInfo}`}>
          <span>
            Auf iPhone und iPad kommen Benachrichtigungen nur in der installierten App an: in Safari auf „Teilen“
            tippen, „Zum Home-Bildschirm“ wählen, die Admin-App dort öffnen und Push hier einschalten.
          </span>
        </div>
      ) : null}
      {support === 'unsupported' ? (
        <p className={ui.hint}>Dieser Browser kann keine Push-Benachrichtigungen empfangen.</p>
      ) : null}
      {support === 'denied' ? (
        <p className={ui.hint}>
          Benachrichtigungen sind für die App blockiert. In den Einstellungen des Geräts bzw. des Browsers lassen sie
          sich wieder erlauben.
        </p>
      ) : null}

      {support === 'ok' && endpoint !== undefined ? (
        <div className={ui.row}>
          <span className={`${ui.chip} ${active ? ui.chipOk : ui.chipNeutral}`}>
            {active ? 'Auf diesem Gerät eingeschaltet' : 'Auf diesem Gerät aus'}
          </span>
        </div>
      ) : null}

      {support === 'ok' && endpoint !== undefined ? (
        <div className={ui.row}>
          {active ? (
            <>
              <button type="button" className={`${ui.button} ${ui.secondary}`} onClick={() => run(testPushAction)} disabled={busy}>
                <Send aria-hidden="true" /> Test senden
              </button>
              <button type="button" className={`${ui.button} ${ui.ghost}`} onClick={disable} disabled={busy}>
                <BellOff aria-hidden="true" /> Ausschalten
              </button>
            </>
          ) : (
            <button
              type="button"
              className={`${ui.button} ${ui.primary}`}
              onClick={enable}
              disabled={busy || !publicKey}
            >
              <Bell aria-hidden="true" /> {busy ? 'Wird eingeschaltet …' : 'Auf diesem Gerät einschalten'}
            </button>
          )}
        </div>
      ) : null}

      <FormMessage state={state} />

      {others.length > 0 ? (
        <div className={ui.stack}>
          <h3 className={ui.label}>Weitere Geräte mit Push</h3>
          <div className={styles.list}>
            {others.map((device) => (
              <div key={device.id} className={styles.listItem}>
                <span className={styles.listMain}>
                  <span className={styles.listTitle}>
                    <span>{device.device}</span>
                  </span>
                  <span className={styles.listMeta}>seit {device.since}</span>
                </span>
                <button
                  type="button"
                  className={`${ui.button} ${ui.ghost}`}
                  onClick={() => remove(device)}
                  disabled={busy}
                  aria-label={`${device.device} abmelden`}
                >
                  <Trash2 aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
