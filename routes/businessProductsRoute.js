const express = require("express");
const router = express.Router();
const con = require("../library/db_connect");

// Get all products
router.get("/:id/products/", (req, res) => {
  let sql = `SELECT * FROM products WHERE b_id = "${req.body.b_id}"`;
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
router.get("/:id/products/:id", (req, res) => {
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

// Add a product
router.post("/:id/products/", (req, res) => {
  try {
    let sql = "INSERT INTO products SET ?";
    let { name, p_img, description, price, p_type, b_id } = req.body;
    let products = { name, p_img, description, price, p_type, b_id };
    con.query(sql, products, (err, result) => {
      if (err) throw err;
      res.send("Product has been added");
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Delete a product
router.delete("/:id/products/:id", (req, res) => {
  try {
    let sql = `DELETE FROM products WHERE p_id = ${req.params.id}`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length !== 0) {
        res.send("This product has been deleted.");
      } else {
        res.send("This product already does not exist");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Edit a product
router.patch("/:id/products/:id", (req, res) => {
  try {
    let sql = `UPDATE products SET ? WHERE p_id = ${req.params.id}`;
    const { name, p_img, description, price, p_type } = req.body;
    let product = { name, p_img, description, price, p_type };
    con.query(sql, product, (err) => {
      if (err) throw err;
      res.send(product);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Delete all products related to that business (must be tested)
// router.delete("/products/:id", (req, res) => {
//   try {
//     let sql = `DELETE FROM products WHERE b_id = ${req.body.id}`;
//     con.query(sql, (err, result) => {
//       if (err) throw err;
//       if (result.length !== 0) {
//         res.send("This product has been deleted.");
//       } else {
//         res.send("This product already does not exist");
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error);
//   }
// });

module.exports = router;
