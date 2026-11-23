// Granny's Vault: entry types, validation, the emergency info map and completeness.
// Secret fields never live in normal storage: see src/state/secrets.ts.

export type Kind = 'login' | 'document' | 'contact' | 'medical' | 'note';

export const KINDS: { kind: Kind; label: string; emoji: string; fields: { key: string; label: string; secret?: boolean; multiline?: boolean }[] }[] = [
  { kind: 'login', label: 'Login', emoji: '🔑', fields: [{ key: 'site', label: 'Website or app' }, { key: 'username', label: 'Username or email' }, { key: 'password', label: 'Password', secret: true }, { key: 'notes', label: 'Notes', secret: true, multiline: true }] },
  { kind: 'document', label: 'Document', emoji: '📄', fields: [{ key: 'where', label: 'Where it is kept' }, { key: 'number', label: 'Reference or policy number', secret: true }, { key: 'notes', label: 'Notes', secret: true, multiline: true }] },
  { kind: 'contact', label: 'Emergency contact', emoji: '📞', fields: [{ key: 'name', label: 'Name' }, { key: 'relation', label: 'Who they are' }, { key: 'phone', label: 'Phone' }] },
  { kind: 'medical', label: 'Medical', emoji: '💊', fields: [{ key: 'gp', label: 'GP surgery and phone' }, { key: 'medication', label: 'Medication', secret: true, multiline: true }, { key: 'allergies', label: 'Allergies and conditions', secret: true, multiline: true }] },
  { kind: 'note', label: 'Note', emoji: '📝', fields: [{ key: 'notes', label: 'Note', secret: true, multiline: true }] },
];

export type Entry = { id: string; kind: Kind; title: string; updated: string; emergency: boolean };
/** Public fields (stored normally) and secret fields (stored in the secure keychain). */
export type Fields = Record<string, string>;

export const FREE_ENTRIES = 20;
export const MAX_SECRET_BYTES = 1800; // keep each secure-store item under ~2 KB (Android limit)

export const kindOf = (k: Kind) => KINDS.find((x) => x.kind === k)!;

export function splitFields(kind: Kind, all: Fields): { pub: Fields; secret: Fields } {
  const pub: Fields = {};
  const secret: Fields = {};
  for (const f of kindOf(kind).fields) {
    const v = (all[f.key] ?? '').trim();
    if (!v) continue;
    (f.secret ? secret : pub)[f.key] = v;
  }
  return { pub, secret };
}

export function entryError(title: string, kind: Kind, all: Fields, count: number, premium: boolean, isNew: boolean): string | null {
  if (!title.trim()) return 'Give it a name, like "Dad\'s bank" or "Home insurance".';
  if (isNew && !premium && count >= FREE_ENTRIES) return `Free Granny's Vault holds ${FREE_ENTRIES} entries.`;
  const { secret } = splitFields(kind, all);
  if (new TextEncoder().encode(JSON.stringify(secret)).length > MAX_SECRET_BYTES) return 'That is a lot of text for one entry. Split it into two?';
  if (kind === 'contact' && all.phone && !/^[+\d][\d\s()-]{5,}$/.test(all.phone.trim())) return 'That phone number looks unusual.';
  return null;
}

/** The checklist that makes a vault genuinely useful in an emergency. */
export const CHECKLIST: { id: string; label: string; done: (e: Entry[]) => boolean }[] = [
  { id: 'contact', label: 'An emergency contact', done: (e) => e.some((x) => x.kind === 'contact') },
  { id: 'medical', label: 'GP, medication and allergies', done: (e) => e.some((x) => x.kind === 'medical') },
  { id: 'docs', label: 'Where the important documents are', done: (e) => e.some((x) => x.kind === 'document') },
  { id: 'logins', label: 'The logins people would need', done: (e) => e.some((x) => x.kind === 'login') },
  { id: 'map', label: 'At least three things on the emergency map', done: (e) => e.filter((x) => x.emergency).length >= 3 },
];

export function completeness(entries: Entry[]): { done: number; total: number } {
  return { done: CHECKLIST.filter((c) => c.done(entries)).length, total: CHECKLIST.length };
}

/** Re-lock after this long in the background. */
export const RELOCK_MS = 60_000;
