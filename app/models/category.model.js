const mongoose = require('mongoose');
const db = require('./index');

const Category = db.connection.model(
  'Category',
  new mongoose.Schema(
    {
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      category: { type: String, required: true, maxLength: db.MAX_LEN_NAME },
      listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ListA',
        required: true
      },
      shown: { type: Boolean, default: true },
      deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
  )
);

module.exports = Category;
