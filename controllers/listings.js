const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res) => {
    const allListing = await Listing.find({});
    // console.log(allListing);
    // res.send("working");
    res.render("index.ejs", {allListing});
};

module.exports.renderNewForm = (req,res) => {
    res.render("new.ejs");
    // app.get("/listing", (req,res)=>{
    //     let listing = new Listing({
    //         title: "My Villa",
    //         description: "By the beach",
    //         price: 1200,
    //         location: "Gaa",
    //         country: "India",
    //     });
    //     listing
    //         .save()
    //             .then((res)=>{
    //                 console.log("Succesfully Saved");
    //             })
    //             .catch((err)=>{
    //                 console.log(err);
    //             });
    //     console.log("Saved to DB");
    //     res.send("Successful");
    // })
}

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing is not found!");
        res.redirect("/listing");
    }else{
        console.log(listing);
        res.render("show.ejs", {listing});
    };
}

module.exports.createListing = async (req,res) =>{

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
        })
        .send();
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..", filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing is created!");
    res.redirect("/listing");


    // }catch(err){
    //     next(err);
    // }
    //self
    // let {title, description, image, price, location, country} =req.body;
    // const listing = await Listing.insertMany({title, description, image, price, location, country});
    // console.log(listing);
    // console.log(title);
    // console.log(description);
    // console.log(image);
    // console.log(price);
    // console.log(location);
    // console.log(country);
    // res.redirect("/listing");
}

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing is not found!");
        res.redirect("/listing");
    }else{
    // console.log(listing);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250")
    res.render("edit.ejs", {listing , originalImageUrl});
    }
};

module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, {runValidators: true, new: true});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename};
        await listing.save();
    }
    req.flash("success", "Listing updated!");
    // console.log(listing);
    res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req,res) =>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    console.log(deletedListing);
    res.redirect("/listing");
};