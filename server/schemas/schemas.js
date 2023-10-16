const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    avatar: String,
      username: String,
      email: String,
      password: String,
      name: String,
      surname: String,
      genresString: String,
      about: String,
      role: String
  }, { strict: false });

  const User = mongoose.model('User', userSchema);

  const reviewSchema = new mongoose.Schema({
    username: String,
      title: String,
      author: String,
      rank: Number,
      genresString: String,
      reviewText: String
  });

  const Review = mongoose.model('Review', reviewSchema);

  const topSchema = new mongoose.Schema({
    username: String,
      title: String,
      genre: String,
      books: Array
  });

  const Top = mongoose.model('Top', topSchema);

  const quoteSchema = new mongoose.Schema({
    username: String,
      quoteText: String,
      author: String,
  });

  const Quote = mongoose.model('Quote', quoteSchema);

  module.exports =  {User, Review, Top, Quote}