const express = require("express");
const router = express.Router();
const con = require("../library/db_connect");

// Get all products
router.get("/", (req, res) => {
  let sql = "SELECT * FROM products";
  try {
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Get one product
router.get("/:id", (req, res) => {
  let sql = `SELECT * FROM products WHERE p_id = ${req.params.id}`;
  try {
    con.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length !== 0) {
        res.send(result);
      } else {
        res.send("This product does not exist");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;

// {
//       "f_name":"Mika",
//       "l_name":"Rinquest",
//       "email":"mika@gmail.com",
//       "password": "dog",
//       "address":"home",
//       "u_img":"https://picsum.photos/200"
//     }
