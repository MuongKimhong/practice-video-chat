const mongoose = require('mongoose')


const userModel = new mongoose.Schema({
    username: { type: String },
    password: { type: String },
    token   : { type: String }
})


module.exports = {
    userModel: mongoose.model("userModel", userModel)
}
