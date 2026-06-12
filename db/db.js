const mongoose = require("mongoose");
let url = "mongodb://127.0.0.1:27017/vanderlust";
let connectDb = async () => {
      mongoose.connect(url);
}
module.exports = connectDb;
