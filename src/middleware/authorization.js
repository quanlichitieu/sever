const jsonwebtoken = require('jsonwebtoken')

const UserModel = require('../model/user')

module.exports = function (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token)
        return res.status(401).json({ success: false, message: 'No token provided' })
    jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, payload) => {
        if (error)
            return res.status(403).json({ success: false, message: 'Token is invalid' })
        const userID = payload.userID
        try {
            const user = await UserModel.findOne({ userID })
            if (!user)
                return res.status(403).json({ success: false, message: 'Token is invalid' })
            if (!user.emailActive)
                return res.status(403).json({ success: false, message: 'Email not verified' })
            req.body.user = user
            next()
        } catch (error) {
            res.status(400).json({ success: false, message: error.message })
        }
    })
}
