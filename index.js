// Importing dependencies
const express = require("express");
const cors = require("cors");
const route = express();
// Importing routes

// Setting up the API
route.set("port", process.env.DB_PORT || 3000);
route.use(express.json());
route.use(cors());

// Where to access the localhost
route.listen(route.get("port"), (req, res) => {
  console.log("Connection to server has been established");
  console.log(`Access port at localhost:${route.get("port")}`);
  console.log("Press Ctrl + C to cut connection to the server.");
});

// Home page on heroku
route.get("/", (req, res) => {
  res.json({
    Server: "Connection has been successful",
  });
});

// Setting routes

// Allowing live link to access api
// app.use(
//   cors({
//     origin: [],
//     credentials: true,
//   })
// );
