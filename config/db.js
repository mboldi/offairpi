const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/offairDB');

module.exports = mongoose;