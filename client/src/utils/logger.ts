type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

const LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: Number.POSITIVE_INFINITY,
};

const COLORS: Record<Exclude<LogLevel, 'silent'>, string> = {
  debug: 'color: #6b7280',
  info: 'color: #0891b2',
  warn: 'color: #d97706',
  error: 'color: #dc2626',
};

const configured = import.meta.env.VITE_LOG_LEVEL as LogLevel | undefined;

const minLevel = configured
  ? (LEVELS[configured] ?? LEVELS.debug)
  : (import.meta.env.DEV ? LEVELS.debug : LEVELS.silent);

const sinks: Record<Exclude<LogLevel, 'silent'>, (...args: unknown[]) => void> = {
  debug: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

function write(level: Exclude<LogLevel, 'silent'>, ...args: unknown[]) {
  if (LEVELS[level] < minLevel) return;

  sinks[level](`%c[${level.toUpperCase()}]`, COLORS[level], ...args);
}

export const logger = {
  debug: (...args: unknown[]) => write('debug', ...args),
  info: (...args: unknown[]) => write('info', ...args),
  warn: (...args: unknown[]) => write('warn', ...args),
  error: (...args: unknown[]) => write('error', ...args),
};

export default logger;
