const mongoose = require('mongoose');

const AutoBettingSchema = new mongoose.Schema(
  {
    user: {
      type: Array,
      required: true
    },
    game: {
      type: Array,
      required: true
    },
    clickTime: {
      type: Number,
      required: true
    }
  },
  { versionKey: false }
);

module.exports = AutoBetting = mongoose.model('autobetting', AutoBettingSchema);
