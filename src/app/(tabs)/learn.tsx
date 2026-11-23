import { CardLibrary, type CardPack } from '@/kit/cards';
import { H1, Muted, Screen } from '@/kit/ui';
import raw from '@/content/cards.json';

const pack = raw as CardPack;

export default function Learn() {
  return (
    <Screen testID="learn">
      <H1>Staying safe</H1>
      <Muted>Passwords, scams and getting affairs in order. General information, not legal advice.</Muted>
      <CardLibrary pack={pack} app="grannysvault" />
    </Screen>
  );
}
