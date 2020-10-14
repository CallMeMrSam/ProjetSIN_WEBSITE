const mongoose = require('mongoose');

module.exports = {
    init: (opt = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        autoIndex: false,
        poolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
    }) => {
        mongoose.connect(process.env.DB_URI, opt);
        mongoose.Promise = global.Promise;
        
        mongoose.connection.on("connected", () => {
            console.log('Connecté à la DB')
        });
    }

}