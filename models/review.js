const mongoose = require("mongoose");
const User = require("./user.js");
const { Schema } = mongoose;
let reviewSchema = new Schema({
      comments: String,
      rating: {
            type: Number,
            min: 1,
            max: 5
      },
      createdAt: {
            type: Date,
            default: Date.now()
      },
      author: {
            type: Schema.Types.ObjectId,
            ref: "User"
      }
});
module.exports = mongoose.model("Review", reviewSchema);