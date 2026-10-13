type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const COLORS: Record<LogLevel, string> = {
  debug: '\x1b[90m',
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
};

const RESET = '\x1b[0m';

const envLevel = (process.env.LOG_LEVEL as LogLevel | undefined)
  ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

const minLevel = LEVELS[envLevel] ?? LEVELS.debug;

const useColor = process.stdout?.isTTY ?? false;

const sinks: Record<LogLevel, (...args: unknown[]) => void> = {
  debug: console.log,
  info: console.log,
  warn: console.warn,
  error: console.error,
};

function write(level: LogLevel, ...args: unknown[]) {
  if (LEVELS[level] < minLevel) return;

  const label = `[${new Date().toISOString()}] [${level.toUpperCase()}]`;
  const prefix = useColor ? `${COLORS[level]}${label}${RESET}` : label;

  sinks[level](prefix, ...args);
}

export const logger = {
  debug: (...args: unknown[]) => write('debug', ...args),
  info: (...args: unknown[]) => write('info', ...args),
  warn: (...args: unknown[]) => write('warn', ...args),
  error: (...args: unknown[]) => write('error', ...args),
};

export default logger;
