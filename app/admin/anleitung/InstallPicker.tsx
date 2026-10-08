'use client';

import { useState, useSyncExternalStore } from 'react';
import { InstallDemo, InstallSteps, type DemoKind } from '@/components/install-prompt/InstallDemo';
import { detectPlatform } from '@/components/install-prompt/platform';
import styles from './anleitung.module.css';

const TABS: { kind: DemoKind; label: string }[] = [
  { kind: 'ios', label: 'iPhone' },
  { kind: 'android', label: 'Android' },
  { kind: 'desktop', label: 'Computer' },
];

function detectedKind(): DemoKind {
  const platform = detectPlatform();
  if (platform === 'ios' || platform === 'ios-other') return 'ios';
  if (platform === 'android') return 'android';
  if (platform === 'mac-safari') return 'mac';
  return 'desktop';
}

const noSubscription = () => () => {};

/** Film und Schritte für das Gerät, auf dem die Anleitung gerade offen ist — umschaltbar. */
export function InstallPicker() {
  const detected = useSyncExternalStore<DemoKind>(noSubscription, detectedKind, () => 'ios');
  const [chosen, setChosen] = useState<DemoKind | null>(null);
  const kind = chosen ?? detected;
  const tab = kind === 'mac' ? 'desktop' : kind;

  return (
    <div className={styles.install}>
      <div className={styles.tabs} role="tablist" aria-label="Gerät">
        {TABS.map((item) => (
          <button
            key={item.kind}
            type="button"
            role="tab"
            aria-selected={tab === item.kind}
            className={styles.tab}
            onClick={() => setChosen(item.kind === 'desktop' && detected === 'mac' ? 'mac' : item.kind)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.installBody} key={kind}>
        <div className={styles.installFilm}>
          <InstallDemo kind={kind} icon="/app-icons/projexs-192.png" name="Praxis" />
        </div>
        <InstallSteps kind={kind} />
      </div>
    </div>
  );
}
