import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  DEFAULT_COUNTRY,
  isAvailableCountry,
  isCountryContextError,
  normalizeCountryCode,
  resolveCountryCode,
} from './country-code';

describe('normalizeCountryCode', () => {
  it('uppercases a valid ISO code', () => {
    assert.equal(normalizeCountryCode('es'), 'ES');
  });

  it('maps UK to GB', () => {
    assert.equal(normalizeCountryCode('uk'), 'GB');
  });

  it('rejects unknown geo placeholders', () => {
    assert.equal(normalizeCountryCode('XX'), null);
    assert.equal(normalizeCountryCode('T1'), null);
  });

  it('rejects junk', () => {
    assert.equal(normalizeCountryCode('Spain'), null);
    assert.equal(normalizeCountryCode(''), null);
    assert.equal(normalizeCountryCode(undefined), null);
  });
});

describe('resolveCountryCode', () => {
  it('prefers the cookie over IP', () => {
    assert.equal(resolveCountryCode('GB', 'ES'), 'GB');
  });

  it('uses IP when there is no cookie', () => {
    assert.equal(resolveCountryCode(undefined, 'es'), 'ES');
  });

  it('falls back to Ireland', () => {
    assert.equal(resolveCountryCode(undefined, undefined), DEFAULT_COUNTRY);
    assert.equal(resolveCountryCode(undefined, 'XX'), DEFAULT_COUNTRY);
  });
});

describe('isAvailableCountry', () => {
  it('matches ISO codes from the Markets list', () => {
    assert.equal(isAvailableCountry('GB', [{ isoCode: 'IE' }, { isoCode: 'GB' }]), true);
    assert.equal(isAvailableCountry('US', [{ isoCode: 'IE' }, { isoCode: 'GB' }]), false);
  });
});

describe('isCountryContextError', () => {
  it('detects Storefront country coercion failures', () => {
    assert.equal(
      isCountryContextError(
        'Variable $country of type CountryCode was provided invalid value',
      ),
      true,
    );
    assert.equal(isCountryContextError('Could not reach Shopify'), false);
  });
});
