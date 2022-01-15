const UserModel = require('../model/user.js')

const nameValidate = function (userName) {
    if (typeof userName !== 'string')
        throw new Error('Invalid data')
    if (userName.length >= 30)
        throw new Error('name too long')
    if (userName.length == 0)
        throw new Error('name is empty')
}
const emailValidate = function (email) {
    if (typeof email !== 'string')
        throw new Error('Invalid data')
    if (email.length >= 100)
        throw new Error('email too long')
    if (email.length == 0)
        throw new Error('email is empty')
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!emailRegex.test(email))
        throw new Error('email is invalid')
}
const passwordValidate = function (hashPassword) {
    if (typeof hashPassword !== 'string')
        throw new Error('Invalid data')
    if (hashPassword.length != 64)
        throw new Error('Password is not valid')
}

const currencyUnitValidate = function (currencyUnit) {
    if (typeof currencyUnit !== 'string')
        throw new Error('Invalid data')
    const unitsAvailable = [
        'USD',
        'EUR',
        'GBP',
        'JPY',
        'CNY',
        'AUD',
        'VND',
        'KRW',
    ]
    if (!unitsAvailable.includes(currencyUnit))
        throw new Error('Invalid data')
}

const registerValidate = async function (userName, email, hashPassword) {
    try {
        nameValidate(userName)
        var user = await UserModel.findOne({ userName })
        if (user)
            throw new Error('Name already exists')

        emailValidate(email)
        user = await UserModel.findOne({ email })
        if (user) {
            throw new Error('Email already exists')
        }

        passwordValidate(hashPassword)
    } catch (error) {
        throw new Error(error.message)
    }
}

const loginValidate = async function (email, hashPassword) {
    try {
        emailValidate(email)
        passwordValidate(hashPassword)
    } catch (error) {
        throw new Error(error.message)
    }
}

const nameChangeValidate = async function (oldUserName, newUserName) {
    try {
        nameValidate(newUserName)
        if (oldUserName == newUserName)
            throw new Error('New name is the same as the old name')
        if (await UserModel.findOne({ userName: newUserName }).userName)
            throw new Error('Name already exists')
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = { nameValidate, 
    emailValidate, 
    passwordValidate, 
    registerValidate, 
    loginValidate, 
    nameChangeValidate,
    currencyUnitValidate
}
