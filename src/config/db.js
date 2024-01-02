require("dotenv").config();
const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected to Mongo DB...");
  } catch (err) {
    console.log({ DB_CONN_FAILED: err });
  }
}

module.exports = connectDB;
