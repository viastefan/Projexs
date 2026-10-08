"use client";

import { useState, useTransition, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Plus, RotateCcw, Trash2 } from "lucide-react";
import { saveContentAction, saveSiteDataAction } from "@/app/admin/actions/content";
import { idle, type ActionState } from "@/app/admin/actions/state";
import type { FieldDef } from "@/lib/cms/content-schema";
import styles from "./content.module.css";
import { FormMessage } from "./FormMessage";
import { SaveBar, useSaveStatus } from "./SaveBar";
import ui from "./ui.module.css";

type Values = Record<string, unknown>;

function emptyFor(field: FieldDef): unknown {
  switch (field.kind) {
    case "number":
      return 0;
    case "strings":
      return [];
    case "items":
      return [];
    default:
      return "";
  }
}

function emptyItem(field: FieldDef): Record<string, unknown> {
  return Object.fromEntries((field.item ?? []).map((sub) => [sub.path, emptyFor(sub)]));
}

function same(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function itemTitle(field: FieldDef, item: Record<string, unknown>, index: number): string {
  const key = field.itemTitle;
  const value = key ? item[key] : undefined;
  const text = typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "";
  return text || `${field.itemLabel ?? "Eintrag"} ${index + 1}`;
}

/* ------------------------------------------------------------ Felder -- */

function TextInput({
  field,
  id,
  value,
  onChange,
}: {
  field: FieldDef;
  id: string;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  if (field.kind === "number") {
    return (
      <input
        className={ui.input}
        id={id}
        type="number"
        inputMode="numeric"
        value={typeof value === "number" ? value : Number(value) || 0}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    );
  }
  if (field.kind === "textarea") {
    const text = typeof value === "string" ? value : "";
    return (
      <textarea
        className={ui.textarea}
        id={id}
        value={text}
        rows={Math.min(12, Math.max(3, Math.ceil(text.length / 70) + text.split("\n").length))}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }
  return (
    <input
      className={ui.input}
      id={id}
      type="text"
      value={typeof value === "string" ? value : ""}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function ListControls({
  index,
  count,
  onMove,
  onRemove,
  label,
}: {
  index: number;
  count: number;
  onMove: (delta: number) => void;
  onRemove: () => void;
  label: string;
}) {
  return (
    <span className={styles.controls}>
      <button type="button" className={styles.iconButton} onClick={() => onMove(-1)} disabled={index === 0} aria-label={`${label} nach oben`}>
        <ArrowUp aria-hidden="true" />
      </button>
      <button
        type="button"
        className={styles.iconButton}
        onClick={() => onMove(1)}
        disabled={index === count - 1}
        aria-label={`${label} nach unten`}
      >
        <ArrowDown aria-hidden="true" />
      </button>
      <button type="button" className={`${styles.iconButton} ${styles.iconDanger}`} onClick={onRemove} aria-label={`${label} entfernen`}>
        <Trash2 aria-hidden="true" />
      </button>
    </span>
  );
}

function moveIn<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function StringsField({
  field,
  id,
  value,
  onChange,
}: {
  field: FieldDef;
  id: string;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const list = Array.isArray(value) ? (value as string[]) : [];
  const label = field.itemLabel ?? "Eintrag";
  return (
    <div className={styles.strings} id={id}>
      {list.map((entry, index) => (
        <div key={index} className={styles.stringRow}>
          <textarea
            className={`${ui.textarea} ${styles.stringInput}`}
            value={entry}
            rows={Math.max(1, Math.ceil(entry.length / 60))}
            aria-label={`${label} ${index + 1}`}
            onChange={(event) => onChange(list.map((item, i) => (i === index ? event.target.value : item)))}
          />
          <ListControls
            index={index}
            count={list.length}
            label={label}
            onMove={(delta) => onChange(moveIn(list, index, index + delta))}
            onRemove={() => onChange(list.filter((_, i) => i !== index))}
          />
        </div>
      ))}
      <button type="button" className={`${ui.button} ${ui.ghost} ${styles.add}`} onClick={() => onChange([...list, ""])}>
        <Plus aria-hidden="true" /> {label} hinzufügen
      </button>
    </div>
  );
}

function ItemsField({
  field,
  id,
  value,
  onChange,
  depth,
}: {
  field: FieldDef;
  id: string;
  value: unknown;
  onChange: (value: unknown) => void;
  depth: number;
}) {
  const list = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
  const label = field.itemLabel ?? "Eintrag";
  const [open, setOpen] = useState<number | null>(list.length <= 3 && depth === 0 ? 0 : null);

  return (
    <div className={styles.items} id={id}>
      {list.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={index} className={styles.item} data-open={isOpen ? "true" : "false"}>
            <div className={styles.itemHead}>
              <button
                type="button"
                className={styles.itemToggle}
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <ChevronDown aria-hidden="true" className={styles.chevron} />
                <span className={styles.itemIndex}>{index + 1}</span>
                <span className={styles.itemTitle}>{itemTitle(field, item, index)}</span>
              </button>
              <ListControls
                index={index}
                count={list.length}
                label={`${label} ${index + 1}`}
                onMove={(delta) => {
                  onChange(moveIn(list, index, index + delta));
                  setOpen(isOpen ? index + delta : open);
                }}
                onRemove={() => {
                  if (!window.confirm(`${itemTitle(field, item, index)} entfernen?`)) return;
                  onChange(list.filter((_, i) => i !== index));
                  setOpen(null);
                }}
              />
            </div>
            {isOpen ? (
              <div className={styles.itemBody}>
                {(field.item ?? []).map((sub) => (
                  <Field
                    key={sub.path}
                    field={sub}
                    id={`${id}-${index}-${sub.path}`}
                    value={item[sub.path]}
                    onChange={(next) => onChange(list.map((entry, i) => (i === index ? { ...entry, [sub.path]: next } : entry)))}
                    depth={depth + 1}
                  />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
      <button
        type="button"
        className={`${ui.button} ${ui.ghost} ${styles.add}`}
        onClick={() => {
          onChange([...list, emptyItem(field)]);
          setOpen(list.length);
        }}
      >
        <Plus aria-hidden="true" /> {label} hinzufügen
      </button>
    </div>
  );
}

function Field({
  field,
  id,
  value,
  onChange,
  depth,
  extra,
}: {
  field: FieldDef;
  id: string;
  value: unknown;
  onChange: (value: unknown) => void;
  depth: number;
  extra?: ReactNode;
}) {
  const isList = field.kind === "strings" || field.kind === "items";
  return (
    <div className={`${ui.field} ${styles.field}`} data-depth={depth}>
      <div className={styles.fieldHead}>
        <label className={ui.label} htmlFor={isList ? undefined : id}>
          {field.label}
        </label>
        {extra}
      </div>
      {field.kind === "strings" ? (
        <StringsField field={field} id={id} value={value} onChange={onChange} />
      ) : field.kind === "items" ? (
        <ItemsField field={field} id={id} value={value} onChange={onChange} depth={depth} />
      ) : (
        <TextInput field={field} id={id} value={value} onChange={onChange} />
      )}
      {field.hint ? <p className={ui.hint}>{field.hint}</p> : null}
    </div>
  );
}

/* ----------------------------------------------------------- Editor -- */

export interface ContentEditorProps {
  /** Welche Aktion speichert: Website-Texte je Sprache oder die Stammdaten. */
  target: { kind: "content"; locale: "de" | "en" } | { kind: "site" };
  fields: FieldDef[];
  /** Standardwerte aus dem Code, je Pfad. */
  defaults: Values;
  /** Gespeicherte Abweichungen, je Pfad. */
  overrides: Values;
}

/**
 * Generischer Editor: rendert sich aus dem Schema. Jedes Feld zeigt, ob es
 * vom Standardtext abweicht, und lässt sich einzeln zurücksetzen. Gespeichert
 * wird der ganze Abschnitt; der Server behält nur, was vom Standard abweicht.
 */
export function ContentEditor({ target, fields, defaults, overrides }: ContentEditorProps) {
  const [values, setValues] = useState<Values>(() =>
    Object.fromEntries(fields.map((field) => [field.path, overrides[field.path] ?? defaults[field.path] ?? emptyFor(field)])),
  );
  const [state, setState] = useState<ActionState>(idle);
  const [pending, startTransition] = useTransition();
  const save = useSaveStatus(state, pending);

  function update(path: string, value: unknown) {
    setValues((current) => ({ ...current, [path]: value }));
    save.onEdit();
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const changes = Object.fromEntries(fields.map((field) => [field.path, values[field.path]]));
      const reset = fields.filter((field) => same(values[field.path], defaults[field.path])).map((field) => field.path);
      const result =
        target.kind === "content"
          ? await saveContentAction({ locale: target.locale, changes, reset })
          : await saveSiteDataAction({ changes, reset });
      setState(result);
    });
  }

  const changedCount = fields.filter((field) => !same(values[field.path], defaults[field.path])).length;

  return (
    <form onSubmit={submit} className={styles.editor}>
      <p className={ui.hint}>
        {changedCount === 0
          ? "Alle Felder zeigen den Standardtext."
          : `${changedCount} ${changedCount === 1 ? "Feld weicht" : "Felder weichen"} vom Standardtext ab.`}
      </p>
      {fields.map((field) => {
        const changed = !same(values[field.path], defaults[field.path]);
        return (
          <Field
            key={field.path}
            field={field}
            id={`f-${field.path.replace(/\./g, "-")}`}
            value={values[field.path]}
            onChange={(value) => update(field.path, value)}
            depth={0}
            extra={
              changed ? (
                <span className={styles.fieldStatus}>
                  <span className={`${ui.chip} ${ui.chipInfo}`}>Geändert</span>
                  <button
                    type="button"
                    className={styles.reset}
                    onClick={() => update(field.path, defaults[field.path] ?? emptyFor(field))}
                  >
                    <RotateCcw aria-hidden="true" /> Standardtext
                  </button>
                </span>
              ) : null
            }
          />
        );
      })}
      <FormMessage state={state.status === "error" ? state : idle} />
      <SaveBar status={save.status} everSaved={save.everSaved} savedText="Gespeichert — die Website ist aktualisiert." savedShort="Website aktuell" />
    </form>
  );
}
