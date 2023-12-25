const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
});

pool.connect((err) => {
  if (err) {
    console.log("Error connecting to Db");
    return;
  }
  console.log(`Connected to ${process.env.PGDATABASE} database!`);
});

module.exports = pool;
