const mongoose = require('mongoose');

const libarySchema = new mongoose.Schema({
  comments: { type: [String], default: [] },
  title: { type: String, required: true },
  commentcount: { type: Number, default: 0 },
});

const book = mongoose.model('Books', libarySchema);

module.exports = book;