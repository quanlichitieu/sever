var express = require('express')
var router = express.Router()

const authorization = require('../middleware/authorization')
const walletAuthorization = require('../middleware/walletAuthorization')
const wallet = require('../controller/wallet')

router.post('/createNewWallet', authorization, wallet.createNewWallet)
router.post('/getWallet', authorization, walletAuthorization, wallet.getWallet)
router.get('/getWalletByUser', authorization, wallet.getWalletByUser)
router.post('/updateWallet', authorization, walletAuthorization, wallet.updateWallet)
router.delete('/deleteWallet', authorization, walletAuthorization, wallet.deleteWallet)

module.exports = router