const mongoose = require('mongoose');
const db = require('./index');

const User = db.connection.model(
  'User',
  new mongoose.Schema(
    {
      username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minLength: [3, 'Username must be at least 3 characters']
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true, // Converts email to lowercase
        match: [/.+@.+\..+/, 'Please enter a valid email address'] // Regex for email format
      },
      password: String,
      roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Role'
        }
      ],
      createdAt: {
        type: Date,
        default: () => Date.now(), // Sets the value to the current date/time
        immutable: true // Cannot be changed after creation
      },
      isVerified: {
        type: Boolean,
        default: false
      }
    },
    { timestamps: true }
  )
);

module.exports = User;
