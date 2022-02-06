var express = require('express')
var router = express.Router()

const authorization = require('../middleware/authorization')
const walletAuthorization = require('../middleware/walletAuthorization')
const trade = require('../controller/trade')

router.post('/addTrade', authorization, walletAuthorization, trade.addTrade)
router.post('/updateTrade', authorization, walletAuthorization, trade.updateTrade)
router.delete('/deleteTrade', authorization, walletAuthorization, trade.deleteTrade)
router.delete('/deleteManyTrade', authorization, walletAuthorization, trade.deleteManyTrade)
router.get('/getTrade', authorization, walletAuthorization, trade.getTrade)
router.get('/getAllTrade', authorization, walletAuthorization, trade.getAllTrade)
router.get('/getTradesByYear', authorization, walletAuthorization, trade.getTradesByYear)

module.exports = router