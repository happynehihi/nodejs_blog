import { db } from './connection.js'

const creatSql = `CREATE TABLE users (
    id INT AUTO_INCREMENT,
    username VARCHAR(255),
    password VARCHAR(255),
    salt VARCHAR(255),
    name VARCHAR(255),
    age INT UNSIGNED,
    gender BOOLEAN,
    email VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE (username)
)`

db.query(creatSql, (err) => {
  if (err) {
    console.log(err)
    return
  }

  db.query(seedSql, (seedErr) => {
    if (seedErr) {
      console.log(seedErr)
      return
    }

    console.log('Success init database...')
  })
})