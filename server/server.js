const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config()
const cookieparser = require('cookie-parser');
const connectDB = require('./db/db');
const userRoutes = require('./routes/userRoutes')
const jobRoutes = require('./routes/jobRoute')
const employerRoutes = require('./routes/employeeRoutes')
const applicationRoutes = require('./routes/applicationRoutes')

const app = express()

connectDB()

const port = process.env.PORT || 8001;

app.use(express.json({limit: '10mb'}))
app.use(cookieparser())
app.use(cors({
    origin: process.env.FRONTEND || process.env.PORT,
    credentials: true
}))

app.use('/api/auth/', userRoutes)
app.use('/api/jobs/', jobRoutes)
app.use('/api/employer/', employerRoutes)
app.use('/api/application/', applicationRoutes)

app.listen(port, () => {
    console.log(`Server running in port ${port}`)
})