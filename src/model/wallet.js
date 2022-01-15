const mongoose = require('mongoose')
const { Schema } = mongoose

const WalletSchema = new Schema({
    walletID: { type: String, required: true, unique: true },
    walletName: { type: String, required: true },
    walletDescription: { type: String },
    walletBalance: { type: Number, required: true },
    userID: { type: String, required: true },
    totalInclude: { type: Boolean, required: true },
}, {
    timestamps: true
})

module.exports = mongoose.model('wallet', WalletSchema)