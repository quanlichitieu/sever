
const TradeModel = require('../model/trade')

const createTradeProcessor = function (user, wallet, payload) {
    const { tradeGroup, amount, type, date, walletInclude, tradeDescription } = payload
    const newTrade = new TradeModel({
        walletID: wallet.walletID,
        tradeGroup,
        tradeDescription,
        amount,
        type,
        date,
        walletInclude
    })
    newTrade.tradeID = newTrade._id
    wallet.walletBalance += amount
    user.totalBalance += amount
    return newTrade
}

const updateTradeProcessor = function (user, wallet, trade, payload) {
    const { newTradeGroup, newAmount, newType, newDate, newWalletInclude, newTradeDescription } = payload
    wallet.walletBalance += newAmount - trade.amount
    user.totalBalance += newAmount - trade.amount
    trade.tradeGroup = newTradeGroup
    trade.amount = newAmount
    trade.type = newType
    trade.date = newDate
    trade.walletInclude = newWalletInclude
    trade.tradeDescription = newTradeDescription
}

const deleteTradeProcessor = async function (user, wallet, trade) {
    wallet.walletBalance -= trade.amount
    user.totalBalance -= trade.amount
}

module.exports = { createTradeProcessor, updateTradeProcessor, deleteTradeProcessor }