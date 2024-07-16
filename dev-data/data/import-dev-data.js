const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tourModel');

mongoose.set('strictQuery', false);

dotenv.config({
  path: './config.env'
});

const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME;
const CONNECTION_STRING_DATABASE = `mongodb+srv://bodil4o88:${DATABASE_PASSWORD}@cluster0.b8lw2kg.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`;

 mongoose.connect(CONNECTION_STRING_DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

console.log(`Database is contected`);

mongoose.connection.on(`error`, err => {
  console.error(`Database error`);
  console.error(err);
});

// Read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);

// Import Data in DataBase
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log(tours);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete all data from colection

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data is deleted');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}


// run script like 
// node dev-data/data/import-dev-data.js --import or node dev-data/data/import-dev-data.js --delete