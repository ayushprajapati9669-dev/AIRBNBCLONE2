const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


const ExpressError = require("./utils/ExpressError");

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");

const app = express();

/* ----------------------- MIDDLEWARES ----------------------- */

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));

/* ----------------------- DB CONNECTION ----------------------- */

const url = "mongodb://127.0.0.1:27017/vanderlust";

async function main() {
      await mongoose.connect(url);
}

main()
      .then(() => console.log("DB connected successfully"))
      .catch((err) => console.log(err));



app.use("/listings", listings);
app.use("/listings/:id", reviews);


/* ----------------------- ROUTES ----------------------- */

app.get("/", (req, res) => {
      res.send("I am root");
});


/* 404 */

app.all("/*splat", (req, res, next) => {
      next(new ExpressError(404, "Page Not Found"));
});

/* ERROR HANDLER */

app.use((err, req, res, next) => {

      console.log(err);

      let {
            statusCode = 500,
            message = "Something Went Wrong"
      } = err;

      res.status(statusCode).render("error.ejs", {
            message
      });

});

/* SERVER */

app.listen(8080, () => {
      console.log("Server listening on port 8080");
});