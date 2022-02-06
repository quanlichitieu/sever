const TradeTypeModel = require('../model/tradeType')
const TradeModel = require('../model/trade')

const nameValidate = function (name) {
    if (typeof name !== 'string')
        throw new Error('Invalid data')
    if (name.length == 0)
        throw new Error('Name is empty')
    if (name.length >= 30)
        throw new Error('Name is too long')
}
const moneyValidate = function (money) {
    if (typeof money !== 'number')
        throw new Error('Invalid data')
    if (money > 1000000000)
        throw new Error('Money is too large')
}
const dateValidate = function (date) {
    //validate date dd-mm-yyyy
    if (typeof date !== 'string')
        throw new Error('Invalid data')
    if (date.length != 10)
        throw new Error('Invalid data')
    if (!date.match(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/))
        throw new Error('Invalid data')
}
const yearValidate = function (year) {
    if (typeof year !== 'number')
        throw new Error('Invalid data')
    if (!year.toString().match(/^(19|20)\d{2}$/))
        throw new Error('Invalid year')
}
const booleanValidate = function (boolean) {
    if (typeof boolean != 'boolean')
        throw new Error('Must be either true or false')
}
const tradeDescriptionValidate = function (description) {
    if (typeof description !== 'string')
        throw new Error('Invalid data')
    if (description.length >= 2000)
        throw new Error('description is too long')
}

const idValidate = function (id) {
    if (typeof id !== 'string')
        throw new Error('Invalid data')
    if (id.length != 24 || !id.match(/^[0-9a-zA-Z]+$/) || typeof id != 'string')
        throw new Error('ID is not valid')
}
const typeValidate = function (type, amount) {
    if (!(type == 'spend' || type == 'income'))
        throw new Error('Type must be either spend or income')
    if ((type == 'spend') && (amount > 0))
        throw new Error('Spend trade must have negative amount')
    if ((type == 'income') && (amount < 0))
        throw new Error('Income trade must have positive amount')
}

const addTradeGroupValidate = async function (user, group, type) {
    try {
        nameValidate(group)
        nameValidate(type)
        if (!(type == 'spend' || type == 'income'))
            throw new Error('Type must be either spend or income')
        const tradeType = await TradeTypeModel.findOne({ userID: user.userID })
        if ((type == 'spend') && (tradeType.spendGroup.includes(group)))
            throw new Error('Group already exists')
        if ((type == 'income') && (tradeType.incomeGroup.includes(group)))
            throw new Error('Group already exists')
        return tradeType
    } catch (error) {
        throw new Error(error.message)
    }
}

const deleteTradeGroupValidate = async function (user, group, type) {
    try {
        nameValidate(group)
        nameValidate(type)
        if (!(type == 'spend' || type == 'income'))
            throw new Error('Type must be either spend or income')
        if (group == 'update balance')
            throw new Error('You can not delete this group')
        const tradeType = await TradeTypeModel.findOne({ userID: user.userID })
        if ((type == 'spend') && (!(tradeType.spendGroup.includes(group))))
            throw new Error('Group does not exist')
        if ((type == 'income') && (!(tradeType.incomeGroup.includes(group))))
            throw new Error('Group does not exist')
        return tradeType
    } catch (error) {
        throw new Error(error.message)
    }
}

const addTradeValidate = function (tradeGroup, amount, type, date, walletInclude, tradeDescription) {
    try {
        nameValidate(tradeGroup)
        moneyValidate(amount)
        nameValidate(type)
        dateValidate(date)
        booleanValidate(walletInclude)
        typeValidate(type, amount)
        tradeDescriptionValidate(tradeDescription)
    } catch (error) {
        throw new Error(error.message)
    }
}

const updateTradeValidate = async function (tradeGroup, amount, type, date, walletInclude, id, tradeDescription) {
    try {
        nameValidate(tradeGroup)
        moneyValidate(amount)
        nameValidate(type)
        dateValidate(date)
        booleanValidate(walletInclude)
        idValidate(id)
        typeValidate(type, amount)
        tradeDescriptionValidate(tradeDescription)
        const trade = await TradeModel.findOne({ tradeID: id })
        if (!trade)
            throw new Error('Trade does not exist')
    } catch (error) {
        throw new Error(error.message)
    }
}

const deleteTradeValidate = async function (tradeID) {
    try {
        idValidate(tradeID)
        const trade = await TradeModel.findOne({ tradeID: tradeID })
        if (!trade)
            throw new Error('Trade does not exist')
        return trade
    } catch (error) {
        throw new Error(error.message)
    }
}

const getTradeValidate = async function (tradeID) {
    try {
        idValidate(tradeID)
        const trade = await TradeModel.findOne({ tradeID: tradeID })
        if (!trade)
            throw new Error('Trade does not exist')
        return trade
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = {
    yearValidate,
    addTradeGroupValidate,
    deleteTradeGroupValidate,
    addTradeValidate,
    updateTradeValidate,
    deleteTradeValidate,
    getTradeValidate
}