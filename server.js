require("dotenv").config();
const mongoose = require("mongoose");
const { app } = require("./app");

mongoose.set("strictQuery", false);

const { HOST_URL } = process.env;

async function main() {
  try {
    await mongoose.connect(HOST_URL);
    console.log("Database connection successful");

    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  } catch (error) {
    console.error("Main failed:", error.message);
    process.exit(1);
  }
}
main();
