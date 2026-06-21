const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
//Reviews
router.post("/reviews", isLoggedIn, validateReview, wrapAsync(async (req, res, next) => {
      let { id } = req.params;
      let listing = await Listing.findById(id);
      let newReview = new Review(req.body.review);
      newReview.author = req.user._id;
      listing.reviews.push(newReview);
      (await newReview.save());
      await listing.save();
      req.flash("success", "review added");
      res.redirect(`/listings/${id}`);
}));
// delete route for review
router.delete("/reviews/:reviewId", isLoggedIn, isReviewAuthor, async (req, res) => {
      let { id, reviewId } = req.params;
      let deletedReview = await Review.findByIdAndDelete(reviewId);
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      req.flash("success", "review deleted");
      res.redirect(`/listings/${id}`);
});
module.exports = router;