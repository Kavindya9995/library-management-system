import { Pool } from "pg"; // node.js package for working with postgresql
import dotenv from "dotenv"; // load configuration values from .env file into process.env

dotenv.config(); // read .env file

//postgresql database connection pool
// Pool is a class
const pool = new Pool({ // create new connection pool
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT), // Environment variables are read as strings
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

export default pool;
