if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRoute = require('./routes/auth')
const notesRoute = require('./routes/notes')

const app = express()

mongoose.set('strictQuery', true)
mongoose.set('bufferCommands', false)

const dbUrl = process.env.MONGODB_URI || 'mongodb+srv://Abhi:Abhi@cluster0.xtozhzb.mongodb.net/MyNoteBook?retryWrites=true&w=majority&appName=Cluster0'

async function main() {
    await mongoose.connect(dbUrl)
    console.log('Database connected')
}
main().catch(err => console.log('Database connection failed:', err.message))

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map(origin => origin.trim())

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(null, true)
        }
    }
}))
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ success: true, message: 'myNoteBook API is running' })
})

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'myNoteBook API is running' })
})

app.use('/api/auth', authRoute)
app.use('/api/notes', notesRoute)

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).json({ success: false, message: err.message })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
