const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const connectDb = require("../db/db.js");

// Connect Database
connectDb()
      .then(() => {
            console.log("Database Connected");
      })
      .catch((err) => {
            console.log(err);
      });

async function initDB() {
      try {
            await Listing.deleteMany({});

            // Insert Sample Data
            await Listing.insertMany(initData.data);

            console.log("Data Successfully Inserted");
            mongoose.connection.close();
      } catch (err) {
            console.log(err);
      }
}

initDB();