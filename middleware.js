const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");


/* ----------------------- JOI VALIDATION ----------------------- */
//it validate the listing (middleware function) using joi
const validateListing = (req, res, next) => {

      const { error } = listingSchema.validate(req.body);

      if (error) {
            const errMsg = error.details
                  .map((el) => el.message)
                  .join(",");

            throw new ExpressError(400, errMsg);
      }

      next();
};
// it validate the reviews (middleware function)
const validateReview = (req, res, next) => {

      if (!req.body || !req.body.review) {
            throw new ExpressError(400, "Review data is required");
      }

      const { error } = reviewSchema.validate(req.body);

      if (error) {
            const errMsg = error.details
                  .map((el) => el.message)
                  .join(",");

            throw new ExpressError(400, errMsg);
      }

      next();
};

// login verification middleware
let isLoggedIn = (req, res, next) => {

      if (!req.isAuthenticated()) {// passport method
            req.session.redirectUrl = req.originalUrl;
            req.flash("error", "you must logged in !");
            return res.redirect("/login");
      }
      next();
}
let saveRedirectUrl = (req, res, next) => {
      if (req.session.redirectUrl) {
            res.locals.redirectUrl = req.session.redirectUrl;
      }
      next();
}
let isOwner = async (req, res, next) => {
      let { id } = req.params;
      let listing = await Listing.findById(id);
      if (!listing.owner.equals(res.locals.currentUser._id)) {
            req.flash("error", "you are not owner of the listing");
            res.redirect(`/listings/${id}`);
            return;
      }
      next()
}
let isReviewAuthor = async (req, res, next) => {

      let { id, reviewId } = req.params;
      let review = await Review.findById(reviewId);
      if (!review.author.equals(res.locals.currentUser._id)) {
            req.flash("error", "you are not author of this review!");
            res.redirect(`/listings/${id}`);
            return;
      }
      next();
}
module.exports = {
      validateListing,
      validateReview,
      isLoggedIn,
      saveRedirectUrl,
      isOwner,
      isReviewAuthor
}