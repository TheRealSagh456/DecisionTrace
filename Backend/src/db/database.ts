import knex from 'knex'
import dotenv from 'dotenv'

dotenv.config()

export const db = knex({
  client: 'better-sqlite3',
  connection: {
    filename: process.env.DATABASE_URL ?? './src/db/database.db',
  },
  useNullAsDefault: true,
}) 