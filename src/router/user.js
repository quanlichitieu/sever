var express = require('express')
var router = express.Router()

const user = require('../controller/user.js')
const authorization = require('../middleware/authorization')

router.post('/register', user.register)
router.post('/login', user.login)
router.get('/emailVerify/:p', user.emailVerify) // p = userID
router.post('/forgotPassword', user.forgotPassword) 
router.get('/changePasswordManuallyLink/:p', user.changePasswordManuallyLink) // p = userID
router.post('/changePasswordManually/:p', user.changePasswordManually) // p = userID

router.get('/info', authorization, user.info)
router.post('/changeName', authorization, user.changeName)
router.post('/switchCurrencyUnit', authorization, user.switchCurrencyUnit)
router.post('/changePassword', authorization, user.changePassword)
router.delete('/delete', authorization, user.delete)

router.post('/addTradeGroup', authorization, user.addTradeGroup)
router.get('/getAllTradeGroup', authorization, user.getAllTradeGroup)
router.delete('/deleteTradeGroup/', authorization, user.deleteTradeGroup)

// router.post('/deleteUnverifiedUser', user.deleteUnverifiedUser)

module.exports = router