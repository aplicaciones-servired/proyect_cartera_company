import { z } from 'zod';
import { logger } from '../utils/logger';

const envSchama = z.object({
  PORT: z.string().min(2),
  CARTERA_FRONTEND: z.string().min(4),
  VERSION: z.string().min(4),
  DB_NAME: z.string().min(4),
  DB_USER: z.string().min(4),
  DB_PASS: z.string().min(4),
  DB_HOST: z.string().min(4),
  DB_PORT: z.string().min(4).transform((val) => parseInt(val, 10)),
  DB_ORACLE_USER: z.string().min(6),
  DB_ORACLE_PASS: z.string().min(6),
  DB_ORACLE_NAME: z.string().min(4),
  DB_ORACLE_NAME_NAOS: z.string().min(4),
  DB_MNG_USER: z.string().min(6),
  DB_MNG_PASS: z.string().min(6),
  DB_ORACLE_DIR: z.string().min(6),
  DB_ORACLE_DIR_TNS: z.string().min(6),
})

const { success, data, error } = envSchama.safeParse(process.env)

if (!success) {
  logger.error(error.format());
  process.exit(1);
}

export const { PORT, CARTERA_FRONTEND, VERSION,
  DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT,
  DB_ORACLE_USER, DB_ORACLE_PASS, DB_ORACLE_NAME, DB_ORACLE_NAME_NAOS, DB_MNG_USER,
  DB_MNG_PASS, DB_ORACLE_DIR, DB_ORACLE_DIR_TNS
} = data
