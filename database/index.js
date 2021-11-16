const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/rentable');

const propertySchema = new mongoose.Schema({
  property_id: String,
  name: String,
  email: String,
});

const Properties = mongoose.model('Properties', propertySchema);

module.exports = { Properties };