const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

pool.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Connected to database`);
  }
});

module.exports = pool;
