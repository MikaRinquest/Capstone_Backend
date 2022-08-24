const express = require("express");
const router = express.Router();
const con = require("../library/db_connect");

// Display cart
router.get("/:id/cart", (req, res) => {
  try {
    let sql = "SELECT * FROM cart";
    con.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length !== 0) {
        res.send(result);
      } else {
        res.send("The cart is empty");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Add to cart
router.post("/:id/cart", (req, res) => {
  try {
    let sql = "INSERT INTO users SET ?";
    const { user_id, quantity, cart_item } = req.body;
    let user = { user_id, quantity, cart_item };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      res.send("Item has successfully been added to cart.");
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Delete from cart
router.delete("/:id/cart/:id", (req, res) => {
  try {
    let sql = "DELETE FROM cart WHERE ?";
    let cart = {
      cart_id: req.params.cart_id,
    };
    con.query(sql, cart, (err, result) => {
      if (err) throw err;
      res.send("Item has been removed");
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Change quantity
router.patch("/:id/cart/:id", (req, res) => {
  try {
    let sql = "UPDATE cart SET ?";
    let cart = {
      quantity: req.body.quantity,
    };
    con.query(sql, cart, (err, result) => {
      if (err) throw err;
      res.send("Amount has been updated.");
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Clear cart
router.delete("/:id/cart", (req, res) => {
  let sql = "TRUNCATE TABLE cart";
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send("Cart has been cleared");
  });
});

module.exports = router;
