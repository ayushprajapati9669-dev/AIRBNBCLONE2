const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");
const { validateListing } = require("../middleware.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
/* ALL LISTINGS */

router.get("/", wrapAsync(async (req, res) => {

      const allListings = await Listing.find();

      res.render("./listings/index.ejs", {
            allListings
      });

}));

/* NEW FORM */

router.get("/new", isLoggedIn, (req, res) => {
      console.log(req.user);

      res.render("./listings/new.ejs");
});

/* CREATE */

router.post(
      "/", isLoggedIn,
      validateListing,
      wrapAsync(async (req, res) => {

            const {
                  title,
                  description,
                  imageUrl,
                  price,
                  location,
                  country
            } = req.body;
            const listing = new Listing({
                  title,
                  description,
                  image: {
                        filename: "listingimage",
                        url: imageUrl
                  },
                  price,
                  location,
                  country,
                  owner: req.user._id
            });

            await listing.save();
            req.flash("success", "new listing created !");
            res.redirect("/listings");
      })
);

/* SHOW */

router.get("/:id", wrapAsync(async (req, res) => {

      const { id } = req.params;

      const listing = await Listing.findById(id).populate({
            path: "reviews", populate: {
                  path: "author"
            }
      }).populate("owner");
      if (!listing) {
            req.flash("error", "listing requested for does not exist");
            return res.redirect("/listings");
      }

      res.render("./listings/show.ejs", {
            listing
      });

}));

/* EDIT FORM */

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {

      const { id } = req.params;

      const listing = await Listing.findById(id);

      res.render("./listings/edit.ejs", {
            listing
      });

}));

/* UPDATE */

router.put("/:id", isLoggedIn, isOwner,
      validateListing,
      wrapAsync(async (req, res) => {

            const { id } = req.params;

            const {
                  title,
                  description,
                  imageUrl,
                  price,
                  location,
                  country
            } = req.body;

            await Listing.findByIdAndUpdate(
                  id,
                  {
                        title,
                        description,
                        image: {
                              filename: "listingimage",
                              url: imageUrl
                        },
                        price,
                        location,
                        country
                  },
                  { new: true }
            );
            req.flash("success", "listing updated");
            res.redirect(`/listings/${id}`);
      })
);

/* DELETE */

router.delete("/:id", isLoggedIn, isOwner,
      wrapAsync(async (req, res) => {

            const { id } = req.params;

            await Listing.findByIdAndDelete(id);
            req.flash("success", "listing deleted");
            res.redirect("/listings");
      })
);
module.exports = router;
