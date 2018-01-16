const fieldConfig = require('../config/fields.array')
// 字段对应的数组
exports.fieldsArray = async(ctx, next) => {
  let field = ctx.params.field,
      response
  if (field == 'all') {
    response = fieldConfig
  } else {
    response = fieldConfig[field] || false
  }
  ctx.body = response
}
