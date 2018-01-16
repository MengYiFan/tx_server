const router = require('koa-router')()
const user = require('../controllers/user')

// 创建新的用户
router.post('/create', user.createUser)
// 创建/添加就诊人信息
router.post('/:userId/create/patients/info', user.createPatientsInfo)
// 设置当前就诊人
router.post('/:userId/current/patients/:openid', user.setCurrentPatient)
// 获得当前用户的当前就诊人
router.get('/:userId/patients/current', user.getPatientsCurrent)
// 获得当前用户就诊人列表
router.get('/:userId/patients/list', user.getPatientsList)

module.exports = router