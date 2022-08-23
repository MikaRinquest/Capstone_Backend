// Importing dependencies
const express = require("express");
const cors = require("cors");
const app = express();
// Importing routes
const usersRoute = require("./routes/usersRoute");

// Setting up the API
app.set("port", process.env.PORT || 8008);
app.use(express.json());
app.use(cors());

// Where to access the localhost
app.listen(app.get("port"), (req, res) => {
  console.log("Connection to server has been established");
  console.log(`Access port at localhost:${app.get("port")}`);
  console.log("Press Ctrl + C to cut connection to the server.");
});

// Home page on heroku
app.get("/", (req, res) => {
  res.json({
    Server: "Connection has been successful",
  });
});

// Setting routes
app.use("/users", usersRoute);
// Allowing live link to access api
// app.use(
//   cors({
//     origin: [],
//     credentials: true,
//   })
// );
