const mongoose = require("mongoose");
const { findOneAndDelete } = require("./review");
const Review = require("./review.js");
const Schema = mongoose.Schema;
const User = require("./user.js");
const listingSchema = new Schema({
      title: {
            type: String,
            required: true,
      },

      description: {
            type: String,
      },

      image: {
            filename: {
                  type: String,
                  default: "listingimage",
            },

            url: {
                  type: String,
                  default:
                        "https://plus.unsplash.com/premium_photo-1697729701846-e34563b06d47?w=500&auto=format&fit=crop&q=60",
            },
      },

      price: {
            type: Number,
      },

      location: {
            type: String,
      },

      country: {
            type: String,
      },
      reviews: [
            {
                  type: Schema.Types.ObjectId,
                  ref: "Review"
            }
      ],
      owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
      }
});
listingSchema.post("findOneAndDelete", async (listing) => {
      if (listing) {
            if (listing.reviews) {
                  await Review.deleteMany({ _id: { $in: listing.reviews } });
            }

      }
});
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;