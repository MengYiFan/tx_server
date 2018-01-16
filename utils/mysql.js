const config = require('../config'),
      mysql = require('mysql')

/**
 * 原SQL, 发送SQL语句
 * @param  {[string]} sql    [SQL语句]
 * @param  {[array]} values [SQL需要填充的数据]
 * @param  {[string]} type   ['' || 'update']
 * @return {[object]}        [返回API 数据]
 */
exports.query = (sql, values = null, type = '') => {
  return new Promise((resolve, reject) => {
    try {
      var connection = mysql.createConnection(config.mysql)

      if (type === 'update') {
        // 转义格式化数据
        connection.config.queryFormat = (sql, values) => {
          if (!values) return sql
          return sql.replace(/\:(\w+)/g, function(txt, key) {
            if (values.hasOwnProperty(key)) {
              return escape(values[key])
            }

            return txt
          }.bind(this))
        }
      }
      //
      connection.connect((err) => {
        if (err) {
          console.error('error connecting: ' + err.stack)
          resolve({
            ret: false,
            errMsg: '数据库失联了.'// err.stack
          })
          return
        }
      })
      //
      var q = connection.query(sql, values, (err, rows, fields) => {
        try {
          if (err) {
            resolve({
              ret: false,
              errMsg: `后台数据罢工了.(${err})`
            })
          }
          resolve({
            ret: true,
            data: {
              length: rows.length || 0,
              rows: toJson(rows),
              fields: toJson(fields)
            }
          })
        } catch(e) {
          resolve({
            ret: false,
            errMsg: `程序错误<c>.(${e.message})`
          })
        }
      })
      console.log('@执行SQL语句\n', q.sql, '\n***************')
      connection.end()
    } catch(e) {
      resolve({
        ret: false,
        errMsg: `程序错误2<c>.(${e.message})`
      })
    }
  })
}

function toJson (data) {
  try {
    return JSON.parse(JSON.stringify(data))
  } catch(e) {
    return data
  }
}
