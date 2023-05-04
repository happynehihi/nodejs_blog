import mysql from 'mysql'
import dotenv from 'dotenv'
dotenv.config()

const connection = mysql.createPool({
    multipleStatements: false,
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.getConnection((err) => {
    if (err) {
        console.log('Error connecting to Db ' + err)
        return
    }
    console.log('Connected to MySQL')
})

export { connection as db }