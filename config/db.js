const mongoose = require(`mongoose`);
require('dotenv').config();

mongoose.set('strictQuery', false);

const dababaseName = `natours`;

const conetctionString = `mongodb+srv://bodil4o88:${process.env.DATABASE_PASSWORD}@cluster0.b8lw2kg.mongodb.net/${dababaseName}`;

module.exports = async(app) => {
    try {
        await mongoose.connect(conetctionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
    
        })
    
        console.log(`Database is contected`);
    
        mongoose.connection.on(`error`, (err) => {
            console.error(`Database error`);
            console.error(err);
        });
    } catch (err) {
        console.log(err);
        console.error(`Error connetion on database`);
        process.exit(1)
    }
};