const mongoose = require('mongoose');
const db = require('./index');

const Lists = db.connection.model(
  'Lists',
  new mongoose.Schema({
    userid: String,
    lists: String
  })
);

module.exports = Lists;
