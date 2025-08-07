import { Pool } from 'pg'

const PG_HOST = process.env.PGHOST || process.env.SUPABASE_PGHOST
const PG_PORT = Number(process.env.PGPORT || 5432)
const PG_DATABASE = process.env.PGDATABASE
const PG_USER = process.env.PGUSER
const PG_PASSWORD = process.env.PGPASSWORD

export const pgPool = new Pool({
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USER,
  password: PG_PASSWORD,
  ssl: { rejectUnauthorized: false },
  max: 10,
})

export async function pgQuery<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }> {
  const client = await pgPool.connect()
  try {
    const res = await client.query(text, params)
    return { rows: res.rows as T[] }
  } finally {
    client.release()
  }
}


