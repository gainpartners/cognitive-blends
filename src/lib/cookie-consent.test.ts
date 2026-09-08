import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseConsent } from './cookie-consent';

describe('parseConsent', () => {
  it('reads a valid payload', () => {
    const raw = encodeURIComponent(
      JSON.stringify({ analytics: true, timestamp: '2026-09-08T08:00:00.000Z' }),
    );
    assert.deepEqual(parseConsent(raw), {
      analytics: true,
      timestamp: '2026-09-08T08:00:00.000Z',
    });
  });

  it('rejects junk', () => {
    assert.equal(parseConsent(undefined), null);
    assert.equal(parseConsent(''), null);
    assert.equal(parseConsent('not-json'), null);
    assert.equal(
      parseConsent(encodeURIComponent(JSON.stringify({ analytics: 'yes' }))),
      null,
    );
  });
});
