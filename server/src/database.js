const mongoose = require('mongoose')


function connectDatabase(clusterString) {
    mongoose.connect(clusterString, { useNewUrlParser: true})
    const database = mongoose.connection

    database.on('error', (error) => console.log(error))
    database.once('open', () => console.log('Connected to database successfully'))
}

module.exports = { connectDatabase }