const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { validateReview } = require("../middleware.js");
//Reviews
router.post("/reviews", validateReview, wrapAsync(async (req, res, next) => {
      let { id } = req.params;
      let listing = await Listing.findById(id);
      let review = new Review(req.body.review);
      listing.reviews.push(review);
      await review.save();
      await listing.save();
      res.redirect(`/listings/${id}`);
}));
// delete route for review
router.delete("/reviews/:reviewId", async (req, res) => {
      let { id, reviewId } = req.params;
      let deletedReview = await Review.findByIdAndDelete(reviewId);
      console.log("deleted review=", deletedReview);
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      res.redirect(`/listings/${id}`);
});
module.exports = router;