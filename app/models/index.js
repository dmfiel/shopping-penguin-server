const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.connection = {};
db.ROLES = ['user', 'admin', 'moderator'];

db.role = {};
db.user = {};
db.lists = {};
db.list = {};
db.category = {};
db.item = {};

db.setupModels = () => {
  db.role = require('./role.model');
  db.user = require('./user.model');
  db.lists = require('./lists.model');
  db.list = require('./list.model');
  db.category = require('./category.model');
  db.item = require('./item.model');
};

module.exports = db;
