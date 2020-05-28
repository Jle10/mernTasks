const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        });
        console.log('DB conectada');
    } catch (error) {
        console.log(error);
        process.exit(1); //Si hay error detiene la app
    }
}

module.exports = conectarDB;