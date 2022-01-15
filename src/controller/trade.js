const UserModel = require('../model/user')
const WalletModel = require('../model/wallet')
const TradeModel = require('../model/trade')
const TradeTypeModel = require('../model/tradeType')
const { fiveDecimalRounding } = require('../action/dataProcessor')
const { addTradeValidate, updateTradeValidate, deleteTradeValidate, getTradeValidate } = require('../validation/trade')

const { createTradeProcessor, updateTradeProcessor, deleteTradeProcessor } = require('../action/tradeProcessor')
class trade {
    //POST api/trade/addTrade
    async addTrade(req ,res) {
        const { tradeGroup, type, date, walletInclude, user, wallet } = req.body
        var { amount } = req.body
        try {
            addTradeValidate(tradeGroup, amount, type, date, walletInclude)
            amount = fiveDecimalRounding(amount)
            //create a new group if it does not exist
            const tradeType = await TradeTypeModel.findOne({ userID: user.userID })
            if (!(tradeType.spendGroup.includes(tradeGroup)) && (type == 'spend')) {
                tradeType.spendGroup.push(tradeGroup)
                await tradeType.save()
            }
            if (!(tradeType.incomeGroup.includes(tradeGroup)) && (type == 'income')) {
                tradeType.incomeGroup.push(tradeGroup)
                await tradeType.save()
            }
            //create new trade
            const newTrade = createTradeProcessor(user, wallet, { tradeGroup, amount, type, date, walletInclude })
            await newTrade.save()
            await wallet.save()
            await user.save()
            res.status(200).json({ success: true, message: 'New trade created', newTrade })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //POST api/trade/updateTrade
    async updateTrade(req, res) {
        const { tradeID, newTradeGroup, newType, newDate, newWalletInclude, user, wallet } = req.body
        var { newAmount } = req.body
        try {
            updateTradeValidate(newTradeGroup, newAmount, newType, newDate, newWalletInclude, tradeID)
            newAmount = fiveDecimalRounding(newAmount)
            //create a new group if it does not exist
            const tradeType = await TradeTypeModel.findOne({ userID: user.userID })
            if (!(tradeType.spendGroup.includes(newTradeGroup)) && (newType == 'spend')) {
                tradeType.spendGroup.push(newTradeGroup)
                await tradeType.save()
            }
            if (!(tradeType.incomeGroup.includes(newTradeGroup)) && (newType == 'income')) {
                tradeType.incomeGroup.push(newTradeGroup)
                await tradeType.save()
            }
            //update trade
            const trade = await TradeModel.findOne({ tradeID })
            updateTradeProcessor(user, wallet, trade, { newTradeGroup, newAmount, newType, newDate, newWalletInclude })
            await trade.save()
            await wallet.save()
            await user.save()
            res.status(200).json({ success: true, message: 'Trade updated', trade })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //DELETE api/trade/deleteTrade
    async deleteTrade(req, res) {
        const { tradeID, user, wallet } = req.body
        try {
            const trade = deleteTradeValidate(tradeID)
            deleteTradeProcessor(user, wallet, trade)
            await trade.remove()
            await wallet.save()
            await user.save()
            res.status(200).json({ success: true, message: 'Trade deleted' })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //DELETE api/trade/deleteManyTrade
    async deleteManyTrade(req, res) {
        const { tradeIDList, user, wallet } = req.body
        try {
            for (const tradeID of tradeIDList) {
                let trade = await deleteTradeValidate(tradeID)
                deleteTradeProcessor(user, wallet, trade)
                console.log(trade)
                await trade.remove()
            }
            await wallet.save()
            await user.save()
            console.log(wallet, user)
            res.status(200).json({ success: true, message: 'Trade deleted' })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //GET api/trade/getTrade
    async getTrade(req, res) {
        const { tradeID, user } = req.body
        try {
            const trade = await getTradeValidate(tradeID)
            res.status(200).json({ success: true, message: 'Trade found', trade })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //GET api/trade/getAllTrade
    async getAllTrade(req, res) {
        const { user, wallet } = req.body
        try {
            const tradeList = await TradeModel.find({ walletID: wallet.walletID })
            res.status(200).json({ success: true, message: 'Trade found', tradeList })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }


}

module.exports = new trade