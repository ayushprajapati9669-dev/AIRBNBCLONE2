const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
router.get("/signup", (req, res) => {

      res.render("../views/users/signup.ejs");
});
router.post("/signup", async (req, res) => {
      try {
            let { username, email, password } = req.body;
            let newUser = new User({
                  email: email,
                  username: username
            });
            let registerdUser = await User.register(newUser, password);
            req.logIn(registerdUser, (err) => {
                  if (err) {
                        return next(err);
                  }
                  req.flash("success", "welcome to wanderlust !");
                  res.redirect("/listings");
            })
      } catch (err) {
            req.flash("error", err.message);
            res.redirect("/signup");
      }


});
router.get("/login", (req, res) => {
      res.render("../views/users/login.ejs");
})

// passport.authenticate() ek middleware h jo post route ke login se pehle authentication ke liye use hota h ya login se pehle ye authenticate karta h
router.post("/login", saveRedirectUrl, passport.authenticate("local",
      { failureRedirect: '/login', failureFlash: true }),
      async (req, res) => {
            req.flash("success", "welcome back to wanderlust ! your are logged in");
            const redirectUrl = res.locals.redirectUrl || "/listings";
            req.session.redirectUrl = null;
            res.redirect(redirectUrl);
      })
router.get("/logout", (req, res, next) => {
      req.logOut((err) => {
            if (err) {
                  return next(err);
            }
            req.flash("success", "you logged out!");
            res.redirect("/listings");
      })
})
module.exports = router;