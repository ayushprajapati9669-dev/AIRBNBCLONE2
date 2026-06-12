const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

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
module.exports = {
      validateListing,
      validateReview
}