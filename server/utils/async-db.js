const mysql = require('mysql')
// 本地连接数据库
const pool = mysql.createPool({
  host     :  'localhost',
  user     :  'root',
  password :  '',
  database :  'huang_iiio'
})

// 服务器连接数据库
// const pool = mysql.createPool({
//   host     :  '127.0.0.1',
//   user     :  'huang_iiio',
//   password :  'huang_iiio',
//   database :  'huang_iiio'
// })

const query = function  ( sql, values ) {
  return new Promise(( resolve, reject ) => {
    // 数据库连接池api
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}

module.exports= {query}