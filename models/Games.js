const mongoose = require('mongoose');

const GamesSchema = new mongoose.Schema(
  {
    humanId: {
      type: String,
      required: false
    },
    marketPrice: {
      type: Number,
      required: false
    },
    currentPrice: {
      type: Number,
      required: false
    },
    category: {
      type: String,
      required: false
    },
    status: {
      type: String,
      required: false
    },
    caption: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    durationType: {
      type: String,
      required: false
    },
    duration: {
      type: Number,
      required: false
    },
    humanDuration: {
      type: Date,
      required: false
    },
    discountType: {
      type: String,
      required: false
    },
    discount: {
      type: Number,
      required: false
    },
    promocode: {
      type: String,
      required: false
    },
    timesClicked: {
      type: Number,
      required: false
    },
    lastClick: {
      type: Number,
      required: false
    },
    timer: {
      type: Number,
      required: false
    },
    link: {
      type: String,
      required: false
    },
    bigPic: {
      guid: {
        type: String,
        unique: true,
        required: true
      },
      ext: {
        type: String,
        required: true
      }
    }
  },
  { versionKey: false }
);

module.exports = Games = mongoose.model('games', GamesSchema);
