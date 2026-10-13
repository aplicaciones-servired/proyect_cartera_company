import { DB_ORACLE_DIR, DB_ORACLE_DIR_TNS, DB_ORACLE_NAME_NAOS, DB_ORACLE_PASS, DB_ORACLE_USER } from '../config'
import oracledb, { Pool } from 'oracledb';
import { logger } from '../utils/logger';

oracledb.initOracleClient({ libDir: DB_ORACLE_DIR });

export async function connOracle_naos(): Promise<Pool | Error> {
  try {
    const pool = await oracledb.createPool({
      user: DB_ORACLE_USER,
      password: DB_ORACLE_PASS,
      configDir: DB_ORACLE_DIR_TNS,
      connectString: DB_ORACLE_NAME_NAOS
    })

    if (!pool) throw new Error('Error connecting to Oracle database');

    return pool;
  } catch (error) {
    logger.error('Error connecting to Oracle database', error);
    return error as Error
  }
}
