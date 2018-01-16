const logUtil = require('../utils/logger')
const logger = async(ctx, next) => {
    const start = new Date()
    var ms, status
    try {
      await next()
      ms = new Date() - start
      logUtil.logResponse(ctx, ms)
     status = ctx.status

   } catch (error) {
    ms = new Date() - start
    logUtil.logError(ctx, error, ms)
  }
  if (status == 403 || status == 404) {
    ctx.redirect('/404')
  }
}

module.exports = logger