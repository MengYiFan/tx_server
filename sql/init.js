// 数据库初始化
// grant all privileges on tx.* to 'mish'@'%' identified by '11';
// flush privileges;
// CREATE DATABASE IF NOT EXISTS tx DEFAULT CHARSET utf8;
// 
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
      })

// MYSQL 版本问题 
// knex的charset会报错
const charset = ' ENGINE=MyISAM DEFAULT CHARSET=utf8;'

const usersTable = knex.schema.withSchema('tx').createTableIfNotExists('users', (table) => {
  table.increments().primary()
  table.string('user_id')// 用户id
  table.string('current_patient_openid')// 当前就诊人, 为患者patient_openid
  table.bigInteger('created_at')
  table.bigInteger('updated_at')
  // table.charset('utf-8')
}).toString()

const healthRecordsTable = knex.schema.withSchema('tx').createTableIfNotExists('health-records', (table) => {
  table.increments().primary()
  table.string('patient_openid')// 患者patient_openid
  table.integer('height')// 身高
  table.integer('weight')// 体重
  table.integer('blood_type')// 血型
  table.integer('smoking_situation')// 抽烟情况
  table.integer('drinking_situation')// 喝酒情况
  table.bigInteger('created_at')
  table.bigInteger('updated_at')
  // table.charset('utf-8')
}).toString()

const patientsListTable = knex.schema.withSchema('tx').createTableIfNotExists('patients', (table) => {
  table.increments().primary()
  table.string('user_id')// index, 归属于哪个用户id
  table.string('patient_name')// 姓名
  table.string('medical_card')// 就诊卡号
  table.string('identity_card')// 身份证号
  table.string('mobile_number')// 手机号
  table.integer('fee_type')// 费别[0: 医保, 1: 自费]
  table.string('emergency_contact_name')// 紧急联系人
  table.string('emergency_contact_phone')// 紧急联系人手机号
  table.string('emergency_contact_relation')// 与紧急联系人关系
  table.integer('is_unbundling')// 是否解绑[0: 否, 1: 是]
  table.string('patient_openid')// 就诊人OPENID, 唯一性
  table.bigInteger('created_at')
  table.bigInteger('updated_at')
  // table.charset('utf-8')
}).toString()

// console.log(usersTable)
mysql.query(usersTable + charset)
mysql.query(healthRecordsTable + charset)
mysql.query(patientsListTable + charset)
