const mongoose = require('mongoose')
const { Schema } = mongoose

const tradeSchema = new Schema({
    tradeID: { type: String, required: true },
    walletID: { type: String, required: true },
    tradeGroup: { type: String, required: true },
    tradeDescription: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true, enum: ['spend', 'income'] },
    date: { type: String, required: true },
    walletInclude: { type: Boolean, require: true }
})

module.exports = mongoose.model('trade', tradeSchema)