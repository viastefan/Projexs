/**
 * Was die Admin-App speichert. Alles liegt als JSON im privaten Speicher.
 */

export type InquiryStatus = "neu" | "in Bearbeitung" | "erledigt";
export type InquirySource = "dialog" | "form" | "contact-page" | "popup";

export interface Inquiry {
  /** Dateiname ohne Endung; beginnt mit einem umgekehrten Zeitstempel, damit
      die neueste Anfrage beim Auflisten zuerst kommt. */
  key: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  topic: string;
  timeframe: string;
  message: string;
  source: InquirySource;
  locale: "de" | "en";
  status: InquiryStatus;
  read: boolean;
  readAt?: string;
  doneAt?: string;
  note?: string;
  consent: { at: string };
  /** Aus der App gesendete Antworten, älteste zuerst. */
  replies?: InquiryReply[];
}

export interface InquiryReply {
  at: string;
  subject: string;
  /** Text ohne die angehängte ursprüngliche Nachricht */
  text: string;
  /** Absenderadresse, unter der die Antwort hinausging */
  from: string;
}

export type NotificationMode = "full" | "notice" | "off";

/** Darstellung der Admin-App: nach System, hell oder dunkel. */
export type AppTheme = "system" | "light" | "dark";

export interface Settings {
  version: 1;
  notifications: NotificationMode;
  /** Erledigte Anfragen werden nach so vielen Monaten gelöscht. */
  retentionMonths: number;
  /**
   * Seit wann die Website freigegeben ist. Fehlt das Datum, ist sie pausiert:
   * Besucher sehen nur einen kurzen Hinweis; Daniela sieht alles über die
   * Vorschau und veröffentlicht in der App.
   */
  publishedAt?: string | null;
  appTheme?: AppTheme;
}

export const DEFAULT_SETTINGS: Settings = {
  version: 1,
  notifications: "full",
  retentionMonths: 12,
  /* Bis zur Freigabe in der App bleibt die Website online — der Schalter ist
     dafür da, sie bei Bedarf zu pausieren. */
  publishedAt: "2026-01-01T00:00:00.000Z",
};

export const PATHS = {
  settings: "cms/settings.json",
  content: (locale: "de" | "en") => `cms/content-${locale}.json`,
  siteOverrides: "cms/site.json",
  releaseHistory: "cms/website-verlauf.json",
  inquiry: (key: string) => `inquiries/${key}.json`,
  inquiriesPrefix: "inquiries/",
  unreadMarker: (key: string) => `inbox/unread/${key}.json`,
  unreadPrefix: "inbox/unread/",
  vapid: "system/vapid.json",
  pushSubscription: (id: string) => `push/${id}.json`,
  pushPrefix: "push/",
} as const;
