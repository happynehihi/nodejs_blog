import { connection } from './connection.js';

const createTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255)
    )
  `;
    connection.query(sql, (err) => {
        if (err) throw err;
        console.log('Table created!');
    });
};

const insertData = () => {
    const sql = `
    INSERT INTO users (name, email)
    VALUES ('Le Thi Phuc', 'thiphuc@gmail.com'),
           ('Le Phan Hoang Phuc', 'hoangphuc@gmail.com'),
           ('Le Anh Quoc', 'quoc@gmail.com')
  `;
    connection.query(sql, (err) => {
        if (err) throw err;
        console.log('Data inserted!');
    });
};

createTable();
insertData();