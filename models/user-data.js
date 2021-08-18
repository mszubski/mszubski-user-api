const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userDataSchema = new Schema({
  username: String,
  firstName: String,
  lastName: String,
  jobTitle: String,
  city: String,
  streetName: String,
  zipCode: String,
  state: String,
  bankAccount:	Number,
  financeAmount:	Number,
  currencyName: String,
  phoneNumber: String,
  email: String,
  favoriteMusic: String,
});

module.exports = mongoose.model('userData', userDataSchema);
