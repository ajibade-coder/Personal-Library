const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();
////////////////////////
let psswd = process.env.DB
const db = async () => {
  try {
    await mongoose.connect(psswd, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Failed to connect to MongoDB... ERROR:", error.message);
    process.exit(1);  // Exit the process with failure
  }
};

module.exports = db

  