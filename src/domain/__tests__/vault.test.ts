import { completeness, entryError, FREE_ENTRIES, splitFields, type Entry } from '../vault';

test('secret fields are separated from public ones', () => {
  const { pub, secret } = splitFields('login', { site: 'Barclays', username: 'dad@example.com', password: 'hunter2', notes: ' ' });
  expect(pub).toEqual({ site: 'Barclays', username: 'dad@example.com' });
  expect(secret).toEqual({ password: 'hunter2' });
  expect(splitFields('medical', { gp: 'Park Surgery', medication: 'Statins' }).secret).toEqual({ medication: 'Statins' });
});

test('validation: name, free limit, size and phone numbers', () => {
  expect(entryError(' ', 'note', {}, 0, false, true)).toMatch(/name/);
  expect(entryError('A', 'note', {}, FREE_ENTRIES, false, true)).toMatch(/20 entries/);
  expect(entryError('A', 'note', {}, FREE_ENTRIES, false, false)).toBeNull(); // editing is always fine
  expect(entryError('A', 'note', { notes: 'x'.repeat(3000) }, 0, false, true)).toMatch(/lot of text/);
  expect(entryError('Mum', 'contact', { phone: 'call me' }, 0, false, true)).toMatch(/phone/);
  expect(entryError('Mum', 'contact', { phone: '+44 7700 900123' }, 0, false, true)).toBeNull();
});

test('completeness checklist', () => {
  const e = (kind: Entry['kind'], emergency = false): Entry => ({ id: Math.random().toString(), kind, title: 'x', updated: '2026-11-23', emergency });
  expect(completeness([])).toEqual({ done: 0, total: 5 });
  expect(completeness([e('contact', true), e('medical', true), e('document', true), e('login')])).toEqual({ done: 5, total: 5 });
});
