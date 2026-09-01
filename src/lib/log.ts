/**
 * One logger for server (and client, if needed).
 *
 *   const log = logger('cart');
 *   log.debug('listReviews fetch', { productId });
 *   log.info('added line', { merchandiseId });
 *   log.warn('getCart failed; treating as empty', errorFields(error));
 *   log.error('cartCreate returned no cart');
 *
 * debug — development only (noisy progress)
 * info  — development only (expected progress)
 * warn  — always (recovered: skipped, user error, empty fallback)
 * error — actually broken. console.error in development only;
 *         production writes the same line with console.warn so the
 *         host log still has it without an error-level console.
 *
 * Do not put tokens, passwords, or secrets in `fields`. Matching keys
 * are redacted as a backstop, not a license.
 */

export type LogFields = Record<string, unknown>;
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type Logger = {
  debug: (message: string, fields?: LogFields) => void;
  info: (message: string, fields?: LogFields) => void;
  warn: (message: string, fields?: LogFields) => void;
  error: (message: string, fields?: LogFields) => void;
};

export function isDebug(): boolean {
  return process.env.NODE_ENV !== 'production';
}

function isSecretKey(key: string): boolean {
  const k = key.toLowerCase();
  if (k === 'hastoken' || k === 'has_token') return false;
  return (
    k === 'token' ||
    /password|secret|authorization|api_token|access_token/.test(k)
  );
}

function sanitize(fields?: LogFields): LogFields | undefined {
  if (!fields) return undefined;
  const out: LogFields = {};
  for (const [key, value] of Object.entries(fields)) {
    out[key] = isSecretKey(key) ? (value ? '[redacted]' : null) : value;
  }
  return out;
}

function methodFor(level: LogLevel): 'debug' | 'info' | 'warn' | 'error' {
  if (level === 'error' && !isDebug()) return 'warn';
  if (level === 'debug') return 'debug';
  return level;
}

function emit(level: LogLevel, scope: string, message: string, fields?: LogFields) {
  if ((level === 'debug' || level === 'info') && !isDebug()) return;

  const line = `[${scope}] ${message}`;
  const safe = sanitize(fields);
  const method = methodFor(level);
  if (safe) console[method](line, safe);
  else console[method](line);
}

export function logger(scope: string): Logger {
  return {
    debug: (message, fields) => emit('debug', scope, message, fields),
    info: (message, fields) => emit('info', scope, message, fields),
    warn: (message, fields) => emit('warn', scope, message, fields),
    error: (message, fields) => emit('error', scope, message, fields),
  };
}

export function errorFields(error: unknown): LogFields {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }
  return { message: String(error) };
}
