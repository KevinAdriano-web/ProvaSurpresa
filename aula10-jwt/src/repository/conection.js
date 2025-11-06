import mysql from 'mysql2/promise'


let conection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Admin@123',
  database: 'freiDB'
})


export { conection }

