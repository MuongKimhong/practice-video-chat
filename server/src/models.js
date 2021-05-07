const mongoose = require('mongoose')


const userModel = new mongoose.Schema({
    username: { type: String },
    password: { type: String },
    token   : { type: String }
})

const chatRoomModel = new mongoose.Schema({
    virtualId: { type: String },
    ownerToken: { type: String }
})

const chatRoomMessageModel = new mongoose.Schema({
    roomVirtualId: { type: String },
    senderToken: { type: String },
    senderName: { type: String },
    message: { type: String }
})

module.exports = {
    userModel: mongoose.model("userModel", userModel),
    chatRoomModel: mongoose.model("chatRoomModel", chatRoomModel),
    chatRoomMessageModel: mongoose.model("chatRoomMessageModel", chatRoomMessageModel)
}
