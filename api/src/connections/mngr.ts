import { DB_ORACLE_DIR, DB_ORACLE_DIR_TNS, DB_ORACLE_NAME, DB_MNG_USER, DB_MNG_PASS } from '../config'
import oracledb, { Pool } from 'oracledb';
import { logger } from '../utils/logger';

oracledb.initOracleClient({ libDir: DB_ORACLE_DIR });

export async function connMngrOra(): Promise<Pool | Error> {
  try {
    const pool = await oracledb.createPool({
      user: DB_MNG_USER,
      password: DB_MNG_PASS,
      configDir: DB_ORACLE_DIR_TNS,
      connectString: DB_ORACLE_NAME
    })

    if (!pool) throw new Error('Error connecting to Oracle database');

    return pool;
  } catch (error) {
    logger.error('Error connecting to Oracle database', error);
    return error as Error
  } 
}
