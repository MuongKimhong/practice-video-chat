const database = require('./database')
const express  = require('express')
const cors     = require('cors')
const app      = express()

// enable cors for all origins
app.use(cors())

// tell server to accept json format
app.use(express.json())

// connect to mongodb database
database.connectDatabase('mongodb+srv://test:test@cluster0.n95ju.mongodb.net/Cluster0?retryWrites=true&w=majority')

// connect to all routes
const userRouters = require('./routes/userRouters/route.js')
app.use('/users', userRouters)


// listening to the port
app.listen(3000, () => {
    console.log("Development server started")
})