const WalletModel = require('../model/wallet')
const TradeModel = require('../model/trade')
const { walletCreationValidate, walletUpdateValidate } = require('../validation/wallet')
const { fiveDecimalRounding, getCurrentDate } = require('../action/dataProcessor')
const { createTradeProcessor } = require('../action/tradeProcessor')

class Wallet {

    // POST api/wallet/createNewWallet
    async createNewWallet(req, res) {
        const { walletName, walletDescription, totalInclude, user } = req.body
        var { walletBalance } = req.body
        try {
            walletCreationValidate(walletName, walletDescription, walletBalance, totalInclude)
            walletBalance = fiveDecimalRounding(walletBalance)
            const wallet = new WalletModel({
                walletName,
                walletDescription,
                walletBalance: 0,
                userID: user.userID,
                totalInclude,
            })
            wallet.walletID = wallet._id
            const newTrade = createTradeProcessor(user, wallet, {
                tradeGroup: 'update balance', 
                amount: walletBalance,
                type: walletBalance > 0 ? 'income' : 'spend',
                date: getCurrentDate(), 
                walletInclude: true
            })
            await newTrade.save()
            await wallet.save()
            await user.save()
            res.status(200).json({ success: true, message: 'New wallet created', wallet })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //POST api/wallet/getWallet
    async getWallet(req, res) {
        const { wallet } = req.body
        try {
            res.status(200).json({ success: true, wallet })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //GET api/wallet/getWalletByUser
    async getWalletByUser(req, res) {
        const { user } = req.body
        try {
            const wallet = await WalletModel.find({ userID: user.userID })
            res.status(200).json({ success: true, wallet })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //POST api/wallet/updateWallet
    async updateWallet(req, res) {
        const { newWalletName, newWalletDescription, newTotalInclude, user, wallet } = req.body
        var { newWalletBalance } = req.body
        try {
            walletUpdateValidate(newWalletName, newWalletDescription, newWalletBalance, newTotalInclude)
            newWalletBalance = fiveDecimalRounding(newWalletBalance)
            wallet.walletName = newWalletName
            wallet.walletDescription = newWalletDescription
            wallet.totalInclude = newTotalInclude
            const newTrade = createTradeProcessor(user, wallet, { 
                tradeGroup: 'update balance', 
                amount: newWalletBalance - wallet.walletBalance,
                type: newWalletBalance > wallet.walletBalance ? 'income' : 'spend',
                date: getCurrentDate(), 
                walletInclude: true
            })
            await newTrade.save()
            await wallet.save()
            await user.save()
            res.status(200).json({ success: true, message: 'Wallet updated', wallet })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //DELETE api/wallet/deleteWallet
    async deleteWallet(req, res) {
        const { wallet, user } = req.body
        try {
            user.totalBalance -= wallet.walletBalance
            await TradeModel.deleteMany({ walletID: wallet.walletID })
            await wallet.remove()
            await user.save()
            res.status(200).json({ success: true, message: 'Wallet deleted' })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }



}

module.exports = new Wallet