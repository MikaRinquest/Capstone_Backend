const express = require("express");
const router = express.Router();
const con = require("../library/db_connect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const controller = require("../Controllers/getFunctions");
// const middleware = require("../middleware/auth");

// USER FUNCTIONS

// Get all users
router.get("/", (req, res) => {
  let sql = "SELECT * FROM users";
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

// Get one user
router.get("/:id", (req, res) => {
  let sql = `SELECT * FROM users WHERE user_id = ${req.params.id}`;
  try {
    con.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length !== 0) {
        res.send(result);
      } else {
        res.send("This user does not exist");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Register a user
router.post("/register", (req, res) => {
  try {
    let sql = "INSERT INTO users SET ?";
    const { f_name, l_name, email, password, address, u_img } = req.body;
    // Start encrypting
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    let user = {
      f_name,
      l_name,
      email,
      password: hash,
      address,
      u_img,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      res.send(`User ${user.f_name} was created.`);
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(400).send(error);
  }
});

// Login a user
router.post("/login", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = { email: req.body.email };

    con.query(sql, user, async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.send("Email does not exist, please register.");
      } else {
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        if (!isMatch) {
          res.send("Password is incorrect");
        } else {
          const payload = {
            user: {
              user_id: result[0].user_id,
              f_name: result[0].f_name,
              l_name: result[0].type,
              email: result[0].email,
              password: result[0].password,
              address: result[0].address,
              u_img: result[0].u_img,
              u_type: result[0].u_type,
            },
          };
          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Verify a user
router.get("/user/verify", (req, res) => {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({ alert: "Something is wrong with the token" });
    } else {
      res.status(200);
      res.send(decodedToken);
    }
  });
});
// Delete a user
router.delete("/:id", (req, res) => {
  try {
    let sql = `DELETE FROM users WHERE user_id = ${req.params.id}`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length !== 0) {
        res.send("This user's account has been successfully deleted.");
      } else {
        res.send("This user already does not exist");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Edit a user
router.put("/:id", (req, res) => {
  try {
    let sql = "UPDATE users SET ?";
    const { f_name, l_name, password, address, u_img } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    let user = { f_name, l_name, password: hash, address, u_img };
    con.query(sql, user, (err) => {
      if (err) throw err;
      res.send(user);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// CART FUNCTIONS

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
    let sql = "DELETE FROM cart SET ?";
    let cart = {
      cart_id: req.params.cart_id,
    };
    con.query(sql, user, (err, result) => {
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

// {
//       "f_name":"Mika",
//       "l_name":"Rinquest",
//       "email":"mika@gmail.com",
//       "password": "dog",
//       "address":"home",
//       "u_img":"https://picsum.photos/200"
//     }
