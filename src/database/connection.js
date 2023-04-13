import mysql from 'mysql'

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'sgroup_backend'
})

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db ' + err)
        return
    }
    console.log('Connected to MySQL')
})

export { connection }