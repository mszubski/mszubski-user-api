const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userCarsSchema = new Schema({
  username: String,
  vehicle: String,
  manufacturer: String,
  model: String,
  type: String,
  fuel: String,
  vin: String,
  color: String
});

module.exports = mongoose.model('userCars', userCarsSchema);
