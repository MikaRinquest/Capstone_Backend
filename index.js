// Importing dependencies
const express = require("express");
const cors = require("cors");
const app = express();

// Importing routes
const usersRoute = require("./routes/usersRoute");
const cartRoute = require("./routes/cartRoute");
const businessRoute = require("./routes/businessRoute");
const productsRoute = require("./routes/productsRoute");

// Setting up the API
app.set("port", process.env.PORT || 8008);
app.use(express.json());
app.use(cors());

// Setting home route as static
app.use(express.static("public"));

// Where to access the localhost
app.listen(app.get("port"), (req, res) => {
  console.log("Connection to server has been established");
  console.log(`Access port at localhost:${app.get("port")}`);
  console.log("Press Ctrl + C to cut connection to the server.");
});

// Home page on heroku
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/" + "index.html");
});

// Setting routes
app.use("/users", usersRoute, cartRoute);
app.use("/products", productsRoute);
app.use("/business", businessRoute);

// Allowing live link to access api
