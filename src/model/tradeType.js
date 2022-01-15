const mongoose = require('mongoose')
const { Schema } = mongoose

const spendTypeDefault = [
    'eating & food',
    'rent',
    'water',
    'gas',
    'internet',
    'telephone',
    'TV',
    'transportation',
    'shopping',
    'friend & partner',
    'entertainment',
    'travel',
    'health',
    'charity & donations',
    'gift',
    'family',
    'education',
    'investment',
    'business',
    'insurance',
    'withdraw money',
    'others',
    'update balance'
]

const incomeTypeDefault = [
    'salary',
    'bonus',
    'award',
    'be donated',
    'sell stuff',
    'others',
    'update balance'
]

const tradeTypeSchema = new Schema({
    userID: { type: String, required: true },
    spendGroup: { type: [String], required: true, default: spendTypeDefault },
    incomeGroup: { type: [String], required: true, default: incomeTypeDefault },
})

module.exports = mongoose.model('tradeType', tradeTypeSchema)