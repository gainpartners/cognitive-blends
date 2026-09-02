import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  isAlreadyCustomerError,
  isValidEmail,
  parseSubscribeFields,
} from './subscribe-fields';

describe('isValidEmail', () => {
  it('accepts a normal address', () => {
    assert.equal(isValidEmail('jack@cognitiveblends.com'), true);
  });

  it('rejects junk', () => {
    assert.equal(isValidEmail(''), false);
    assert.equal(isValidEmail('not-an-email'), false);
    assert.equal(isValidEmail('a@b'), false);
  });
});

describe('parseSubscribeFields', () => {
  it('requires names on the homepage form', () => {
    const data = new FormData();
    data.set('email', 'a@b.com');
    const result = parseSubscribeFields(data, { requireName: true });
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, /First name/);
  });

  it('allows email-only for the footer', () => {
    const data = new FormData();
    data.set('email', 'a@b.com');
    const result = parseSubscribeFields(data);
    assert.deepEqual(result, {
      ok: true,
      fields: { email: 'a@b.com', firstName: '', lastName: '' },
    });
  });
});

describe('isAlreadyCustomerError', () => {
  it('treats TAKEN as already on the list', () => {
    assert.equal(isAlreadyCustomerError('TAKEN', 'Email has already been taken'), true);
    assert.equal(isAlreadyCustomerError('TOO_SHORT', 'Password is too short'), false);
  });
});
