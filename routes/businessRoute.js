const express = require("express");
const router = express.Router();
const con = require("../library/db_connect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const controller = require("../Controllers/getFunctions");
// const middleware = require("../middleware/auth");

// Get all businesses
router.get("/", (req, res) => {
  let sql = `SELECT * FROM business`;
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

// Get one business
router.get("/:id", (req, res) => {
  let sql = `SELECT * FROM business WHERE b_id = ${req.params.id}`;
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

// Register a business
router.post("/register", (req, res) => {
  try {
    let sql = "INSERT INTO business SET ?";
    const { b_name, phone, email, password } = req.body;
    // Start encrypting
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    let business = {
      b_name,
      phone,
      email,
      password: hash,
    };
    con.query(sql, business, (err, result) => {
      if (err) throw err;
      res.send(`Business ${business.b_name} was created.`);
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(400).send(error);
  }
});

// Login a business
router.post("/login", (req, res) => {
  try {
    let sql = "SELECT * FROM business WHERE ?";
    let { email, password } = req.body;
    let business = { email, password };

    con.query(sql, business, async (err, result) => {
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
            business: {
              b_id: result[0].b_id,
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

// Verify a business
router.get("/business/verify", (req, res) => {
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

// Delete a business
router.delete("/:id", (req, res) => {
  try {
    let sql = `DELETE FROM business WHERE b_id = ${req.params.id}`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length !== 0) {
        res.send("This business's account has been successfully deleted.");
      } else {
        res.send("This business already does not exist");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Edit a business
router.put("/:id", (req, res) => {
  try {
    let sql = `UPDATE business SET ? where b_id = ${req.params.id}`;
    const { b_name, phone, email, password, b_img } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    let business = {
      b_name,
      phone,
      email,
      password: hash,
      b_img,
    };
    con.query(sql, business, (err) => {
      if (err) throw err;
      res.send(business);
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
