import { todayKey } from '@/kit/dates';
import { persisted, uid } from '@/kit/store';
import type { Entry, Fields, Kind } from '@/domain/vault';

// Only non-secret data lives here (titles, kinds, public fields). Secrets: src/state/secrets.ts.
type VaultState = {
  entries: Entry[];
  pub: Record<string, Fields>;
  lastReview: string | null;
  save: (e: { id?: string; kind: Kind; title: string; emergency: boolean; pub: Fields }) => string;
  remove: (id: string) => void;
  reviewed: () => void;
};

export const useVault = persisted<VaultState>('grannysvault.vault', 1, (set) => ({
  entries: [],
  pub: {},
  lastReview: null,
  save: ({ id, kind, title, emergency, pub }) => {
    const eid = id ?? uid('e');
    const entry: Entry = { id: eid, kind, title, emergency, updated: todayKey() };
    set((s) => ({
      entries: s.entries.some((x) => x.id === eid) ? s.entries.map((x) => (x.id === eid ? entry : x)) : [...s.entries, entry],
      pub: { ...s.pub, [eid]: pub },
    }));
    return eid;
  },
  remove: (id) =>
    set((s) => {
      const { [id]: _gone, ...pub } = s.pub;
      return { entries: s.entries.filter((x) => x.id !== id), pub };
    }),
  reviewed: () => set({ lastReview: todayKey() }),
}));
