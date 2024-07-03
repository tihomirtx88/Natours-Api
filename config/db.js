const mongoose = require(`mongoose`);
require(`../models/tourModel`);
require('dotenv').config();

mongoose.set('strictQuery', false);

// const conetctionString = `mongodb+srv://bodil4o88:${process.env.DATABASE_PASSWORD}@cluster0.b8lw2kg.mongodb.net/${dababaseName}`;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME;
const CONNECTION_STRING_DATABASE = `mongodb+srv://bodil4o88:${DATABASE_PASSWORD}@cluster0.b8lw2kg.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`;

module.exports = async(app) => {
    try {
        await mongoose.connect(CONNECTION_STRING_DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    
        console.log(`Database is contected`);
    
        mongoose.connection.on(`error`, (err) => {
            console.error(`Database error`);
            console.error(err);
        });
    } catch (err) {
        process.on('unhandleRejection', err => {
            console.log('UNHANDLER REJECTIONS, shooting down...');
            console.log(err);
            process.exit(1);
        });
    }
};

