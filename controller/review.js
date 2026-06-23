const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
module.exports.createReview = async (req, res, next) => {
      let { id } = req.params;
      let listing = await Listing.findById(id);
      let newReview = new Review(req.body.review);
      newReview.author = req.user._id;
      listing.reviews.push(newReview);
      (await newReview.save());
      await listing.save();
      req.flash("success", "review added");
      res.redirect(`/listings/${id}`);
}
module.exports.destroyReview = async (req, res) => {
      let { id, reviewId } = req.params;
      let deletedReview = await Review.findByIdAndDelete(reviewId);
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      req.flash("success", "review deleted");
      res.redirect(`/listings/${id}`);
}