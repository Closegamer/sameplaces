const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  nick: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  stuff: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  contribution: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('user', UserSchema);
