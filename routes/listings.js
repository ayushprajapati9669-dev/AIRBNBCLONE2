const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");
const { validateListing } = require("../middleware.js");
/* ALL LISTINGS */

router.get("/", wrapAsync(async (req, res) => {

      const allListings = await Listing.find();

      res.render("./listings/index.ejs", {
            allListings
      });

}));

/* NEW FORM */

router.get("/new", (req, res) => {
      res.render("./listings/new.ejs");
});

/* CREATE */

router.post(
      "/",
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
                  country
            });

            await listing.save();

            res.redirect("/listings");
      })
);

/* SHOW */

router.get("/:id", wrapAsync(async (req, res) => {

      const { id } = req.params;

      const listing = await Listing.findById(id).populate("reviews");

      res.render("./listings/show.ejs", {
            listing
      });

}));

/* EDIT FORM */

router.get("/:id/edit", wrapAsync(async (req, res) => {

      const { id } = req.params;

      const listing = await Listing.findById(id);

      res.render("./listings/edit.ejs", {
            listing
      });

}));

/* UPDATE */

router.put("/:id",
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

            res.redirect("/listings");
      })
);

/* DELETE */

router.delete("/:id",
      wrapAsync(async (req, res) => {

            const { id } = req.params;

            await Listing.findByIdAndDelete(id);

            res.redirect("/listings");
      })
);
module.exports = router;
