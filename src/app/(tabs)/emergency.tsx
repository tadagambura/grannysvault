// The emergency map: one calm page with who to call, what to know and where things are.
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { Text } from 'react-native';
import { Body, Button, Card, EmptyState, H1, Muted, Row, Screen, Section, Stack, Strong } from '@/kit/ui';
import { kindOf, type Kind } from '@/domain/vault';
import { useVault } from '@/state/vault';

const ORDER: { kind: Kind; title: string }[] = [
  { kind: 'contact', title: 'Who to call' },
  { kind: 'medical', title: 'Medical' },
  { kind: 'document', title: 'Where things are' },
  { kind: 'login', title: 'Accounts' },
  { kind: 'note', title: 'Notes' },
];

export default function Emergency() {
  const v = useVault();
  const map = v.entries.filter((e) => e.emergency);
  return (
    <Screen testID="emergency">
      <H1>Emergency map</H1>
      <Muted>In a real emergency, call 999. For urgent medical help that isn't an emergency, call 111.</Muted>
      {map.length === 0 ? <EmptyState icon="map-outline" title="Nothing on the map yet" body="Switch on 'Show on the emergency map' for an entry and it appears here." action={<Button title="Go to the vault" onPress={() => router.push('/')} />} /> : null}
      {ORDER.map(({ kind, title }) => {
        const items = map.filter((e) => e.kind === kind);
        if (!items.length) return null;
        return (
          <Section key={kind} title={title}>
            <Stack gap={8}>
              {items.map((e) => {
                const pub = v.pub[e.id] ?? {};
                return (
                  <Card key={e.id} onPress={() => router.push(`/entry?id=${e.id}`)} testID={`map-${e.title}`}>
                    <Row gap={10}>
                      <Text style={{ fontSize: 22 }}>{kindOf(e.kind).emoji}</Text>
                      <Stack gap={2} style={{ flex: 1 }}>
                        <Strong>{e.title}</Strong>
                        {Object.entries(pub).map(([k, val]) => (
                          <Body key={k}>{val}</Body>
                        ))}
                      </Stack>
                      {pub.phone ? <Button small title="Call" onPress={() => Linking.openURL(`tel:${pub.phone.replace(/\s/g, '')}`)} /> : null}
                    </Row>
                  </Card>
                );
              })}
            </Stack>
          </Section>
        );
      })}
      <Muted>Secret details (🔒) open when you tap an entry.</Muted>
    </Screen>
  );
}
