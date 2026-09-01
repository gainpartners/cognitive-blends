import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { errorFields, logger } from './log';

describe('errorFields', () => {
  it('picks name and message from Error', () => {
    const err = new Error('nope');
    err.name = 'TimeoutError';
    assert.deepEqual(errorFields(err), { name: 'TimeoutError', message: 'nope' });
  });

  it('stringifies non-errors', () => {
    assert.deepEqual(errorFields('boom'), { message: 'boom' });
  });
});

describe('logger', () => {
  it('writes [scope] message and redacts secret keys', () => {
    const lines: unknown[] = [];
    const original = console.warn;
    console.warn = (...args: unknown[]) => {
      lines.push(args);
    };
    try {
      logger('test').warn('probe', {
        hasToken: true,
        api_token: 'secret-value',
        password: 'hunter2',
        shopDomain: 'zzqvvg-ma.myshopify.com',
      });
    } finally {
      console.warn = original;
    }
    assert.equal(lines.length, 1);
    const args = lines[0] as unknown[];
    assert.equal(args[0], '[test] probe');
    assert.deepEqual(args[1], {
      hasToken: true,
      api_token: '[redacted]',
      password: '[redacted]',
      shopDomain: 'zzqvvg-ma.myshopify.com',
    });
  });

  it('exposes debug, info, warn, and error', () => {
    const log = logger('test');
    assert.equal(typeof log.debug, 'function');
    assert.equal(typeof log.info, 'function');
    assert.equal(typeof log.warn, 'function');
    assert.equal(typeof log.error, 'function');
  });

  it('writes error with console.error in development', () => {
    const lines: unknown[] = [];
    const originalError = console.error;
    const originalWarn = console.warn;
    console.error = (...args: unknown[]) => {
      lines.push(['error', ...args]);
    };
    console.warn = (...args: unknown[]) => {
      lines.push(['warn', ...args]);
    };
    try {
      logger('test').error('boom', { id: 1 });
    } finally {
      console.error = originalError;
      console.warn = originalWarn;
    }
    const production = process.env.NODE_ENV === 'production';
    assert.equal(lines.length, 1);
    const args = lines[0] as unknown[];
    assert.equal(args[0], production ? 'warn' : 'error');
    assert.equal(args[1], '[test] boom');
    assert.deepEqual(args[2], { id: 1 });
  });
});
