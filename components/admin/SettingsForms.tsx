"use client";

import { KeyRound, UserPlus } from "lucide-react";
import { addAccountAction, changePinAction, updateProfileAction } from "@/app/admin/actions/auth";
import { saveAppThemeAction, saveInboxSettingsAction } from "@/app/admin/actions/settings";
import { idle } from "@/app/admin/actions/state";
import type { AppTheme, NotificationMode } from "@/lib/cms/types";
import { FormMessage } from "./FormMessage";
import { SaveBar, useSaveStatus } from "./SaveBar";
import ui from "./ui.module.css";
import { useSubmitAction } from "./useSubmitAction";

const MODES: { value: NotificationMode; title: string; text: string }[] = [
  { value: "full", title: "E-Mail mit Inhalt", text: "Die ganze Anfrage kommt zusätzlich per E-Mail, „Antworten“ geht direkt an die Person." },
  { value: "notice", title: "Nur ein Hinweis", text: "Die E-Mail sagt nur, dass etwas da ist. Der Inhalt bleibt ausschließlich in der App." },
  { value: "off", title: "Keine E-Mail", text: "Neue Anfragen erscheinen nur hier in der App — und per Push, wo eingeschaltet." },
];

export function InboxSettingsForm({
  notifications,
  retentionMonths,
  mailReady,
}: {
  notifications: NotificationMode;
  retentionMonths: number;
  mailReady: boolean;
}) {
  const [state, onSubmit, pending] = useSubmitAction(saveInboxSettingsAction);
  const save = useSaveStatus(state, pending);
  return (
    <form onSubmit={onSubmit} onInput={save.onEdit} className={ui.stack}>
      <fieldset className={ui.group}>
        <legend className={ui.label}>E-Mail bei neuen Anfragen</legend>
        <div className={ui.choices}>
          {MODES.map((mode) => (
            <label key={mode.value} className={ui.choice}>
              <input type="radio" name="notifications" value={mode.value} defaultChecked={notifications === mode.value} />
              <span>
                <span className={ui.choiceTitle}>{mode.title}</span>
                <span className={ui.choiceText}>{mode.text}</span>
              </span>
            </label>
          ))}
        </div>
        {!mailReady ? (
          <p className={ui.hint}>Der E-Mail-Versand ist noch nicht eingerichtet — bis dahin kommen Anfragen nur hier und per Push an.</p>
        ) : null}
      </fieldset>

      <div className={ui.field}>
        <label className={ui.label} htmlFor="retentionMonths">
          Erledigte Anfragen automatisch löschen nach
        </label>
        <select className={ui.select} id="retentionMonths" name="retentionMonths" defaultValue={retentionMonths}>
          <option value={3}>3 Monaten</option>
          <option value={6}>6 Monaten</option>
          <option value={12}>12 Monaten</option>
          <option value={24}>24 Monaten</option>
        </select>
        <p className={ui.hint}>Gilt nur für erledigte Anfragen. Offene bleiben, bis sie erledigt sind.</p>
      </div>

      <FormMessage state={state.status === "error" ? state : idle} />
      <SaveBar status={save.status} everSaved={save.everSaved} savedText="Gespeichert." />
    </form>
  );
}

const THEMES: { value: AppTheme; title: string; text: string }[] = [
  { value: "system", title: "Wie das Gerät", text: "Hell oder dunkel, je nach Systemeinstellung." },
  { value: "light", title: "Hell", text: "Immer hell." },
  { value: "dark", title: "Dunkel", text: "Immer dunkel." },
];

/** Darstellung der Admin-App. */
export function AppThemeForm({ appTheme }: { appTheme: AppTheme }) {
  const [state, onSubmit, pending] = useSubmitAction(saveAppThemeAction);
  const save = useSaveStatus(state, pending);
  return (
    <form onSubmit={onSubmit} onInput={save.onEdit} className={ui.stack}>
      <fieldset className={ui.group}>
        <legend className={ui.visuallyHidden}>Darstellung der App</legend>
        <div className={ui.choices}>
          {THEMES.map((theme) => (
            <label key={theme.value} className={ui.choice}>
              <input type="radio" name="appTheme" value={theme.value} defaultChecked={appTheme === theme.value} />
              <span>
                <span className={ui.choiceTitle}>{theme.title}</span>
                <span className={ui.choiceText}>{theme.text}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <FormMessage state={state.status === "error" ? state : idle} />
      <SaveBar status={save.status} everSaved={save.everSaved} savedText="Gespeichert." />
    </form>
  );
}

const pinInput = {
  className: ui.input,
  type: "password",
  inputMode: "numeric",
  pattern: "[0-9]{6}",
  minLength: 6,
  maxLength: 6,
  autoComplete: "off",
  required: true,
} as const;

/** Eigene PIN ändern — jeder Zugang bestätigt mit seiner bisherigen. */
export function PinForm() {
  const [state, onSubmit, pending] = useSubmitAction(changePinAction, { resetOnSuccess: true });
  return (
    <form onSubmit={onSubmit} className={ui.stack}>
      <div className={ui.field}>
        <label className={ui.label} htmlFor="current">
          Bisherige PIN
        </label>
        <input {...pinInput} id="current" name="current" />
      </div>
      <div className={ui.field}>
        <label className={ui.label} htmlFor="next">
          Neue PIN
        </label>
        <input {...pinInput} id="next" name="next" />
        <p className={ui.hint}>Sechs Ziffern — kein Geburtsdatum und keine Reihe wie 123456.</p>
      </div>
      <div className={ui.field}>
        <label className={ui.label} htmlFor="nextRepeat">
          Neue PIN wiederholen
        </label>
        <input {...pinInput} id="nextRepeat" name="nextRepeat" />
      </div>
      <FormMessage state={state} />
      <div className={ui.row}>
        <button type="submit" className={`${ui.button} ${ui.primary}`} disabled={pending}>
          <KeyRound aria-hidden="true" />
          {pending ? "Wird geändert …" : "PIN ändern"}
        </button>
      </div>
    </form>
  );
}

/** Name und E-Mail des eigenen Zugangs. */
export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, onSubmit, pending] = useSubmitAction(updateProfileAction);
  const save = useSaveStatus(state, pending);
  return (
    <form onSubmit={onSubmit} onInput={save.onEdit} className={ui.stack}>
      <div className={ui.fieldRow}>
        <div className={ui.field}>
          <label className={ui.label} htmlFor="profile-name">
            Name
          </label>
          <input className={ui.input} id="profile-name" name="name" defaultValue={name} maxLength={80} required />
        </div>
        <div className={ui.field}>
          <label className={ui.label} htmlFor="profile-email">
            E-Mail (für Testmails)
          </label>
          <input className={ui.input} id="profile-email" name="email" type="email" defaultValue={email} maxLength={160} required />
        </div>
      </div>
      <FormMessage state={state.status === "error" ? state : idle} />
      <SaveBar status={save.status} everSaved={save.everSaved} savedText="Gespeichert." variant="secondary" />
    </form>
  );
}

/** Weiteren Zugang anlegen — nur die Inhaberin. */
export function AddAccountForm() {
  const [state, onSubmit, pending] = useSubmitAction(addAccountAction, { resetOnSuccess: true });
  return (
    <form onSubmit={onSubmit} className={ui.stack}>
      <div className={ui.fieldRow}>
        <div className={ui.field}>
          <label className={ui.label} htmlFor="new-name">
            Name
          </label>
          <input className={ui.input} id="new-name" name="name" maxLength={80} required autoComplete="off" />
        </div>
        <div className={ui.field}>
          <label className={ui.label} htmlFor="new-email">
            E-Mail
          </label>
          <input className={ui.input} id="new-email" name="email" type="email" maxLength={160} required autoComplete="off" />
        </div>
      </div>
      <div className={ui.fieldRow}>
        <div className={ui.field}>
          <label className={ui.label} htmlFor="new-pin">
            PIN (sechs Ziffern)
          </label>
          <input {...pinInput} id="new-pin" name="pin" />
        </div>
        <div className={ui.field}>
          <label className={ui.label} htmlFor="new-pin-repeat">
            PIN wiederholen
          </label>
          <input {...pinInput} id="new-pin-repeat" name="pinRepeat" />
        </div>
      </div>
      <p className={ui.hint}>Der neue Zugang sieht alles, kann aber keine weiteren Zugänge anlegen oder entfernen.</p>
      <FormMessage state={state} />
      <div className={ui.row}>
        <button type="submit" className={`${ui.button} ${ui.secondary}`} disabled={pending}>
          <UserPlus aria-hidden="true" />
          {pending ? "Wird angelegt …" : "Zugang anlegen"}
        </button>
      </div>
    </form>
  );
}
