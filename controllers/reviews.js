const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req,res)  => {
    const listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", " New Review Created!");
    console.log("Review Saved");
    res.redirect(`/listing/${listing._id}`);
};

module.exports.destroyReview = async (req,res) => {
    let { id, reviewId } = req.params;
    // console.log(id);
    // console.log(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
    let result1 = await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    console.log(result1);
    res.redirect(`/listing/${id}`);
    // res.send("working");
};