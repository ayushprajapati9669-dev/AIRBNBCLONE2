const User = require("../models/user.js");
module.exports.renderSignupForm = (req, res) => {

      res.render("../views/users/signup.ejs");
}
module.exports.createUser = async (req, res) => {
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


}
module.exports.renderLoginForm = (req, res) => {
      res.render("../views/users/login.ejs");
}
module.exports.loginUser = async (req, res) => {
      req.flash("success", "welcome back to wanderlust ! your are logged in");
      const redirectUrl = res.locals.redirectUrl || "/listings";
      req.session.redirectUrl = null;
      res.redirect(redirectUrl);
}
module.exports.logoutUser = (req, res, next) => {
      req.logOut((err) => {
            if (err) {
                  return next(err);
            }
            req.flash("success", "you logged out!");
            res.redirect("/listings");
      })
}