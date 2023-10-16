const mongoose = require("mongoose");


const schemas = require("../../schemas/schemas.js");
const User = schemas.User;
const Review = schemas.Review;
const Top = schemas.Top;
const Quote = schemas.Quote;

const server = '127.0.0.1:27017'; 
const database = 'BookLoversDB'; 
class Database {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
      .connect(`mongodb://${server}/${database}`)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error(err);
        console.error('Database connection failed');
      });
  }
}

module.exports = new Database();
