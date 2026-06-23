const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controller/review.js");
//Reviews
router.post("/reviews", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
// delete route for review
router.delete("/reviews/:reviewId", isLoggedIn, isReviewAuthor, reviewController.destroyReview);
module.exports = router;