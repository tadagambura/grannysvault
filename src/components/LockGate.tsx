// Locks the whole vault behind Face ID / fingerprint, falling back to the phone's passcode.
// Re-locks after RELOCK_MS in the background. Refuses to open on a phone with no screen lock,
// because then nothing protects the vault.
import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AppState, Platform, Text, View } from 'react-native';
import { track } from '@/kit/analytics';
import { TEST_MODE } from '@/kit/Root';
import { useTheme } from '@/kit/theme';
import { Body, Button, Display, Muted, Note, Screen } from '@/kit/ui';
import { RELOCK_MS } from '@/domain/vault';

const native = Platform.OS === 'ios' || Platform.OS === 'android';

export function LockGate({ children }: { children: ReactNode }) {
  const { c } = useTheme();
  const [locked, setLocked] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const hiddenAt = useRef<number | null>(null);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s !== 'active') hiddenAt.current = Date.now();
      else if (hiddenAt.current && Date.now() - hiddenAt.current > RELOCK_MS) setLocked(true);
    });
    return () => sub.remove();
  }, []);

  const unlock = async () => {
    setMsg(null);
    if (!native) {
      if (TEST_MODE) {
        setLocked(false);
        return;
      }
      setMsg("Granny's Vault opens on your phone, where Face ID or your passcode protects it.");
      return;
    }
    const level = await LocalAuthentication.getEnrolledLevelAsync();
    if (level === LocalAuthentication.SecurityLevel.NONE) {
      setMsg("Your phone has no screen lock, so the vault can't be protected. Set a passcode in your phone's settings, then come back.");
      return;
    }
    const r = await LocalAuthentication.authenticateAsync({ promptMessage: "Unlock Granny's Vault", disableDeviceFallback: false, cancelLabel: 'Cancel' });
    if (r.success) {
      setLocked(false);
      track('app_opened', { unlocked: true });
    } else if (r.error !== 'user_cancel' && r.error !== 'system_cancel') setMsg("That didn't work. Try again, or use your phone's passcode.");
  };

  if (!locked) return <>{children}</>;
  return (
    <Screen edges={['top', 'bottom']} testID="lock">
      <View style={{ alignItems: 'center', paddingTop: 40, gap: 12 }}>
        <Text style={{ fontSize: 96 }}>👵</Text>
        <Display center>Locked</Display>
        <Body center>Granny peers over her glasses. Prove it's you.</Body>
      </View>
      <Button title={native ? 'Unlock with Face ID or passcode' : TEST_MODE ? 'Unlock (web test preview)' : 'Unlock'} icon="lock-open-outline" onPress={unlock} testID="unlock" />
      {!native && TEST_MODE ? <Note tone="warning">Web test preview: there is no biometric lock in a browser and nothing is saved securely. Never put real details in here.</Note> : null}
      {msg ? <Note tone="warning">{msg}</Note> : null}
      <Muted center color={c.textMuted}>{`Locks again ${RELOCK_MS / 60000} minute after you leave the app.`}</Muted>
    </Screen>
  );
}
