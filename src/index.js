require('dotenv').config({ path:'.env.local' })

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ extended: true }))

const mongoose = require('mongoose')

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log('Database connected')
    } catch (error) {
        console.log(error.message)
        process.exit(1);
    }
}

connectToDatabase()

const route = require('./router/index')
route(app)

app.listen(port, () => {
    console.log(`Listening at: http://localhost:${port}`)
})