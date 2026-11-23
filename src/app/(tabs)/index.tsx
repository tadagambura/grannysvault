import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { PaywallSheet } from '@/kit/Paywall';
import { usePremium } from '@/kit/premium';
import { Card, Chip, EmptyState, Field, H1, Muted, ProgressBar, Row, Screen, Section, Stack, Strong } from '@/kit/ui';
import { CHECKLIST, completeness, FREE_ENTRIES, KINDS, kindOf, type Kind } from '@/domain/vault';
import { useVault } from '@/state/vault';

export default function VaultHome() {
  const v = useVault();
  const { isPremium } = usePremium();
  const [q, setQ] = useState('');
  const [paywall, setPaywall] = useState(false);
  const done = completeness(v.entries);
  const add = (k: Kind) => (!isPremium && v.entries.length >= FREE_ENTRIES ? setPaywall(true) : router.push(`/entry?kind=${k}`));
  const list = v.entries.filter((e) => !q.trim() || e.title.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <Screen testID="vault">
      <H1>The vault</H1>
      <Card tone="alt">
        <Strong>{`Ready for an emergency: ${done.done} of ${done.total}`}</Strong>
        <ProgressBar value={done.done / done.total} label="Vault completeness" />
        {CHECKLIST.filter((c) => !c.done(v.entries)).slice(0, 2).map((c) => (
          <Muted key={c.id}>{`○ ${c.label}`}</Muted>
        ))}
      </Card>
      <Section title="Add">
        <Row wrap gap={8}>
          {KINDS.map((k) => (
            <Chip key={k.kind} label={`${k.emoji} ${k.label}`} onPress={() => add(k.kind)} testID={`add-${k.kind}`} />
          ))}
        </Row>
        {!isPremium ? <Muted>{`${v.entries.length} of ${FREE_ENTRIES} free entries used.`}</Muted> : null}
      </Section>
      {v.entries.length > 5 ? <Field label="Search" value={q} onChangeText={setQ} placeholder="Find an entry" testID="search" /> : null}
      {v.entries.length === 0 ? <EmptyState icon="lock-closed-outline" title="An empty vault" body="Start with an emergency contact and the GP. Five minutes now saves a lot of panic later." /> : null}
      <Stack gap={8}>
        {list.map((e) => (
          <Card key={e.id} onPress={() => router.push(`/entry?id=${e.id}`)} testID={`entry-${e.title}`} accessibilityLabel={`${kindOf(e.kind).label}: ${e.title}`}>
            <Row gap={10}>
              <Text style={{ fontSize: 24 }}>{kindOf(e.kind).emoji}</Text>
              <Stack gap={2} style={{ flex: 1 }}>
                <Strong>{e.title}</Strong>
                <Muted>{`${kindOf(e.kind).label}${e.emergency ? ' · on the emergency map' : ''}`}</Muted>
              </Stack>
            </Row>
          </Card>
        ))}
      </Stack>
      <PaywallSheet visible={paywall} onClose={() => setPaywall(false)} reason={`Free Granny's Vault holds ${FREE_ENTRIES} entries. Premium has no limit.`} />
    </Screen>
  );
}
