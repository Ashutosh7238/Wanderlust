const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapasync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateListing, upload.single('listing[image][url]'),  wrapAsync(listingController.createListing));

//#create a NEW ROUTE for adding a listing:-
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image][url]'), validateListing,  wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// #Edit Route :-
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// # All Listings/Index Route :-
// router.get("/",  wrapAsync(listingController.index));

//# SHOW ROUTE to show details of specific route:-
// router.get("/:id", wrapAsync(listingController.showListing));

//# CREATE ROUTE for listing:-
// router.post("/", isLoggedIn, validateListing,  wrapAsync(listingController.createListing));

// #Update the listing:-
// router.put("/:id", isLoggedIn, isOwner, validateListing,  wrapAsync(listingController.updateListing));

//# Delete Route:-
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;