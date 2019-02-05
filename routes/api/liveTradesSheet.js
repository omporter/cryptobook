const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const keys = require("../../config/keys");
const userData = require("../../models/UserData");

// CREATE
router.post("/create-live-trades-sheet/:_id", (req, res) => {
  const field = { _id: req.params._id };
  const data = { $set: { liveTradesSheet: req.body } };
  userData.findByIdAndUpdate(field, data, { new: true }, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
});

// RETRIEVE
router.get("/retrieve-live-trades-sheet/:_id", (req, res) => {
  userData
    .findById(req.params._id)
    .then(data => {
      const payload = data;
      console.log("data['liveTradesSheet'] is", data['liveTradesSheet']);
      // console.log('typeof(data)', typeof(data));
      res.status(200).json(payload);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// UPDATE
router.put("/update-live-trades-sheet/:_id", (req, res) => {
  const field = { _id: req.params._id };
  const data = { $push: { liveTradesSheet: req.body } };
  userData.findByIdAndUpdate(field, data, { new: true }, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
});


router.put("/refresh/:_id", (req, res) => {
  const field = { _id: req.params._id };
  const data = { $set: { liveTradesSheet: req.body } };
  userData.findByIdAndUpdate(field, data, { new: true }, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
});



// DELETE
router.delete("/delete-live-trades-sheet/:_id", (req, res) => {
  const field = { _id: req.params._id };
  const data = { liveTradesSheet: [] };
  userData.findByIdAndRemove(field, data, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
});

router.patch("/delete-live-trades-sheet/:_id/:ticker", (req, res) => {
  const localTicker = String(req.params.ticker);
  console.log('local ticker is', localTicker);
  console.log('type of localTicker is', typeof(localTicker));
  const field = { _id: req.params._id }
  userData.findByIdAndUpdate(
    field,
    { $pull: { "liveTradesSheet": { "Ticker": localTicker } } },
    (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).json(data);
    }
  );
});

router.post("/delete-live-trades-sheet/:_id/:ticker", (req, res) => {
  const field = { _id: req.params._id };
  const data = { $pull: { liveTradesSheet: { Ticker: [req.params.ticker] } } };
  userData.findByIdAndRemove(field, data, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
});

module.exports = router;
