const mongoose = require('mongoose');
const db = require('./index');

const Item = db.connection.model(
  'Item',
  new mongoose.Schema(
    {
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      item: { type: String, required: true, maxLength: db.MAX_LEN_NAME },
      listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ListA',
        required: true
      },
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
      },
      countCompleted: { type: Number, default: 0 },
      lastCompleted: Date,
      firstCompleted: Date,
      completed: { type: Boolean, default: false },
      deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
  )
);

module.exports = Item;
