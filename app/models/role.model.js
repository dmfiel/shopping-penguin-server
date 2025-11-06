const mongoose = require('mongoose');
const db = require('./index');

const Role = db.connection.model(
  'Role',
  new mongoose.Schema({
    name: String
  })
);

module.exports = Role;
