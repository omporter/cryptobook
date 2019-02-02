const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const UserAuth = require("../../models/UserAuth");

router.get("/", (req, res) => {
  UserAuth.find()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/byid/:id", (req, res) => {
  const id = req.params.id;
  UserAuth.findById(id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      console.log('hi')
      res.status(500).json(err);
    });
});

// register user
router.post("/register", (req, res) => {
  UserAuth.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        const errors = "Email Already Exists";
        res.status(400).json(errors);
      } else {
        let newUser = new UserAuth({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log("err is", err));
          });
        });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// login user
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  UserAuth.findOne({ email: email })
    .then(user => {
      if (!user) {
        console.log("user not found");
        return res.status(404).json({ email: "User not found" });
      }
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          console.log("success");

          const payload = { id: user.id, name: user.name };

          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 7200 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          console.log("incorrect password");
          return res.status(404).json({ password: "Incorrect Password" });
        }
      });
    })
    .catch();
});


// get user data once logged in 
router.get("/current", passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});

module.exports = router;
