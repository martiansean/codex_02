const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UnitSchema = new Schema({
    subject: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

mongoose.model('units', UnitSchema);