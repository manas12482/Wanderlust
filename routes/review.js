const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/Listing.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");

const controllerReview = require("../controllers/review.js");




//Review post Route
router.post("/",isLoggedIn,validateReview ,wrapAsync(controllerReview.postReview));
  
  // Review Delete Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(controllerReview.deleteReview));
  
  module.exports = router;