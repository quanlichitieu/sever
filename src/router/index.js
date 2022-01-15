const user = require('./user')
const wallet = require('./wallet')
const trade = require('./trade')

module.exports = function route(app) {
    app.use('/api/user', user)
    app.use('/api/wallet', wallet)
    app.use('/api/trade', trade)
}
