const database = require('./database')
const express  = require('express')
const cors     = require('cors')
const app      = express()
const server   = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

// enable cors for all origins
app.use(cors("*"))

// tell server to accept json format
app.use(express.json())

// connect to mongodb database
database.connectDatabase('mongodb+srv://test:test@cluster0.n95ju.mongodb.net/Cluster0?retryWrites=true&w=majority')

// connect to all routes
const userRouters = require('./routes/userRouters/route.js')
const chatRoomRouters = require('./routes/chatRooms/route.js')
app.use('/users', userRouters)
app.use('/chatrooms', chatRoomRouters)

// listening to the port
server.listen(3000, () => {
    console.log("Development server started")
})

// socket io
io.on('connection', function (socket) {
    socket.on('join-room', function (roomId, userPeerId) {
        socket.join(roomId)
        // send broadcard message to all users in room
        socket.to(roomId).emit('user-connected', userPeerId)

        socket.on('disconnect', function () {
            socket.to(roomId).emit('user-disconnected', userPeerId)
        })
        socket.on('disconnect-from-room', function () {
            socket.to(roomId).emit('user-disconnected', userPeerId)
        })
        socket.on('end-call', function () {
            socket.to(roomId).emit('end-call-connection', true)
        })
        socket.on('new-message', function (data) {
            socket.to(roomId).emit('response-new-message', data)
            socket.emit('response-new-message', data)
        })
    })
})

