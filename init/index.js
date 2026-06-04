const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const dbUrl = process.env.ATLASDB_URL_WOSRV;

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then((res) => {
        console.log("Connected to DB");
        })
    .catch((err)=>{
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
};

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, owner: "6a02fabd6b64fe496abbe301",
        geometry: {
            type: "Point",
            coordinates: [0, 0],
    }
    }));
    await Listing.insertMany(initData.data);
    console.log("Data Saved Successfully");
};

initDB();