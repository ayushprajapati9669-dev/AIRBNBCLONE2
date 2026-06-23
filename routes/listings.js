const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");
const { validateListing } = require("../middleware.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controller/listing.js");

const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });
/* ALL LISTINGS */

router.route("/")
      .get(wrapAsync(listingController.index))
      .post(isLoggedIn,
            validateListing, upload.single("imageUrl"),
            wrapAsync(listingController.createNewListing)
      );

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
      .get(wrapAsync(listingController.showSpecificListing))
      .put(isLoggedIn, isOwner, upload.single("imageUrl"),
            validateListing,
            wrapAsync(listingController.updateListing)
      )
      .delete(isLoggedIn, isOwner,
            wrapAsync(listingController.destroyListing)
      );


router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
