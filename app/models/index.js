const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.connection = {};
db.ROLES = ['user', 'admin', 'moderator'];

db.role = {};
db.user = {};
db.lists = {};

db.setupModels = () => {
  db.role = require('./role.model');
  db.user = require('./user.model');
  db.lists = require('./list.model');
};

module.exports = db;
