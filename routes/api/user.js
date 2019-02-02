const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const keys = require("../../config/keys");
const UserData = require("../../models/UserData");

router.post("/create-user", (req, res) => {
  // @route   POST api/users/create-user
  // @desc    Test
  // @access  Public
  const test = new UserData({
    _id: new mongoose.Types.ObjectId(),
    user: req.body.user
  });
  test
    .save()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(404).json(err);
      console.log("err:", err);
    });
});

router.post('/register', (req, res) => {
  const user = new UserData({
    _id: req.body.uid,
    user: req.body.user
  });
  user.save()
  .then (result => {
    res.status(200).json(result);
  })
  .catch( error => {
    res.status(400).json(error);
  });
});

router.get("/retrieve-user/:_id", (req, res) => {
  // @route   GET api/users/retrieve-user/:id/
  // @desc    Test
  // @access  Public
  const id = req.params._id;
  UserData
    .findById(id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/", (req, res) => {
  // @route   GET api/users
  // @desc    Test
  // @access  Public
  UserData
    .find()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).json(err));
});

router.delete("/delete-user/:_id", (req, res) => {
  UserData
    .findOneAndRemove(req.params.id)
    .then(user => {
      user.save();
    })
    .then(data => {
      res.status(200).json({ data: data });
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

module.exports = router;
