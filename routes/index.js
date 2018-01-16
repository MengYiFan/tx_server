const router = require('koa-router')(),
      user = require('./user'),
      patient = require('./patient'),
      common = require('./common')

router.get('/', async(ctx, next) => {
  ctx.state = {
    title: 'HELLO WORLD',
    author: 'MISH'
  };

  await ctx.render('index', {
  });
})

router.use('/user', user.routes(), user.allowedMethods())
router.use('/patient', patient.routes(), patient.allowedMethods())
router.use('/common', common.routes(), common.allowedMethods())

module.exports = router