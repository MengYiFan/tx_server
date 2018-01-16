var router = require('koa-router')();

router.get('/', async(ctx, next) => {
  ctx.body = {
    ret: false,
    errCode: 404,
    errMsg: 'NOT FOUND'
  }
})

module.exports = router;

