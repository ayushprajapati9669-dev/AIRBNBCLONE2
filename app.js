require("dotenv").config({ path: "./.env" });
if (process.env.NODE_ENV !== "production") {
      require("dotenv").config();
}


const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
console.log(MongoStore);
const ExpressError = require("./utils/ExpressError");

const flash = require("connect-flash");


const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const app = express();
const dbUrl = process.env.ATLAS_URL;

let store = MongoStore.create({
      mongoUrl: dbUrl,
      crypto: {
            secret: "mysupersecret",
      },
      touchAfter: 24 * 3600
})
store.on("error", () => {
      console.log("error in mongo store", err);
})
const sessionOptions = {
      store,
      secret: "mysupersecret",
      resave: false,
      saveUninitialized: true,
      cookie: {
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
      }
}

/* ----------------------- MIDDLEWARES ----------------------- */
app.use(flash());
app.use(session(sessionOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

// setting for password authentication
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());// har ek request ke liye passport initialize ho jayega

app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());// user se related jitni bhi information h use hum session mein store karata means serialize karna user ko ab user ki information single session ke ander store h to use bar bar login nahi karna padega user ko seriallize kar diya single session mein

passport.deserializeUser(User.deserializeUser());// agar user ne ek bar serial end kar liya session ko to us user ko deseriallize karna padega

// end of setting for a password

/* ----------------------- DB CONNECTION ----------------------- */

// const url = "mongodb://127.0.0.1:27017/vanderlust";

async function main() {
      await mongoose.connect(dbUrl);
}

main()
      .then(() => console.log("DB connected successfully"))
      .catch((err) => console.log(err));


app.use((req, res, next) => {
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      res.locals.currentUser = req.user;
      next();
});



app.use("/listings", listingRouter);
app.use("/listings/:id", reviewRouter);
app.use("/", userRouter);

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