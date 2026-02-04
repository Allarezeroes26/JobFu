const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config()
const cookieparser = require('cookie-parser');
const connectDB = require('./db/db');
const userRoutes = require('./routes/userRoutes')

const app = express()

connectDB()

const port = process.env.PORT || 8001;

app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin: process.env.FRONTEND,
    credentials: true
}))

app.use('/api/auth/', userRoutes)

app.listen(port, () => {
    console.log(`Server running in port ${port}`)
})