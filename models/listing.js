const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema =new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        url: {
            type: String,
            default: "https://unsplash.com/photos/a-silver-car-parked-in-a-parking-lot-NXkwdcV-rTw",
            set: (v) => v === ""?"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLe8TSw8PWtI-rsO22cCUU8N1c7uyQgNWBug&s":v,
        },
        filename: {
            type: String,
            default: "listingimage",
        },
      //  set: v => v===""?"https://unsplash.com/photos/a-silver-car-parked-in-a-parking-lot-NXkwdcV-rTw": v,
    },
    price: {
        type: Number,
        default: 0,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry : {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({_id: { $in: listing.reviews} });
    };
});

const Listing = new mongoose.model("Listing", listingSchema);
module.exports = Listing;