import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { track } from '@/kit/analytics';
import { useCelebrate } from '@/kit/celebrate';
import { useFeedback } from '@/kit/feedback';
import { usePremium } from '@/kit/premium';
import { Button, Field, Muted, Note, Screen, Stack, Toggle } from '@/kit/ui';
import { entryError, kindOf, splitFields, type Fields, type Kind } from '@/domain/vault';
import { deleteSecret, readSecret, saveSecret } from '@/state/secrets';
import { useVault } from '@/state/vault';

export default function EntryScreen() {
  const { id, kind: kindParam } = useLocalSearchParams<{ id?: string; kind?: Kind }>();
  const v = useVault();
  const existing = v.entries.find((e) => e.id === id);
  const kind: Kind = existing?.kind ?? kindParam ?? 'note';
  const def = kindOf(kind);
  const { isPremium } = usePremium();
  const { toast, confirm } = useFeedback();
  const celebrate = useCelebrate();
  const [title, setTitle] = useState(existing?.title ?? '');
  const [emergency, setEmergency] = useState(existing?.emergency ?? (kind === 'contact' || kind === 'medical'));
  const [fields, setFields] = useState<Fields>(existing ? { ...(v.pub[existing.id] ?? {}) } : {});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(!existing);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!existing) return;
    readSecret(existing.id).then((secret) => {
      setFields((f) => ({ ...f, ...secret }));
      setLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.id]);

  const save = async () => {
    const e = entryError(title, kind, fields, v.entries.length, isPremium, !existing);
    if (e) return setErr(e);
    const { pub, secret } = splitFields(kind, fields);
    const eid = v.save({ id: existing?.id, kind, title: title.trim(), emergency, pub });
    await saveSecret(eid, secret);
    track('core_action_completed', { what: 'entry_saved', kind });
    if (kind === 'login' && !existing) celebrate({ scene: 'sticky', emoji: '🗒️', title: 'Safely stored', body: 'Granny scribbles it on a sticky note. Kaos snatches it and locks it in the vault.' });
    router.back();
  };

  return (
    <Screen edges={['bottom']} testID="entry" footer={<Button title="Save" onPress={save} disabled={!loaded} testID="entry-save" />}>
      <Field label={`${def.emoji} Name`} value={title} onChangeText={setTitle} placeholder={kind === 'login' ? "e.g. Dad's bank" : kind === 'contact' ? 'e.g. Auntie Pat' : 'e.g. Home insurance'} maxLength={40} testID="entry-title" />
      {def.fields.map((f) => (
        <Stack key={f.key} gap={4}>
          <Field
            label={`${f.label}${f.secret ? ' 🔒' : ''}`}
            value={fields[f.key] ?? ''}
            onChangeText={(t) => setFields({ ...fields, [f.key]: t })}
            secureTextEntry={!!f.secret && !f.multiline && !revealed[f.key]}
            multiline={f.multiline}
            autoCapitalize={f.key === 'password' || f.key === 'username' ? 'none' : 'sentences'}
            autoCorrect={false}
            maxLength={f.multiline ? 600 : 120}
            testID={`field-${f.key}`}
          />
          {f.secret && !f.multiline ? <Button small variant="ghost" title={revealed[f.key] ? 'Hide' : 'Show'} onPress={() => setRevealed({ ...revealed, [f.key]: !revealed[f.key] })} testID={`reveal-${f.key}`} /> : null}
        </Stack>
      ))}
      <Toggle label="Show on the emergency map" hint="The essentials someone would need in a hurry." value={emergency} onChange={setEmergency} testID="entry-emergency" />
      <Muted>Fields marked 🔒 are stored in your phone's secure chip and never leave it, not even in exports.</Muted>
      {err ? <Note tone="warning">{err}</Note> : null}
      {existing ? (
        <Button
          title="Delete entry"
          variant="danger"
          onPress={async () => {
            if (!(await confirm({ title: `Delete ${existing.title}?`, body: 'This removes it, including its secret details, from this phone.', confirmLabel: 'Delete', destructive: true }))) return;
            await deleteSecret(existing.id);
            v.remove(existing.id);
            toast('Deleted.');
            router.back();
          }}
        />
      ) : null}
    </Screen>
  );
}
