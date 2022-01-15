const jwt = require('jsonwebtoken')
const sha256 = require('sha256')

const UserModel = require('../model/user')
const WalletModel = require('../model/wallet')
const TradeModel = require('../model/trade')
const TradeTypeModel = require('../model/tradeType')
const { registerValidate, loginValidate, nameChangeValidate, passwordValidate, emailValidate, currencyUnitValidate } = require('../validation/user')
const { addTradeGroupValidate, deleteTradeGroupValidate } = require('../validation/trade')
const emailVerify = require('../email/emailVerify')
const forgotPassword = require('../email/forgotPassword')

class User {
    //POST api/user/register
    async register(req, res) {
        const { userName, email, hashPassword } = req.body
        try {
            await registerValidate(userName, email, hashPassword)
            const user = new UserModel({
                userName,
                email,
                emailActive: false,
                hashPassword,
                totalBalanceL: 0,
                currencyUnit: 'USD'
            })
            user.userID = user._id.toString()
            await user.save()
            await new TradeTypeModel({
                userID: user.userID
            }).save()
            res.status(200).json({ success: true, message: 'User created' })
            emailVerify(email, user.userID)
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //POST api/user/login
    async login(req, res) {
        const { email, hashPassword } = req.body
        try {
            await loginValidate(email, hashPassword)
            const user = await UserModel.findOne({ email })
            if (!user)
                throw new Error('Email or password is incorrect')
            if (user.hashPassword != hashPassword)
                throw new Error('Email or password is incorrect')
            if (!user.emailActive)
                return res.status(400).json({ success: false, message: 'Email not verified' })

            const accessToken = jwt.sign({ userID: user.userID }, process.env.ACCESS_TOKEN_SECRET)
            res.status(200).json({ success: true, accessToken })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //GET api/user/emailVerify/:userID
    async emailVerify(req, res) {
        const { p } = req.params //p = userID
        try {
            const user = await UserModel.findOne({ userID: p })
            if (!user)
                throw new Error('User not found')
            if (user.emailActive)
                return res.status(400).send(`
                <center>
                    <p>Your email was already verified</p>
                    <p>You can delete this mail</p>
                </center>
                `)
            user.emailActive = true
            await user.save()
            res.status(200).send(`
                <center>
                    <h1>Email verified</h1>
                    <p>You can now access your account, return the page and login</p>
                </center>
                `)
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //POST api/user/forgotPassword
    async forgotPassword(req, res) {
        const { email } = req.body
        try {
            emailValidate(email)
            const user = await UserModel.findOne({ email })
            if (!user)
                throw new Error('User not found')
            forgotPassword(email, user.userID)
            res.status(200).json({ success: true, message: 'email sent' })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //GET api/user/changePasswordManuallyLink/:userID
    async changePasswordManuallyLink(req, res) {
        const { p } = req.params
        try {
            const user = await UserModel.findOne({ userID: p })
            if (!user)
                throw new Error('User not found')
            res.status(200).send(`
                <center>
                <h1>change password</h1>
                <form method="POST" action="${process.env.DEPLOY_URL}/api/user/changePasswordManually/${user.userID}">
                    <p>Enter new password</p>
                    <input type="text" name="newPassword" id="newPassword"/>
                    <br />
                    <p>Retype new password</p>
                    <input type="text" name="newPasswordRetyped" id="newPasswordRetyped"/>
                    <br />
                    <br />
                    <input type="submit" />
                </form>
            </center>
            `)
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //POST api/user/changePasswordManually/:userID
    async changePasswordManually(req, res) {
        const { p } = req.params
        const { newPassword, newPasswordRetyped } = req.body
        try {
            if (newPassword.length == 0 || newPasswordRetyped.length == 0)
                throw new Error('password is invalid')
            if (newPassword != newPasswordRetyped)
                throw new Error('password does not match')
            const user = await UserModel.findOne({ userID: p })
            if (!user)
                throw new Error('user not found')
            user.hashPassword = sha256(newPassword)
            await user.save()
            res.send(`
                <center>
                <h1>Password update successfully</h1>
                <p>You can now login to your account with the new password</p>
                </center>
            `)
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //POST api/user/info
    async info(req, res) {
        const { user } = req.body
        try {
            res.status(200).json({
                userName: user.userName,
                email: user.email,
                totalBalance: user.totalBalance,
                currencyUnit: user.currencyUnit,
                createdAt: user.createdAt.toString(),
                updatedAt: user.updatedAt.toString(),
            })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //POST api/user/changeName
    async changeName(req, res) {
        const { user, newUserName } = req.body
        try {
            await nameChangeValidate(user.userName, newUserName)
            user.userName = newUserName
            await user.save()
            res.status(200).json({ success: true, message: 'User updated' })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //POST api/user/switchCurrencyUnit
    async switchCurrencyUnit(req, res) {
        const { user, currencyUnit } = req.body
        try {
            currencyUnitValidate(currencyUnit)
            user.currencyUnit = currencyUnit
            await user.save()
            res.status(200).json({ success: true, message: 'User updated' })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //POST api/user/changePassword
    async changePassword(req, res) {
        const { user, oldHashPassword, newHashPassword } = req.body
        try {
            passwordValidate(oldHashPassword)
            passwordValidate(newHashPassword)
            if (user.hashPassword != oldHashPassword)
                throw new Error('password is incorrect')
            user.hashPassword = newHashPassword
            await user.save()
            res.status(200).json({ success: true, message: 'User updated' })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //DELETE api/user/delete
    async delete(req, res) {
        const { user } = req.body
        try {
            const wallets = await WalletModel.find({ userID: user.userID })
            await WalletModel.deleteMany({ userID: user.userID })
            await TradeTypeModel.deleteOne({ userID: user.userID })
            for (const wallet of wallets) {
                await TradeModel.deleteMany({ walletID: wallet.walletID })
            }
            await UserModel.deleteOne({ userID: user.userID })
            res.status(200).json({ success: true, message: 'User deleted' })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //POST api/user/deleteUnverifiedUser
    //not finished yet
    async deleteUnverifiedUser(req, res) {
        try {
            await UserModel.deleteMany({ emailActive: false })
            res.status(200).json({ success: true, message: 'All unverified users was deleted' })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //POST api/user/addTradeGroup
    async addTradeGroup(req, res) {
        const { group, user, type } = req.body
        try {
            const tradeType = await addTradeGroupValidate(user, group, type)
            if (type == 'spend')
                tradeType.spendGroup.push(group)
            else
                tradeType.incomeGroup.push(group)
            await tradeType.save()
            res.status(200).json({ success: true, message: 'New type created' })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //GET api/user/getAllTradeGroup
    async getAllTradeGroup(req, res) {
        const { user } = req.body
        try {
            const tradeType = await TradeTypeModel.findOne({ userID: user.userID })
            res.status(200).json({
                spendGroup: tradeType.spendGroup,
                incomeGroup: tradeType.incomeGroup,
            })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }

    //POST api/user/deleteTradeGroup
    async deleteTradeGroup(req, res) {
        const { user, group, type,  } = req.body
        try {
            const tradeType = await deleteTradeGroupValidate(user, group, type)
            if (type == 'spend')
                tradeType.spendGroup.splice(tradeType.spendGroup.indexOf(group), 1)
            else
                tradeType.incomeGroup.splice(tradeType.incomeGroup.indexOf(group), 1)
            await tradeType.save()
            res.status(200).json({ success: true, message: 'Group deleted' })
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    }


}

module.exports = new User


