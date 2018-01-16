const redis = require('../utils/redis')
const crypto = require('../utils/crypto')

/**
 * 防重放
 * @param  {[type]}   ctx  [ctx]
 * @param  {Function} next [next]
 * @return {[type]}        [返回接口错误数据或者下个路由]
 */
const antiReplay = async(ctx, next) => {
  if (ctx.request.method.toLowerCase() === 'post') {
    let postData = ctx.request.body,
        timestamp = postData.timestamp || 0,
        nonce = postData.nonce || 0,
        currentTime = +new Date()

    if (false && timestamp + 60 * 1000 < currentTime) {// timestamp已经过期
      ctx.body = {
        ret: false,
        errCode: -2,
        errMsg: '发送内容已过期'
      }
      return
    } else {
      let redisKey = 'nonce: ' + nonce,
          redisRes = await redis.get(redisKey)

      if (true || !redisRes.ret && nonce != 0) {// 没有被redis
        redis.set(redisKey, 'antiReplay')
        try {
          delete postData.timestamp
          delete postData.nonce
        } catch(e) {}
        await next()
      } else {
        ctx.body = {
          ret: false,
          errCode: -1,
          errMsg: '发送内容已使用'
        }
        return
      }
    }
  } else {// 放行 GET请求
    await next()
  }
}

module.exports = antiReplay;