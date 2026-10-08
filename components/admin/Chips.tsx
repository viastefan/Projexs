import type { InquirySource, InquiryStatus } from "@/lib/cms/types";
import ui from "./ui.module.css";

const INQUIRY: Record<InquiryStatus, [string, string]> = {
  neu: ["Neu", ui.chipAccent],
  "in Bearbeitung": ["In Bearbeitung", ui.chipWarn],
  erledigt: ["Erledigt", ui.chipOk],
};

export function InquiryChip({ status }: { status: InquiryStatus }) {
  const [label, tone] = INQUIRY[status] ?? ["Unbekannt", ui.chipNeutral];
  return <span className={`${ui.chip} ${tone}`}>{label}</span>;
}

export const SOURCE_LABELS: Record<InquirySource, string> = {
  dialog: "über den Anfrage-Dialog",
  form: "über das Kontaktformular",
  "contact-page": "über die Kontaktseite",
  popup: "über das Pop-up",
};
