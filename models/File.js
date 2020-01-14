const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const FileSchema = new Schema({
  fileID:{
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  file_firstname: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('files', FileSchema);