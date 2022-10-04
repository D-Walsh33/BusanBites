const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestarauntSchema = new Schema({
    name: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Restaraunt', RestarauntSchema);