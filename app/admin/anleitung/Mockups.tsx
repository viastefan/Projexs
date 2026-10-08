import s from './mockups.module.css';

/*
 * Kleine Filme in Dauerschleife, gebaut aus HTML und CSS statt als Video:
 * gestochen scharf auf jedem Bildschirm, ohne Ladezeit, und sie zeigen genau
 * die Knöpfe und Texte der echten App. Sie laufen nur, solange sie zu sehen
 * sind (data-play am Abschnitt), und stehen still bei „Bewegung reduzieren“.
 */

const ICON = '/app-icons/projexs-192.png';

function Phone({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={s.device} role="img" aria-label={label}>
      <div className={s.screen}>
        <div className={s.status} aria-hidden="true">
          <span>9:41</span>
          <i className={s.island} />
          <span className={s.statusIcons}>
            <b />
            <b />
            <b />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

function Tap({ className }: { className: string }) {
  return <span className={`${s.tap} ${className}`} aria-hidden="true" />;
}

function AppIcon({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- kleines Symbol im Film
  return <img className={className ?? s.appIcon} src={ICON} alt="" width={48} height={48} />;
}

export function LoginFilm() {
  return (
    <Phone label="Film: Anmelden mit der PIN">
      <div className={`${s.layer} ${s.base}`}>
        <AppIcon />
        <p className={s.title}>PIN eingeben</p>
        <p className={s.sub}>Praxis-App · Anna Kipp-Menke</p>
        <div className={`${s.field} ${s.lField1}`}>
          <span className={s.fieldLabel}>PIN</span>
          <span className={`${s.fieldValue} ${s.dots} ${s.lEmail}`}>••••••</span>
        </div>
        <span className={`${s.button} ${s.lButton}`}>
          Anmelden
          <Tap className={s.lTap} />
        </span>
      </div>
      <div className={`${s.layer} ${s.sheet} ${s.lDash}`}>
        <p className={s.eyebrow}>Montag, 6. Oktober</p>
        <p className={s.bigTitle}>Guten Morgen, Anna</p>
        <div className={s.card}>
          <span className={s.cardLabel}>Anfragen</span>
          <span className={s.cardNumber}>2</span>
          <span className={s.cardText}>neue Anfragen</span>
        </div>
        <div className={s.card}>
          <span className={s.cardLabel}>Dieser Monat</span>
          <span className={s.cardTitle}>Oktober 2026</span>
          <span className={s.skeleton} />
        </div>
      </div>
    </Phone>
  );
}

export function PushFilm() {
  return (
    <Phone label="Film: Push-Benachrichtigung einschalten und die erste Mitteilung">
      <div className={`${s.layer} ${s.base}`}>
        <p className={s.bigTitle}>Einstellungen</p>
        <div className={s.group}>
          <p className={s.groupTitle}>Push-Benachrichtigung</p>
          <p className={s.groupText}>Bei jeder neuen Anfrage eine Nachricht aufs Handy — nur der Hinweis, ohne Namen oder Inhalt.</p>
          <div className={s.row}>
            <span>Auf diesem Gerät</span>
            <span className={`${s.toggle} ${s.nToggle}`}>
              <i />
              <Tap className={s.nTap1} />
            </span>
          </div>
        </div>
      </div>
      <div className={`${s.layer} ${s.dim} ${s.nAlert}`}>
        <div className={s.alert}>
          <b>„Praxis“ möchte Ihnen Mitteilungen senden</b>
          <span>Mitteilungen können Hinweise, Töne und Kennzeichen enthalten.</span>
          <span className={s.alertButtons}>
            <span>Nicht erlauben</span>
            <strong>
              Erlauben
              <Tap className={s.nTap2} />
            </strong>
          </span>
        </div>
      </div>
      <div className={`${s.layer} ${s.lock} ${s.nLock}`}>
        <p className={s.lockDate}>Montag, 6. Oktober</p>
        <p className={s.lockTime}>9:41</p>
        <div className={`${s.banner} ${s.nBanner}`}>
          <AppIcon className={s.bannerIcon} />
          <span className={s.bannerText}>
            <span className={s.bannerHead}>
              <b>Neue Anfrage</b>
              <small>jetzt</small>
            </span>
            <span>Über das Kontaktformular ist eine neue Anfrage eingegangen.</span>
          </span>
        </div>
      </div>
    </Phone>
  );
}

const PEOPLE = [
  { initials: 'JM', name: 'Julia M.', text: 'Erstgespräch für uns als Paar', time: '9:12', unread: true },
  { initials: 'TK', name: 'Thomas K.', text: 'Supervision für unser Team', time: 'Gestern', unread: false },
  { initials: 'SB', name: 'Sabine B.', text: 'Elterncoaching – Termin im …', time: 'Fr.', unread: false },
];

export function InboxFilm() {
  return (
    <Phone label="Film: Eine Anfrage öffnen und per E-Mail beantworten">
      <div className={`${s.layer} ${s.base}`}>
        <p className={s.bigTitle}>Anfragen</p>
        <div className={s.list}>
          {PEOPLE.map((person, index) => (
            <div key={person.name} className={`${s.listRow} ${index === 0 ? s.iFirst : ''}`}>
              <span className={s.avatar}>{person.initials}</span>
              <span className={s.listMain}>
                <b>
                  {person.unread ? <i className={s.unread} /> : null}
                  {person.name}
                </b>
                <span>{person.text}</span>
              </span>
              <small>{person.time}</small>
              {index === 0 ? <Tap className={s.iTap1} /> : null}
            </div>
          ))}
        </div>
      </div>
      <div className={`${s.layer} ${s.sheet} ${s.iDetail}`}>
        <p className={s.back}>‹ Anfragen</p>
        <p className={s.bigTitle}>Julia M.</p>
        <span className={s.chips}>
          <span className={`${s.chip} ${s.chipNew} ${s.iChipNew}`}>Neu</span>
          <span className={`${s.chip} ${s.chipOk} ${s.iChipDone}`}>Beantwortet</span>
        </span>
        <div className={s.group}>
          <span className={s.skeleton} />
          <span className={`${s.skeleton} ${s.skeletonShort}`} />
          <span className={s.skeleton} />
          <span className={`${s.skeleton} ${s.skeletonShorter}`} />
        </div>
        <span className={`${s.button} ${s.iButton}`}>
          Per E-Mail antworten
          <Tap className={s.iTap2} />
        </span>
      </div>
    </Phone>
  );
}

export function VideoFilm() {
  return (
    <Phone label="Film: Impulsvideo hochladen, das Intro kommt automatisch davor, danach ist es online">
      <div className={`${s.layer} ${s.base}`}>
        <p className={s.eyebrow}>Impulse</p>
        <p className={s.bigTitle}>Oktober 2026</p>
        <div className={s.group}>
          <p className={s.groupTitle}>Impuls für Oktober</p>
          <span className={s.chips}>
            <span className={`${s.chip} ${s.vChipDraft}`}>Video fehlt</span>
            <span className={`${s.chip} ${s.chipWork} ${s.vChipWork}`}>
              <i className={s.spinner} /> Wird verarbeitet
            </span>
            <span className={`${s.chip} ${s.chipOk} ${s.vChipOnline}`}>Video online</span>
          </span>
          <span className={`${s.button} ${s.vButton}`}>
            Video hochladen
            <Tap className={s.vTap} />
          </span>
          <div className={s.vUpload}>
            <span className={s.fileRow}>
              <span>oktober-impuls.mov</span>
              <small className={s.vUploadState}>Wird hochgeladen …</small>
            </span>
            <span className={s.progress}>
              <i className={s.vProgress} />
            </span>
          </div>
        </div>
        <div className={s.merge}>
          <span className={`${s.clip} ${s.clipIntro} ${s.vIntro}`}>Intro</span>
          <span className={`${s.clip} ${s.clipMain} ${s.vMain}`}>Ihr Video</span>
          <span className={s.vShine} />
        </div>
        <p className={s.vWeb}>
          <span className={s.globe} aria-hidden="true" />
          Auf der Website unter „Impulsvideos“
        </p>
      </div>
    </Phone>
  );
}
