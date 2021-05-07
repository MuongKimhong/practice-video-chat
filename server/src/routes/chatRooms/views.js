const model = require('../../models')
const { v4: uuidV4 } = require('uuid')


async function createNewRoom(request, response) {
    const chatRoom = new model.chatRoomModel({
        virtualId: String(uuidV4()).slice(0, 8),
        ownerToken: request.body.ownerToken
    })
    try {
        const newChatRoom = await chatRoom.save()
        response.status(200).json({ virtualId: newChatRoom.virtualId, ownerToken: newChatRoom.ownerToken })
    }
    catch (error) {
        response.status(400).json({ message: error.message })
    }
}

function joinRoom(request, response) {
    var result = model.chatRoomModel.find({ 'virtualId': request.body.virtualId })

    result.exec(function (error, results) {
        if (results.length > 0) callback({ exist: true, token: results[0].ownerToken })
        else callback({ exist: false })
    })

    async function callback(params) {
        if (!params['exist']) response.status(400).json({ message: "Room id doesn't exist" })
        else response.status(200).json({ message: true, token: params['token'] })
    }
}

function checkRoom(request, response) {
    var result = model.chatRoomModel.find({ 
        'virtualId': request.body.virtualId,
        'ownerToken': request.body.ownerToken
    })

    result.exec(function (error, results) {
        if (results.length > 0) callback({ exist: true })
        else callback({ exist: false })
    })

    async function callback(params) {
        if (!params['exist']) response.status(400).json({ error: true })
        else response.status(200).json({ success: true })
    }
}

function deleteRoom(req, res) {
    model.chatRoomModel.deleteOne({ 'virtualId': req.body.virtualId })
    .then((response) => {
        if (response.deletedCount === 0) res.status(400).json({ error: true })
        else res.status(200).json({ success: true })
    })
}


function getChatRoomMessage (req, res) {
    var messages = model.chatRoomMessageModel.find({ roomVirtualId: req.query.roomVirtualId })
    messages.exec((err, results) => {
        res.status(200).json({ messages: results })
    })
}

async function addMessage (req, res) {
    const message = new model.chatRoomMessageModel({
        roomVirtualId: req.body.roomVirtualId,
        senderToken: req.body.senderToken,
        senderName: req.body.senderName,
        message: req.body.message
    })

    try {
        const newMessage = await message.save()
        res.status(200).json({ message: newMessage })
    }
    catch (error) {
        res.status(400).json({ error: true })
    }
}

module.exports = { createNewRoom, joinRoom, checkRoom, deleteRoom, getChatRoomMessage, addMessage }