import { Pool } from 'pg';

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_FueUf9artbD0@ep-gentle-fire-a963w3me-pooler.gwc.azure.neon.tech/neondb?sslmode=require",
  ssl: {
    rejectUnauthorized: false
  }
});

export { pool };
