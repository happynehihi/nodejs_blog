import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const knexConnection = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: 3306,
    },
});

console.log('Connected to MySQL');

export { knexConnection as db };