import type { Brand } from '@/kit/theme';

export const brand: Brand = {
  slug: 'grannysvault',
  name: "Granny's Vault",
  tagline: "The family vault: passwords, documents and the 'if anything happens' info",
  fonts: { display: 'Fraunces_700Bold' },
  defaultTheme: 'burgundy',
  radius: 14,
  light: { bg: '#FBF6F1', surface: '#FFFFFF', surfaceAlt: '#F3E6E2', text: '#21141A', textMuted: '#624E55', border: '#E9D7D2', primary: '#8E2A44', primaryText: '#FFFFFF', accent: '#C9A227', accentText: '#21141A', success: '#1B7A35', warning: '#8A5300', danger: '#B3261E', focus: '#8E2A44' },
  dark: { bg: '#160C10', surface: '#21131A', surfaceAlt: '#2E1C23', text: '#F8EBEE', textMuted: '#C9AEB6', border: '#3E2730', primary: '#F0A3B6', primaryText: '#2A0A13', accent: '#E8C75A', accentText: '#21141A', success: '#7FD99A', warning: '#F3B44C', danger: '#FF8A80', focus: '#F0A3B6' },
  premiumPerks: ['Unlimited entries (free has 20)', 'Encrypted family sharing as it launches', 'Every learning card', 'Never any ads in the vault'],
  privacyUrl: 'https://kaoticchainz.com/privacy',
  termsUrl: 'https://kaoticchainz.com/terms',
  supportEmail: 'hello@kaoticchainz.com',
};
