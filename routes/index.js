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

router.get('/patient', async(ctx, next) => {
  await ctx.render('index.html')
})

router.use('/api/user', user.routes(), user.allowedMethods())
router.use('/api/patient', patient.routes(), patient.allowedMethods())
router.use('/api/common', common.routes(), common.allowedMethods())

module.exports = router