const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

router.route("/signup")
      .get(userController.renderSignupForm)
      .post(userController.createUser);;

router.route("/login")
      .get(userController.renderLoginForm)
      .post(saveRedirectUrl, passport.authenticate("local",
            { failureRedirect: '/login', failureFlash: true }), userController.loginUser);;

router.get("/logout", userController.logoutUser);
module.exports = router;