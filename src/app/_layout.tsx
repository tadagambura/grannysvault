import { Fraunces_700Bold, useFonts } from '@expo-google-fonts/fraunces';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Intro } from '@/kit/Intro';
import { prefsStore } from '@/kit/prefs';
import { KitRoot } from '@/kit/Root';
import { useTheme } from '@/kit/theme';
import { brand } from '@/brand';
import { LockGate } from '@/components/LockGate';

SplashScreen.preventAutoHideAsync().catch(() => {});
const usePrefs = prefsStore('grannysvault', 10);
const Art = ({ children }: { children: string }) => <Text style={{ fontSize: 88 }}>{children}</Text>;

function Shell() {
  const { c } = useTheme();
  const onboarded = usePrefs((s) => s.onboarded);
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <LockGate>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="entry" options={{ headerShown: true, title: 'Entry', presentation: 'modal', headerTintColor: c.text, headerStyle: { backgroundColor: c.bg }, headerShadowVisible: false }} />
      </Stack>
      </LockGate>
      {!onboarded ? (
        <View style={StyleSheet.absoluteFill}>
          <Intro
            cta="Set up the vault"
            onDone={() => usePrefs.getState().setOnboarded()}
            steps={[
              { title: 'Everything in one safe place', body: "Logins, where the will is kept, policy numbers, GP and medication: the things a family needs when it matters.", art: <Art>👵</Art> },
              { title: 'Locked with Face ID', body: 'Only you can open it, with Face ID, your fingerprint or your phone passcode. Secrets are stored in your phone\'s secure chip.', art: <Art>🔐</Art> },
              { title: 'The emergency map', body: 'Mark the essentials and they appear on one calm page: who to call, what to know, where things are.', art: <Art>🗺️</Art> },
            ]}
          />
        </View>
      ) : null}
    </View>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({ Fraunces_700Bold });
  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);
  if (!loaded && !error) return null;
  return (
    <KitRoot brand={brand}>
      <Shell />
    </KitRoot>
  );
}
