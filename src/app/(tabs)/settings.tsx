import { KitSettings } from '@/kit/Settings';
import { Card, ListRow, Section } from '@/kit/ui';
import { deleteAllSecrets } from '@/state/secrets';
import { useVault } from '@/state/vault';

export default function Settings() {
  const ids = useVault((s) => s.entries).map((e) => e.id);
  return (
    <KitSettings
      reminder={{ title: "Granny's Vault", body: "A quick check: is everything in the vault still up to date?", explain: 'A gentle weekly nudge you can switch off any time.', weekly: true }}
      onDataDeleted={() => {
        void deleteAllSecrets(ids);
      }}
    >
      <Section title="Security">
        <Card>
          <ListRow icon="finger-print-outline" title="Locked with Face ID, fingerprint or passcode" subtitle="It locks again a minute after you leave the app." />
          <ListRow icon="hardware-chip-outline" title="Secrets stay in your phone's secure chip" subtitle="Passwords, numbers and medical notes are never uploaded or exported." />
          <ListRow icon="information-circle-outline" title="Not a will or legal document" subtitle="The vault helps people find things. It doesn't replace a will or power of attorney." />
        </Card>
      </Section>
    </KitSettings>
  );
}
