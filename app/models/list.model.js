const mongoose = require('mongoose');

const Lists = mongoose.model(
  'Lists',
  new mongoose.Schema({
    userid: String,
    lists: String
  })
);

module.exports = Lists;
