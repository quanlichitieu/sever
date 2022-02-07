const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    userID: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true},
    email: { type: String, required: true},
    emailActive: { type: Boolean, default: false, required: true},
    hashPassword: { type: String, required: true},
    totalBalance: { type: Number, default: 0, required: true},
    currencyUnit: { type: String, default: 'USD', required: true, enum: ['USD', 'VND', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'KRW']},
}, {
    timestamps: true
})

module.exports = mongoose.model('user', userSchema)