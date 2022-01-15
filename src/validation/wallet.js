const walletNameValidate = function(walletName) {
    if (typeof walletName !== 'string')
        throw new Error('Invalid data')
    if (walletName.length == 0)
        throw new Error('Wallet name is empty')
    if (walletName.length >= 30)
        throw new Error('Wallet name is too long')
}
const walletDescriptionValidate = function (walletDescription) {
    if (typeof walletDescription !== 'string')
        throw new Error('Invalid data')
    if (walletDescription.length >= 2000)
        throw new Error('Wallet description is too long')
}
const moneyValidate = function(money) {
    if (typeof money !== 'number')
        throw new Error('Invalid data')
    if (money > 1000000000)
        throw new Error('Balance is too large')
}
const booleanValidate = function(boolean) {
    if (typeof boolean != 'boolean')
        throw new Error('Must be either true or false')
}
const idValidate = function(id) {
    if (typeof id !== 'string')
        throw new Error('Invalid data')
    if (id.length != 24 || !id.match(/^[0-9a-zA-Z]+$/) || typeof id != 'string')
        throw new Error('ID is not valid')
}

const walletCreationValidate = function(walletName, walletDescription, walletBalance, totalInclude) {
    walletNameValidate(walletName)
    walletDescriptionValidate(walletDescription)
    moneyValidate(walletBalance)
    booleanValidate(totalInclude)
}

const walletUpdateValidate = function(walletName, walletDescription, walletBalance, totalInclude) {
    walletNameValidate(walletName)
    walletDescriptionValidate(walletDescription)
    moneyValidate(walletBalance)
    booleanValidate(totalInclude)
}

module.exports = { 
    idValidate,
    walletCreationValidate,
    walletUpdateValidate,
}
