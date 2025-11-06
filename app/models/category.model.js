const mongoose = require('mongoose');
const db = require('./index');

const Category = db.connection.model(
  'Category',
  new mongoose.Schema(
    {
      userid: String,
      category: String,
      id: String,
      listId: String,
      shown: { type: Boolean, default: true },
      deleted: { type: Boolean, default: false },
      created: Date,
      modified: Date
    },
    { timestamps: true }
  )
);

module.exports = Category;
