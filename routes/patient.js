const router = require('koa-router')()
const patient = require('../controllers/patient')

// 获得就诊人信息
router.get('/:openid/info', patient.getPatientInfo)
// 获得就诊人健康记录
router.get('/:openid/health/record', patient.getPatientRecord)
// 获得就诊人的电话号码
router.post('/:openid/phone/number', patient.getPatientsPhone)
// 修改就诊人健康记录
router.post('/:openid/health/record', patient.alterPatientRecord)
router.post('/:openid/health/record/:type', patient.alterPatientRecordDetail)
// 更新紧急联系人
router.post('/:openid/emergency/contact/name', patient.alterEmergencyContactName)
router.post('/:openid/emergency/contact/relation', patient.alterEmergencyContactRelation)
router.post('/:openid/emergency/contact/phone', patient.alterEmergencyContactPhone)
// 解绑就诊人
router.post('/:openid/unbundling', patient.unbundling)

module.exports = router