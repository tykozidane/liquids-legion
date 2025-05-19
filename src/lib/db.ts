import { Pool, QueryResultRow } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query<T extends QueryResultRow>(text: string, params?: any[]): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query<T>(text, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
}
