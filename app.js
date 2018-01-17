const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');

// 防重放
const antiReplay = require('./middlewares/anti_replay')

// 路由
const router = require('koa-router')();
const notFound = require('./routes/404')
const index = require('./routes/index');

// error handler
onerror(app);

// middlewares
app.use(bodyparser);
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));
app.use(require('koa-static')(__dirname + '/views'));

app.use(views(__dirname + '/views', {
  extension: 'jade'
}));

// 日志
app.use(require('./middlewares/logger'))
// 防重放
app.use(antiReplay)

// routes
router.use('/404', notFound.routes(), notFound.allowedMethods());
router.use('', index.routes(), index.allowedMethods());
app.use(router.routes(), router.allowedMethods());

module.exports = app
