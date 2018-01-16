/**
 * 数据库操作函数
 * 返回各类API类型的接口数据给 controller
 */
const config = require('../config'),
      mysqlConfig = config.mysql,
      mysql = require('../utils/mysql'),
      knex = require('knex')({
        client: 'mysql',
        connect: {
          host: mysqlConfig.host,
          user : mysqlConfig.user,
          password : mysqlConfig.password,
          database : mysqlConfig.database
        },
        debug: true,
        pool: {
          min: 0,
          max: 7,
        },
        acquireConnectionTimeout: 10000
      }),
      common = require('./common'),
      redis = require('./redis'),
      moment = require('moment')
const fieldConfig = require('../config/fields.array')

/**
 * 创建新用户
 * @return {[type]} [API 数据]
 */
const createUser = async() => {
  let sql, user_id, 
      current_patient_openid = '0',
      response,
      created_at = updated_at = +new Date()

  user_id = common.createOpenid()
  
  sql = knex('users')
          .insert({
            user_id, current_patient_openid, created_at, updated_at
          })
          .toString()

  response = await mysql.query(sql)

  if (response.ret) {
    response.data = {
      userId: user_id
    }
  }
  console.log(response)
  return response
}

/**
 * 创建就诊人的健康记录
 * @param  {[type]} openid [description]
 * @return {[type]}        [description]
 */
const createPatientRecord = async(openid) => {
  let sql, created_at = updated_at = +new Date()
  sql = knex('health-records')
          .insert({
            patient_openid: openid,
            created_at, updated_at
          })
          .toString()
  let response = await mysql.query(sql)
  return response
}

/**
 * 设置当前就诊人
 * @param  {[type]} userId [用户id]
 * @param  {[type]} openid [就诊人openid]
 * @return {[type]}        [接口数据]
 */
const setCurrentPatient = async(userId, openid) => {
  let sql
console.log(userId, openid, '@@@')
  sql = knex('users')
        .where({
          user_id: userId
        })
        .update({
          current_patient_openid: openid
        })
        .toString()
  let response = await mysql.query(sql)
  return response
}

/**
 * 创建就诊人信息
 * @param  {[type]} userId [用户id]
 * @return {[type]}        [返回API信息]
 */
const createPatientsInfo = async(userId, data) => {
  let postData = common.data2_(data),// 换为后台数据格式
      type = postData.type.toUpperCase() || ''

  postData.user_id = userId

  let paramsArr = [
        { key: 'user_id', type: 'string', name: 'index, 归属于哪个用户id' },
        { key: 'patient_name', type: 'string', name: '姓名' },
        { key: 'medical_card', type: 'string', name: '就诊卡号' },
        { key: 'identity_card', type: 'string', name: '身份证号' },
        { key: 'mobile_number', type: 'string', name: '手机号' },
        { key: 'fee_type', type: 'number', name: '费别' }
      ],
      is_unbundling = 0

  let legalRes = common.paramsIsLegal(postData, paramsArr)// 判断数值是否合法
  if (legalRes.ret) {
    let sql, created_at = updated_at = +new Date(),
        patient_openid = common.createOpenid(),
        insertData = Object.assign(legalRes.json, {
          updated_at, created_at, is_unbundling, patient_openid
        })

    sql = knex('patients')
          .insert(insertData)
          .toString()

    let response = await mysql.query(sql)
    if (response.ret) {
      response.data = insertData
      let halfYear = 60 * 60 * 24 * 183
      redis.set(`unbundlingFlag: ${patient_openid}`, created_at, halfYear)
      // 同时创建该就诊人的健康档案数据
      let patientRecordResponse = await createPatientRecord(patient_openid)
      // 首此添加就诊人，需要更新 user表的目前就诊人字段
      if (type == 'NEW') {
        let currentPatientResponse = await setCurrentPatient(userId, patient_openid)
        if (!currentPatientResponse.ret) {
          return currentPatientResponse
        }
      }

      if (patientRecordResponse.ret) {
        return response
      } else {
        return patientRecordResponse
      }
    }

    return response
  } else {
    return legalRes
  }
}

/**
 * 更新就诊人的紧急联系人信息
 * @param  {[type]} userId [用户id]
 * @param  {[type]} data   [更新的数据]
 * @param  {[type]} type   [更新的数据字段类型]
 * @return {[type]}        [返回API类数据]
 */
const alterEmergencyContact = async(openid, data, type) => {
  let postData = common.data2_(data),// 换为后台数据格式
      patient_openid = openid,
      paramsArr = [
        { key: 'patient_openid', type: 'string', name: '用户openid' },
      ],
      updateData = {}
  postData.patient_openid = patient_openid
console.log(data)
  if (type == 'name') {
    updateData.emergency_contact_name = postData.emergency_contact_name || ''
    paramsArr.push({ key: 'emergency_contact_name', type: 'string', name: '紧急联系人' })
  }
  if (type == 'phone') {
    updateData.emergency_contact_phone = postData.emergency_contact_phone || ''
    paramsArr.push({ key: 'emergency_contact_phone', type: 'string', name: '紧急联系人电话' })
  }
  if (type == 'relation') {
    updateData.emergency_contact_relation = postData.emergency_contact_relation || ''
    paramsArr.push({ key: 'emergency_contact_relation', type: 'string', name: '紧急联系人关系' })
  }

  let legalRes = common.paramsIsLegal(postData, paramsArr)// 判断数值是否合法
  if (legalRes.ret) {
    let sql
    updateData.updated_at = +new Date()

    sql = knex('patients')
          .where({
            patient_openid,
            is_unbundling: 0
          })
          .update(legalRes.json)
          .toString()

    let response = await mysql.query(sql)
    return response
  } else {
    return legalRes
  }
}

/**
 * 解除openid就诊人, 只是字段变为1, 不做真实删除
 * @param  {[type]} openid [就诊人openid]
 * @return {[type]}        [返回接口数据]
 */
const unbundling = async(openid) => {
  let patient_openid = openid,
      response = await redis.get(`unbundlingFlag: ${patient_openid}`)

  if (response.ret) {// 还没过期，不能解绑
    let overtime = moment(parseInt(response.data)).add(6, 'months').format('YYYY-MM-DD')

    return {
      ret: false,
      errCode: 12,
      errMsg: `${overtime}后才能解绑`
    }
  } else {
    let sql

    sql = knex('patients')
          .where({
            patient_openid
          })
          .update({
            is_unbundling: 1
          })
          .toString()
    let response = await mysql.query(sql)
    return response
  }
}

/**
 * 获得用户的就诊人的当前就诊人
 * @param  {[type]} userId [用户ID]
 * @return {[type]}        [返回接口数据]
 */
const getPatientsCurrent = async(userId) => {
  let sql
  
  sql = knex
        .select('patients.patient_openid', 'patients.patient_name', 'patients.fee_type', 'patients.medical_card')
        .from('patients')
        .leftJoin('users', function () {
          this.on('users.user_id', '=', 'patients.user_id')
              .on('users.current_patient_openid', '=', 'patients.patient_openid')
        })
        .where({
          'patients.user_id': userId,
          is_unbundling: 0
        })
        .orderBy('users.current_patient_openid', 'desc')// 当前的摆在最前面
        .orderBy('patients.updated_at', 'desc')// 其次才是根据更新时间做排序
        .toString()

  let response = await mysql.query(sql)
  if (response.ret && response.data.length > 0) {
    let row = response.data.rows[0]
    row.fee_type_text = fieldConfig['fee'][row.fee_type]
    response.data = common.data2hump(row)
  }

  return response
}

/**
 * 获得用户的就诊人列表
 * @param  {[type]} userId [用户ID]
 * @return {[type]}        [返回接口数据]
 */
const getPatientsList = async(userId) => {
  let sql
  
  sql = knex
        .select('patients.patient_openid', 'patients.patient_name', 'patients.fee_type', 'patients.medical_card', 'users.current_patient_openid')
        .from('patients')
        .leftJoin('users', function () {
          this.on('users.user_id', '=', 'patients.user_id')
              .on('users.current_patient_openid', '=', 'patients.patient_openid')
        })
        .where({
          'patients.user_id': userId,
          is_unbundling: 0
        })
        .orderBy('users.current_patient_openid', 'desc')// 当前的摆在最前面
        .orderBy('patients.updated_at', 'desc')// 其次才是根据更新时间做排序
        .toString()

  let response = await mysql.query(sql)
  if (response.ret && response.data.length > 0) {
    let rows = response.data.rows
    for (var [k, v] of rows.entries()) {
      v.fee_type_text = fieldConfig['fee'][v.fee_type || 0]
      rows[k] = common.data2hump(v)
    }
    response.data = {
      length: rows.length,// 当前用户的就诊人总数
      rows: rows// 具体的就诊人数据
    }
  }

  return response
}

/**
 * 获得就诊人信息
 * @param  {[type]} openid [就诊人openid]
 * @return {[type]}        [API型数据]
 */
const getPatientInfo = async(openid) => {
  let redisResponse = await redis.get(`unbundlingFlag: ${openid}`),//查看是否可以解绑
      canUnbundling = false, overtime = ''
  if (redisResponse.ret) {
    overtime = moment(parseInt(redisResponse.data)).add(6, 'months').format('YYYY-MM-DD')
  } else {// 可以解绑
    canUnbundling = true
  }

  let sql

  sql = knex('patients')
        .select('*')
        .where({
          patient_openid: openid,
          is_unbundling: 0
        })
        .toString()

  let response = await mysql.query(sql)
  if (response.ret) {
    let row = Object.assign(response.data.rows[0], {
      canUnbundling, overtime
    })

    try {
      delete row.created_at
      delete row.updated_at
    } catch(e) { console.log(e) }
    
    try {
      // 数据加工
      row.emergency_contact_relation_text = fieldConfig['relation'][row.emergency_contact_relation]
      row.fee_type_text = fieldConfig['fee'][row.fee_type]
      row.patient_name = row.patient_name.slice(0, -1) + '*'
      row.mobile_number = row.mobile_number.replace(/^(\d{3})\d*(\d{2})/gi, '$1******$2')
      row.identity_card = row.identity_card.replace(/^(\d{1})\d*(\d{1})/gi, '$1****************$2')
      row.emergency_contact_phone = row.emergency_contact_phone.replace(/^(\d{3})\d*(\d{2})/gi, '$1******$2')
    } catch(e) { console.log(e) }
 
    response.data = common.data2hump(row)
  }
  return response
}

/**
 * 获得就诊人的健康记录
 * @param  {[type]} openid [description]
 * @return {[type]}        [description]
 */
const getPatientRecord = async(openid) => {
  let sql

  sql = knex('health-records')
        .select('*')
        .where({
          patient_openid: openid
        })
        .toString()

  let response = await mysql.query(sql)
  if (response.ret) {
    let row = response.data.rows[0]
    row.blood_type_text = fieldConfig['blood'][row.blood_type]
    row.smoking_situation_text = fieldConfig['smoking'][row.smoking_situation]
    row.drinking_situation_text = fieldConfig['drinking'][row.drinking_situation]

    response.data = common.data2hump(row)
  }

  return response
}

/**
 * 修改就诊人的健康记录
 * @param  {[type]} openid [description]
 * @return {[type]}        [description]
 */
const alterPatientRecord = async(openid, data) => {
  let paramsArr = [
    { key: 'height', type: 'number', name: '身高' },
    { key: 'weight', type: 'number', name: '体重' },
    { key: 'blood_type', type: 'string', name: '血型' },
    { key: 'smoking_situation', type: 'string', name: '抽烟情况' },
    { key: 'drinking_situation', type: 'string', name: '饮酒情况' }
  ]

  let legalRes = common.paramsIsLegal(data, paramsArr)// 判断数值是否合法
  if (legalRes.ret) {
    let sql,
      updateData = Object.assign(legalRes.json, {
        updated_at: +new Date()
      })
    sql = knex('health-records')
            .where({
              patient_openid: openid
            })
            .update(updateData)
            .toString()
    console.log(sql)
    let response = await mysql.query(sql)

    return response
  } else {
    return legalRes
  }
}

/**
 * 修改就诊人健康档案的信息
 * @param  {[type]} openid [openid]
 * @param  {[type]} data   [修改的数据]
 * @param  {[type]} type   [哪个字段]
 * @return {[type]}        [API型数据]
 */
const alterPatientRecordDetail = async(openid, data, type) => {
  var paramsArr,
      data = common.data2_(data)
  switch(type) {
    case 'height': {
      paramsArr = [
        { key: 'height', type: 'number', name: '身高' }
      ]
      break
    }
    case 'weight': {
      paramsArr = [
        { key: 'weight', type: 'number', name: '体重' }
      ]
      break
    }
    case 'blood': {
      paramsArr = [
        { key: 'blood_type', type: 'number', name: '血型' }
      ]
      break
    }
    case 'smoking': {
      paramsArr = [
        { key: 'smoking_situation', type: 'number', name: '吸烟情况' }
      ]
      break
    }
    case 'drinking': {
      paramsArr = [
        { key: 'drinking_situation', type: 'number', name: '喝酒情况' }
      ]
      break
    }
    default: {
      return {
        ret: false,
        errMsg: '没有关键字段'
      }
    }
  }

  let legalRes = common.paramsIsLegal(data, paramsArr)// 判断数值是否合法
  if (legalRes.ret) {
    let sql,
      updateData = Object.assign(legalRes.json, {
        updated_at: +new Date()
      })
    sql = knex('health-records')
            .where({
              patient_openid: openid
            })
            .update(updateData)
            .toString()
    console.log(sql)
    let response = await mysql.query(sql)

    return response
  } else {
    return legalRes
  }
}

/**
 * 获得患者的手机号码
 * @param  {[type]} openid [description]
 * @return {[type]}        [description]
 */
const getPatientsPhone = async(openid) => {
  let sql

  sql = knex('patients')
        .select('mobile_number', 'patient_openid')
        .where({
          patient_openid: openid,
          is_unbundling: 0
        })
        .toString()

  let response = await mysql.query(sql)
  if (response.ret) {
    let row = response.data.rows[0]

    response.data = common.data2hump(row)
  }
console.log(response)
  return response
}

module.exports = {
  createUser, createPatientsInfo, alterEmergencyContact, unbundling, 
  getPatientsList, getPatientsCurrent, setCurrentPatient, getPatientInfo, 
  getPatientRecord, alterPatientRecord, alterPatientRecordDetail, getPatientsPhone
}