const mysqlHandle = require('../utils/mysql_handle')

// 更新紧急联系人
exports.alterEmergencyContactName = async(ctx, next) => {
  let openid = ctx.params.openid,
      postData = ctx.request.body
  let response = await mysqlHandle.alterEmergencyContact(openid, postData, 'name')
  ctx.body = response
}

// 更新紧急联系人电话
exports.alterEmergencyContactPhone = async(ctx, next) => {
  let openid = ctx.params.openid,
      postData = ctx.request.body
  let response = await mysqlHandle.alterEmergencyContact(openid, postData, 'phone')
  ctx.body = response
}

// 更新紧急联系人关系
exports.alterEmergencyContactRelation = async(ctx, next) => {
  let openid = ctx.params.openid,
      postData = ctx.request.body
  let response = await mysqlHandle.alterEmergencyContact(openid, postData, 'relation')
  ctx.body = response
}

// 解绑就诊人
exports.unbundling = async(ctx, next) => {
  let openid = ctx.params.openid

  let response = await mysqlHandle.unbundling(openid)
  ctx.body = response
}

// 获得就诊人信息
exports.getPatientInfo = async(ctx, next) => {
  let openid = ctx.params.openid

  let response = await mysqlHandle.getPatientInfo(openid)
  ctx.body = response
}

// 获得就诊人健康记录
exports.getPatientRecord = async(ctx, next) => {
  let openid = ctx.params.openid

  let response = await mysqlHandle.getPatientRecord(openid)
  ctx.body = response
}

// 修改就诊人健康记录
exports.alterPatientRecord = async(ctx, next) => {
  let openid = ctx.params.openid,
      postData = ctx.request.body

  let response = await mysqlHandle.alterPatientRecord(openid, postData)
  ctx.body = response
}

// 健康档案的身高
exports.alterPatientRecordDetail = async(ctx, next) => {
  let openid = ctx.params.openid,
      postData = ctx.request.body,
      type = ctx.params.type

  let response = await mysqlHandle.alterPatientRecordDetail(openid, postData, type)
  ctx.body = response
}

// 获得就诊人的电话号码
exports.getPatientsPhone = async(ctx, next) => {
  let openid = ctx.params.openid

  let response = await mysqlHandle.getPatientsPhone(openid)
  ctx.body = response
}