const WalletModel = require('../model/wallet')
const { idValidate } = require('../validation/wallet')

module.exports = async function(req, res, next) {
    const { walletID, user } = req.body
    try {
        idValidate(walletID)
        const wallet = await WalletModel.findOne({ walletID, userID: user.userID })
        if (!wallet)
            return res.status(403).json({ success: false, message: 'You are not authorized to access this wallet' })
        req.body.wallet = wallet
        next()
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}