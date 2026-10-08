import type { Metadata } from 'next';
import { site } from '@/content/site';
import { headers } from 'next/headers';
import { ArrowDown, ArrowRight, Film, KeyRound, LifeBuoy, ShieldCheck } from 'lucide-react';
import { OFFER_APP_INSTALL } from '@/components/admin/installOffer';
import { InstallPicker } from './InstallPicker';
import { InboxFilm, LoginFilm, PushFilm, VideoFilm } from './Mockups';
import { Reveal } from './Reveal';
import styles from './anleitung.module.css';

/*
 * Anleitung für Anna — ein Link, der per WhatsApp verschickt wird. Öffentlich
 * (kein Anmelden nötig), aber nicht in Suchmaschinen. Enthält keine
 * Zugangsdaten: Die kommen getrennt von der technischen Betreuung.
 */

const TITLE = 'Ihre Praxis-App – so geht’s';
const DESCRIPTION = OFFER_APP_INSTALL
  ? 'In fünf Minuten startklar: anmelden, als App aufs Handy, Anfragen beantworten, Impulsvideos hochladen.'
  : 'In fünf Minuten startklar: anmelden, Anfragen beantworten, Impulsvideos hochladen.';

export async function generateMetadata(): Promise<Metadata> {
  // Absolute Adresse der Vorschau vom aufgerufenen Host — solange die Domain
  // noch auf die alte Seite zeigt, fände WhatsApp das Bild dort nicht.
  const incoming = await headers();
  const host = incoming.get('x-forwarded-host') ?? incoming.get('host') ?? new URL(site.url).host;
  const proto = incoming.get('x-forwarded-proto') ?? (host.startsWith('127.') || host.startsWith('localhost') ? 'http' : 'https');
  const origin = `${proto}://${host}`;
  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      noarchive: true,
      nosnippet: true,
      googleBot: { index: false, follow: false, noimageindex: true },
    },
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      siteName: 'Praxis-App · Anna Kipp-Menke',
      title: TITLE,
      description: DESCRIPTION,
      url: `${origin}/admin/anleitung`,
      images: [{ url: `${origin}/images/anleitung-vorschau.jpg`, width: 1200, height: 630, alt: 'Ihre Praxis-App – so geht’s' }],
    },
    twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
  };
}

type Step = {
  id: string;
  title: string;
  text: React.ReactNode;
  points?: React.ReactNode[];
  film: React.ReactNode;
};

const STEPS: Step[] = [
  {
    id: 'anmelden',
    title: 'Anmelden',
    text: (
      <>
        Öffnen Sie die Praxis-App und geben Sie Ihre <strong>sechsstellige PIN</strong> ein — schon sind Sie drin.
        Auf diesem Gerät bleiben Sie dann 14 Tage angemeldet.
      </>
    ),
    points: ['Die PIN bekommen Sie von Stefan.', 'Der Link zur App steht unten auf dieser Seite.'],
    film: <LoginFilm />,
  },
];

const STEPS_AFTER: Step[] = [
  {
    id: 'push',
    title: 'Benachrichtigungen einschalten',
    text: (
      <>
        Unter <strong>Einstellungen → Push-Benachrichtigung</strong> den Schalter antippen und „Erlauben“. Dann
        meldet sich Ihr Handy bei jeder neuen Anfrage.
      </>
    ),
    points: [
      'Auf dem Sperrbildschirm steht nur „Neue Anfrage“ — nie ein Name oder Inhalt.',
      'Einmal pro Gerät; die Übersicht erinnert Sie daran.',
    ],
    film: <PushFilm />,
  },
  {
    id: 'anfragen',
    title: 'Anfragen lesen und beantworten',
    text: (
      <>
        Unter <strong>Anfragen</strong> steht alles, was über das Kontaktformular kommt. Antippen, lesen, mit{' '}
        <strong>„Per E-Mail antworten“</strong> öffnet sich Ihr Mailprogramm mit der richtigen Adresse.
      </>
    ),
    points: ['Neue Anfragen sind blau markiert.', 'Nach der Frist aus den Einstellungen werden sie automatisch gelöscht.'],
    film: <InboxFilm />,
  },
  {
    id: 'video',
    title: 'Impulsvideo hochladen',
    text: (
      <>
        Im Monat auf <strong>„Video hochladen“</strong> tippen und Ihr geschnittenes Video auswählen — direkt vom
        Handy. Das Intro kommt automatisch davor. Steht der Impuls auf <strong>„Veröffentlicht“</strong>, ist das
        Video danach auf der Website.
      </>
    ),
    points: [
      'Hochkant oder quer, iPhone- und Android-Videos gleichermaßen.',
      'Die Verarbeitung dauert etwas; Sie können die App dabei schließen.',
    ],
    film: <VideoFilm />,
  },
];

function StepSection({ step, number }: { step: Step; number: number }) {
  return (
    <section className={styles.step} id={step.id} aria-labelledby={`${step.id}-titel`} data-play="false">
      <div className={styles.stepText} data-reveal="">
        <span className={styles.stepNumber}>{number}</span>
        <h2 className={styles.stepTitle} id={`${step.id}-titel`}>
          {step.title}
        </h2>
        <p className={styles.stepLead}>{step.text}</p>
        {step.points ? (
          <ul className={styles.points}>
            {step.points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className={styles.stepFilm} data-reveal="">
        {step.film}
      </div>
    </section>
  );
}

const TIPS = [
  {
    icon: KeyRound,
    title: 'PIN vergessen oder Handy verloren?',
    text: 'Kurz bei Stefan melden — in den Einstellungen gibt es dafür „Technische Hilfe per E-Mail“.',
  },
  {
    icon: ShieldCheck,
    title: 'Vertraulich',
    text: 'Anfragen liegen geschützt in der App, in einem Rechenzentrum in Frankfurt. Push zeigt nie Namen oder Inhalte.',
  },
  {
    icon: LifeBuoy,
    title: 'Etwas klappt nicht?',
    text: 'Die technische Betreuung wird automatisch benachrichtigt. Sie sehen nur einen ruhigen Hinweis und müssen nichts tun.',
  },
  {
    icon: Film,
    title: 'Sie bestimmen, wann',
    text: '„Entwurf“ bleibt in der App, „Angekündigt“ zeigt den Monat als demnächst, „Veröffentlicht“ bringt Text und Video auf die Website.',
  },
];

export default function GuidePage() {
  let number = 0;

  return (
    <div className={styles.page}>
      <Reveal />
      <div className={styles.aurora} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <header className={styles.bar}>
        <span className={styles.barBrand}>
          {/* eslint-disable-next-line @next/next/no-img-element -- kleines statisches Symbol */}
          <img src="/app-icons/projexs-192.png" alt="" width={28} height={28} />
          Praxis-App
        </span>
        <a className={styles.barButton} href="/admin">
          Öffnen
        </a>
      </header>

      <main id="inhalt" className={styles.main}>
        <section className={styles.hero} aria-labelledby="titel">
          <div className={styles.heroIcon}>
            {/* eslint-disable-next-line @next/next/no-img-element -- App-Symbol */}
            <img src="/app-icons/projexs-512.png" alt="" width={128} height={128} />
          </div>
          <p className={styles.eyebrow}>Anleitung für Anna</p>
          <h1 className={styles.heroTitle} id="titel">
            Ihre <span className={styles.nowrap}>Praxis-App.</span>
            <span className={styles.heroSecond}>In fünf Minuten startklar.</span>
          </h1>
          <p className={styles.heroLead}>
            Anfragen lesen und beantworten, Impulsvideos hochladen — alles an einem Ort.{' '}
            {OFFER_APP_INSTALL
              ? 'Auf dem Handy wie eine richtige App, ganz ohne App Store.'
              : 'Am Computer im Browser, unterwegs genauso auf dem Handy.'}
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primary} href="/admin">
              Praxis-App öffnen <ArrowRight aria-hidden="true" />
            </a>
            <a className={styles.secondary} href="#anmelden">
              So geht’s <ArrowDown aria-hidden="true" />
            </a>
          </div>
          <ul className={styles.facts}>
            <li>{STEPS.length + STEPS_AFTER.length + (OFFER_APP_INSTALL ? 1 : 0)} Schritte</li>
            <li>iPhone, Android &amp; Computer</li>
            <li>{OFFER_APP_INSTALL ? 'Kein App Store' : 'Direkt im Browser'}</li>
          </ul>
        </section>

        {STEPS.map((step) => (
          <StepSection key={step.id} step={step} number={++number} />
        ))}

        {OFFER_APP_INSTALL ? (
          <section className={`${styles.step} ${styles.stepWide}`} id="installieren" aria-labelledby="installieren-titel">
            <div className={styles.stepText} data-reveal="">
              <span className={styles.stepNumber}>{++number}</span>
              <h2 className={styles.stepTitle} id="installieren-titel">
                Aufs Handy legen
              </h2>
              <p className={styles.stepLead}>
                Einmal auf den Home-Bildschirm gelegt, öffnet sich die Praxis-App wie jede andere App — mit eigenem
                Symbol, ohne Adressleiste. Die App bietet das beim ersten Öffnen auch selbst an.
              </p>
            </div>
            <div data-reveal="">
              <InstallPicker />
            </div>
          </section>
        ) : null}

        {STEPS_AFTER.map((step) => (
          <StepSection key={step.id} step={step} number={++number} />
        ))}

        <section className={styles.tips} aria-labelledby="tipps-titel">
          <h2 className={styles.tipsTitle} id="tipps-titel" data-reveal="">
            Gut zu wissen
          </h2>
          <div className={styles.tipsGrid}>
            {TIPS.map(({ icon: Icon, title, text }) => (
              <div key={title} className={styles.tip} data-reveal="">
                <Icon aria-hidden="true" strokeWidth={1.8} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.closing} aria-labelledby="los-titel" data-reveal="">
          {/* eslint-disable-next-line @next/next/no-img-element -- App-Symbol */}
          <img src="/app-icons/projexs-192.png" alt="" width={72} height={72} />
          <h2 id="los-titel">Bereit?</h2>
          <p>Ihre Zugangsdaten bekommen Sie von Stefan. Den Rest erklärt die App.</p>
          <a className={styles.primary} href="/admin">
            Praxis-App öffnen <ArrowRight aria-hidden="true" />
          </a>
        </section>
      </main>
    </div>
  );
}
