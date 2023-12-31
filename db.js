import dotenv from 'dotenv';
dotenv.config();

import { createPool } from 'mysql2/promise';

export const pool = createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME
});
