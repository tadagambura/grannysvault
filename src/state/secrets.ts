// Secret fields live in the phone's secure hardware-backed store (iOS Keychain, Android Keystore),
// one item per entry. They are never written to normal storage, analytics or exports.
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { TEST_MODE } from '@/kit/Root';
import type { Fields } from '@/domain/vault';

const key = (id: string) => `gv.secret.${id.replace(/[^A-Za-z0-9._-]/g, '')}`;
const memory = new Map<string, string>(); // web preview only, never persisted

/** Secrets can only be stored on a real phone. The web build is a labelled test preview. */
export const secureAvailable = Platform.OS === 'ios' || Platform.OS === 'android' || TEST_MODE;

export async function saveSecret(id: string, secret: Fields): Promise<void> {
  const v = JSON.stringify(secret);
  if (Platform.OS === 'web') {
    memory.set(key(id), v);
    return;
  }
  await SecureStore.setItemAsync(key(id), v, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY });
}

export async function readSecret(id: string): Promise<Fields> {
  const raw = Platform.OS === 'web' ? memory.get(key(id)) ?? null : await SecureStore.getItemAsync(key(id));
  try {
    return raw ? (JSON.parse(raw) as Fields) : {};
  } catch {
    return {};
  }
}

export async function deleteSecret(id: string): Promise<void> {
  if (Platform.OS === 'web') memory.delete(key(id));
  else await SecureStore.deleteItemAsync(key(id));
}

export async function deleteAllSecrets(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => deleteSecret(id).catch(() => {})));
}
