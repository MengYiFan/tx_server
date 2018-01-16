const mysqlHandle = require('../utils/mysql_handle')

// 创建新的用户
exports.createUser = async(ctx, next) => {
  let response = await mysqlHandle.createUser()
  ctx.body = response
}

// 创建就诊人信息
exports.createPatientsInfo = async(ctx, next) => {
  let userId = ctx.params.userId,
      postData = ctx.request.body

  let response = await mysqlHandle.createPatientsInfo(userId, postData)
  ctx.body = response
}

// 设置当前就诊人
exports.setCurrentPatient = async(ctx, next) => {
  let userId = ctx.params.userId,
      openid = ctx.params.openid
  let response = await mysqlHandle.setCurrentPatient(userId, openid)
  ctx.body = response
}

// 获得当前用户的当前就诊人
exports.getPatientsCurrent = async(ctx, next) => {
  let userId = ctx.params.userId

  let response = await mysqlHandle.getPatientsCurrent(userId)
  ctx.body = response
}

// 获得当前用户就诊人列表
exports.getPatientsList = async(ctx, next) => {
  let userId = ctx.params.userId

  let response = await mysqlHandle.getPatientsList(userId)
  ctx.body = response
}