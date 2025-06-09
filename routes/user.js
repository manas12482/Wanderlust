const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport");
const {saveRedirectUrl}= require("../middleware.js");

const controllerUser = require("../controllers/user.js");

router.route("/signup")
.get(controllerUser.renderSignup)
.post(wrapAsync(controllerUser.signUppost));

router.route("/login")
.get(controllerUser.renderLogin)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}), controllerUser.logInpost);


router.get("/logout",controllerUser.logOut);


module.exports= router;