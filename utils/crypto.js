const crypto = require('crypto')

/**
 * md5加密数据
 * @data  {[string]} data [description]
 * @return {[string]}      [description]
 */
exports.md5 = (data) => {
  if (toString.call(data) == '[object Object]') {
    data = JSON.stringify(data)
  }
  return crypto.createHash('md5')
    .update(data, 'utf8')
    .digest('hex')
}