const Listing = require("../models/listing.js");
module.exports.index = async (req, res) => {

      const allListings = await Listing.find();

      res.render("./listings/index.ejs", {
            allListings
      });

}
module.exports.renderNewForm = (req, res) => {
      console.log(req.user);

      res.render("./listings/new.ejs");
}
module.exports.createNewListing = async (req, res) => {
      const url = req.file.path;
      const filename = req.file.filename;

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
      listing.image = { url, filename };
      await listing.save();
      req.flash("success", "new listing created !");
      res.redirect("/listings");
}
module.exports.showSpecificListing = async (req, res) => {

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

}
module.exports.renderEditForm = async (req, res) => {
      const { id } = req.params;

      const listing = await Listing.findById(id);

      let originalUrl = listing.image.url;
      originalUrl = originalUrl.replace(
            "/upload",
            "/upload/w_300,h_200,c_fill"
      );

      res.render("./listings/edit.ejs", {
            listing,
            originalUrl
      });
};
module.exports.updateListing = async (req, res) => {
      const { id } = req.params;

      const {
            title,
            description,
            price,
            location,
            country
      } = req.body;

      let listing = await Listing.findByIdAndUpdate(
            id,
            {
                  title,
                  description,
                  price,
                  location,
                  country
            },
            { new: true }
      );

      // Update image only if a new file is uploaded
      if (req.file) {
            const url = req.file.path;
            const filename = req.file.filename;

            listing.image = {
                  url,
                  filename
            };

            await listing.save();
      }

      req.flash("success", "Listing updated!");
      res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {

      const { id } = req.params;

      await Listing.findByIdAndDelete(id);
      req.flash("success", "listing deleted");
      res.redirect("/listings");
}