const model  = require('../../models')
const { v4: uuidV4 } = require('uuid')
const bcrypt = require('bcrypt')


async function createUserAccount(request, response) {
    // query user model if username exists or not
    var result = model.userModel.find({ 'username': request.body.username })
    result.exec(function (error, results) {
        if (results.length > 0) callback({ taken: true })
        else callback({ taken: false })
    })
    async function callback(params) {
        if (params['taken']) {
            response.status(400).json({ message: 'Username is already taken'})
        }
        else {
            const hashedPassword = await bcrypt.hash(request.body.password, 10)
            const userToken      = uuidV4()
            
            const user = new model.userModel({
                username: request.body.username,
                password: hashedPassword,
                token   : String(userToken)
            })
            try {
                const newUser = await user.save()
                response.status(200).json({ success : true})
            }
            catch (error) {
                response.status(400).json({ message : error.message})
            }
        }
    }
}


async function loginUser(request, response) {
    var result = model.userModel.find({ 'username': request.body.username })
    result.exec(function (error, results) {
        if (results.length > 0) callback({ exist: true, userInfo: results[0] })
        else callback({ exist: false })
    })
    async function callback(params) {
        if (params['exist']) {
            try {
                if (await bcrypt.compare(request.body.password, params['userInfo'].password)) {
                    response.status(200).json({ 
                        credentials: {
                            username: params['userInfo'].username,
                            token   : params['userInfo'].token
                        } 
                    })
                }
                else response.status(400).json({ error: true })
            }
            catch (error) {
                response.status(400).json({ message: error.message })
            }
        }
        else response.status(400).json({ error: true })
    }
}


module.exports = { createUserAccount, loginUser }