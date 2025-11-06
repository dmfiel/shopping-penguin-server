const mongoose = require('mongoose');
const db = require('./index');

const Item = db.connection.model(
  'Item',
  new mongoose.Schema(
    {
      userid: String,
      item: String,
      id: String,
      listId: String,
      categoryId: String,
      countCompleted: { type: Number, default: 0 },
      lastCompleted: Date,
      firstCompleted: Date,
      completed: { type: Boolean, default: false },
      deleted: { type: Boolean, default: false },
      created: Date,
      modified: Date
    },
    { timestamps: true }
  )
);

module.exports = Item;
