const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.connection = {};

db.lists = {};
db.user = {};
db.role = {};

db.ROLES = ['user', 'admin', 'moderator'];

db.setupModels = () => {
  db.lists = require('./list.model');
  db.user = require('./user.model');
  db.role = require('./role.model');
};

module.exports = db;
