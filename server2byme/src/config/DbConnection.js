const mongoose = require("mongoose");
// database config reload verified successfully 
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const chalk = require("chalk");

let mongoUrl = "";

if (process.env.NODE_ENV == "development") {
  mongoose.set("autoCreate", true);
  mongoUrl = process.env.DEV_MONGDB_URL;
}
if (process.env.NODE_ENV == "production") {
  mongoUrl = process.env.PROD_DATABASE_URL;
}

// Connect directly to the configured database


mongoose.connect(mongoUrl);
mongoose.set("strictQuery", false);
mongoose.connection.on("connected", () => {
  console.log(chalk.green("✓"), "Mongoose connection establish successfully");
  console.log("****your url****",mongoUrl)
});

// If the connection throws an error
mongoose.connection.on("error", (error) => {
  console.log(chalk.red("X"), "Mongoose default connection error: ", error);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
  console.log(chalk.red("-X-"), "Mongoose default connection disconnected");
});
