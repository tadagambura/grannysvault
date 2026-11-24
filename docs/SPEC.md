# Granny's Vault: Spec

**The family vault: passwords, documents and the 'if anything happens' info, locked with Face ID** · #16 of 17 · Wave 1: Daily keepers · Used: Occasional, high trust · Medium · Revenue potential: Medium · Home & Family · Source: Owner's idea (r/SomebodyMakeThis life-admin request)

## One-liner

A calm, private vault for the life admin nobody wants to lose: account logins, policy numbers, where the will is kept, GP and medication details, who to call in an emergency. Locked with Face ID, fingerprint or the phone passcode, stored encrypted on the phone. Built for adult children looking after ageing parents, and for parents getting their own affairs in order. Starring a sneaky granny who always forgets her passwords.

## Problem / audience

- **Who it's for:** UK adults caring for parents, and anyone who wants their important information findable in an emergency.
- **The problem it solves:** When something happens, families can't find passwords, policies, wills or medication lists, and the person who knew is the one who needs help.
- **Example:** A daughter sets up her dad's vault on a Sunday: his bank's phone number, his GP, his medication, where the will is, and the logins he always forgets. Face ID keeps it private; the emergency map is one tap away.

## MVP features (ship with only these)

1. Locked with Face ID, fingerprint or the phone passcode; re-locks when you leave the app
2. Entries for logins, documents, policies, contacts and medical info, stored encrypted on the device
3. Emergency info map: who to call, where things are, GP, medication and allergies
4. Life-admin learning cards: protecting passwords, scams targeting older people, power of attorney basics
5. Gentle review reminders: check the vault twice a year

## Not in MVP

- Encrypted family sharing (trusted contacts)
- Document photos with on-device encryption
- Printable emergency sheet
- Widgets with Kaos

## Monetisation

| Model | Detail |
|---|---|
| Free | Up to 20 entries and the emergency info map, no ads in the vault |
| Premium | £34.99/year (shown first) or £3.49/month: unlimited entries, family sharing as it launches, document photos, every learning card, every Arcade game in the app |
| Arcade games | £0.99 each, kept forever, or every game in the app with Premium |
| KC All Access | £25 once (every Arcade game in every KC app, kept forever) plus £7.99/month or £79.99/year (Premium in every KC app). Needs a free KC account. |
| Ads | None inside the vault |

Prices are starting points; test before committing. **Portfolio premium promise:** free has ads; the moment you pay you get no ads, cloud backup and storage, and sync across your devices, plus this app's extras.

## Retention: The Progression Loop

| Stage | Design |
|---|---|
| Cue | Twice-yearly review reminder and life events |
| Tiny win | Add or update an entry |
| Progress | Vault completeness checklist |
| Share | Invite a trusted family member (later) |
| Next step | The next review date |
| Cadence | Monthly to occasional |

Follow the portfolio guardrails: no guilt-trip notifications, no fake urgency, progress is
never wiped, at most one notification a day by default.

## Animation and tone: five signature animations

**Playful.** Celebrations, confetti, cute characters, satisfying sounds and mild comic reactions. Nothing tragic.

- Unlock: Granny peers over her glasses at the camera and nods
- Forgotten password saved: Granny scribbles it on a sticky note, then Kaos snatches it and locks it in the vault
- Emergency map complete: Granny puts her feet up with a cup of tea
- Review reminder: Granny dusts off the vault with a feather duster
- Scam card read: Granny bonks a scammer's phone with her handbag

**Line we don't cross:** Never make light of illness, death or dementia; the vault itself stays calm.

## AI

**None.** Not needed. Plain code and the phone's secure hardware do everything. (Portfolio rule: plain code first, code does the maths,
cheapest model, shared budget cap, premium-gated.)

## Platform & data

- **Platform:** Expo app (iOS, Android).
- **Data:** On the device only, encrypted, behind biometrics or the passcode. Nothing uploaded.
- **Backend:** None for v1. Family sharing later needs end-to-end encrypted sync. Premium backup and sync use the shared portfolio backend (see the master repo's HOSTING.md).
- **Stack:** shared portfolio foundation (Expo, PostHog, RevenueCat, AdMob, shared Progression Loop module).

## Growth engine

- **Content pillars:** Password safety; Scams targeting older people; Getting affairs in order; Emergency preparedness
- **Shareable output:** Invite a trusted family member (later)

## Risks

Security is the product: needs an independent security review before launch, careful encryption (expo-secure-store keys, no plaintext export without re-auth), and clear wording that it is not a replacement for a will or legal advice. Apple and Google scrutinise password-storing apps.

## Launch checklist

- [ ] Name checked on the App Store, Play Store and a trademark search
- [ ] MVP features done and tested
- [ ] Progression Loop wired (cue, tiny win, progress, milestone, next step)
- [ ] Privacy policy and terms
- [ ] Landing page
- [ ] Analytics wired (D1/D7/D30 retention)
- [ ] Payments / ads wired
- [ ] Added to the Growth & Maintenance Engine as an app config
