const router = require('koa-router')()
const common = require('../controllers/common.js')

// 返回字段对应的数组
router.get('/field/array/:field', common.fieldsArray)

module.exports = router