
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/Listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner,validateListing,searched} = require("../middleware.js");


const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});  //INITIALIZING MULTER


const listingController = require("../controllers/listings.js")

 router.route("/")
 .get(wrapAsync(listingController.index))
 .post(  isLoggedIn,
         validateListing,
         upload.single("listing[image]"),
         wrapAsync(listingController.create)
      );
      
 

//NEW ROUTE
router.get("/new",isLoggedIn,listingController.newForm);



router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete( isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));
 
//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));


    



module.exports = router;

