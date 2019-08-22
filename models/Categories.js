const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema(
  {
    humanId: {
      type: String,
      required: false
    },
    nameEng: {
      type: String,
      required: false
    },
    nameRus: {
      type: String,
      required: false
    },
    quantity: {
      type: Number,
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

module.exports = Categories = mongoose.model('categories', CategoriesSchema);
