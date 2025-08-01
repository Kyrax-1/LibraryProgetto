require('dotenv').config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
});

const db = pool.promise();
module.exports = db;
