const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    // console.log(req.originalUrl);
    // console.log(req.path);
    if(!req.isAuthenticated()){
        if(req.method === "GET"){
        req.session.redirectUrl = req.originalUrl;
        }
        // console.log(req.session.redirectUrl);
        req.flash("error", "You need to logged in to perform anything");
        return res.redirect("/login");
    }
    next()
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log(res.locals.redirectUrl);
    }
    next()
}

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing")
        return res.redirect(`/listing/${id}`)
    }
    next()
}

module.exports.validateListing = ((req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    // console.log(error);
    if(error){
        let errMgs = error.details.map((el) => el.message).join(",")
        throw new ExpressError (400, errMgs)
    }else{
        next()
    }
})

module.exports.validateReview = ((req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    // console.log(error);
    if(error){
        let errMgs = error.details.map((el) => el.message).join(",");
        throw new ExpressError (400, errMgs)
    }else{
        next()
    }
})

module.exports.isReviewAuthor = async (req,res,next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!res.locals.currUser && review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listing/${id}`);
    }
    next()
}