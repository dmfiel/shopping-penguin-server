const mongoose = require('mongoose');
const db = require('./index');

const ListA = db.connection.model(
  'ListA',
  new mongoose.Schema(
    {
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      list: { type: String, required: true, maxLength: db.MAX_LEN_NAME },
      shown: { type: Boolean, default: true },
      deleted: { type: Boolean, default: false }
    },
    { timestamps: true }
  )
);

module.exports = ListA;
