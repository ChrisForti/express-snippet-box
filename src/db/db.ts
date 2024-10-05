import pg from "pg";

const { Pool } = pg;
export const pool = new Pool({
  connectionString: "postgresql://postgres:password@localhost:5432/postgres",
});
