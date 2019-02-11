const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const keys = require("../../config/keys");
const userData = require("../../models/UserData");

// create
// router.post("/create-tickers-sheet/:ticker/:_id", (req, res) => {
//   userData
//     .findById(req.params._id)
//     .then(data => {
//       console.log(data);
//       const dataToAdd = {
//         [req.params.ticker]: {
//           BuySheet: {
//             buyId: req.body.buyId,
//             tradeId: req.body.tradeId,
//             complete: req.body.complete,
//             amount: req.body.amount,
//             coinPriceBtc: req.body.coinPriceBtc,
//             coinPriceUsd: req.body.coinPriceUsd,
//             totalBtc: req.body.totalBtc,
//             totalUsd: req.body.totalUsd,
//             date: req.body.date,
//             time: req.body.time,
//             exchange: req.body.exchange,
//             commissionPercent: req.body.commissionPercent,
//             commissionCostBtc: req.body.commissionCostBtc,
//             commissionCostUsd: req.body.commissionCostUsd,
//             targetSell: req.body.targetSell,
//             stopLoss: req.body.stopLoss,
//             riskRewardRatio: req.body.riskRewardRatio,
//             notes: req.body.notes
//           }
//         }
//       };
//       data.tickersSheets = dataToAdd;
//       return data.save();
//     })
//     .then(result => {
//       res.status(200).json(result);
//     })
//     .catch(err => {
//       res.status(400).json(err);
//     });
// });

// RETRIEVE

router.get("/retrieve-tickers-sheet/:_id/", (req, res) => {
  userData
    .findById(req.params._id)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// UPDATE
router.put("/update-tickers-sheet/:document/:_id", (req, res) => {
  const field = { _id: req.params._id };
  const data = { $push: { [req.params.document]: req.body } };
  userData.findByIdAndUpdate(field, data, { new: true }, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
});


// remove single document by buy id
router.patch("/removeBuyById/:_id/:location/:buyid", (req, res) => {
  const a = req.params.location; // BTCBuy
  const b = "buyId";
  const d = req.params.buyid; // BTCBuy2
  const field = { _id: req.params._id };
  const data = { $pull: { [a] : { [b]: d } } };
  userData.findByIdAndUpdate(field, data, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
});


// remove single document by match id
router.patch("/removeMatchById/:_id/:location/:matchid", (req, res) => {
  const a = req.params.location; // BTCBuy
  const b = "matchId";
  const d = req.params.matchid; // BTCBuy2
  const field = { _id: req.params._id };
  const data = { $pull: { [a] : { [b]: d } } };
  userData.findByIdAndUpdate(field, data, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
});







// router.post("/update-tickers-sheet/:ticker/buy-sheet/:_id/", (req, res) => {
//     userData
//     .findById(req.params._id)
//     .then(data => {
//       const coreObj = {
//         token: req.body.token,
//         ticker: req.body.ticker,
//         buyId: req.body.buyId,
//         tradeId: req.body.tradeId,
//         complete: req.body.complete,
//         amount: req.body.amount,
//         priceBtc: req.body.priceBtc,
//         priceUsd: req.body.priceUsd,
//         totalBtc: req.body.totalBtc,
//         totalUsd: req.body.totalUsd,
//         date: req.body.date,
//         time: req.body.time,
//         exchange: req.body.exchange,
//         commissionPercent: req.body.commissionPercent,
//         commissionCostBtc: req.body.commissionCostBtc,
//         commissionCostUsd: req.body.commissionCostUsd,
//         targetSell: req.body.targetSell,
//         stopLoss: req.body.stopLoss,
//         riskRewardRatio: req.body.riskRewardRatio,
//         notes: req.body.notes
//       };

//       for (i in data.tickersSheets[0]) {
//           console.log(i)
//       }

//       if (req.params.ticker in data.tickersSheets[0].inspect()){
//         console.log(data.tickersSheets[0].inspect()[req.params.ticker].BuySheet);
//         const dataToAdd = {
//             BuySheet: [coreObj]
//           };
//           data.tickersSheets[0].push(dataToAdd);
//           return data.save
//       } else {
//           console.log('not found');
//       }

//     //   if (req.params.ticker) {
//     //       console.log('req.params.ticker is:', req.params.ticker);
//         // const dataToAdd = {
//         //   BuySheet: [coreObj]
//         // };
//         // data.tickersSheets[0][req.params.ticker][0].BuySheet[0].push(dataToAdd);
//         // return data.save

//     //   } else (
//     //       console.log('fail')
//     //   )
//     })
//     .then(result => {
//       res.status(200).json(result);
//     })
//     .catch(err => {
//       res.status(400).json({'error': err});
//     });
// });

// DELETE

router.post("/delete-tickers-sheets/:_id/:method", (req, res) => {
  userData
    .findById(req.params._id)
    .then(data => {
      data.BTCBuy = req.body.emptyArray;
      return data.save();
    })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

module.exports = router;
