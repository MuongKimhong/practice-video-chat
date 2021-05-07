const express = require('express')
const router = express.Router()
const views = require('./views.js')

// create new room
router.post('/create-new-room', (request, response) => views.createNewRoom(request, response))

// join room
router.post('/join-room', (request, response) => views.joinRoom(request, response))

router.post('/check-room', (req, res) => views.checkRoom(req, res))

router.post('/delete-room', (req, res) => views.deleteRoom(req, res))

router.get('/get-chatroom-messages', (req, res) => views.getChatRoomMessage(req, res))

router.post('/add-new-message', (req, res) => views.addMessage(req, res))

module.exports = router