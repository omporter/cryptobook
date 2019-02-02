const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const keys = require('../../config/keys');
const userData = require('../../models/UserData');




router.post("/create-portfolio-sheet/:_id", (req, res) => {
    const field = { _id: req.params._id };
    const data = { $set: { portfolioSheet: req.body } };
    userData.findByIdAndUpdate(field, data, { new: true }, (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).json(data);
    });
  });


// router.post('/create-portfolio-sheet/:_id', (req, res) => {
//     userData.findById(req.params._id)
//     .then (data => {
//     const dataToAdd = {
//         token: req.body.token,
//         ticker: req.body.ticker,
//         coinPriceBtc: req.body.coinPriceBtc,
//         coinPriceUsd: req.body.coinPriceUsd,
//         holdings: req.body.holdings,
//         totalBtc: req.body.totalBtc,
//         totalUsd: req.body.totalUsd,
//         percentOfTotalPortfolio: req.body.percentOfTotalPortfolio
//     }
//     data.portfolioSheet = dataToAdd     
//     return data.save();
//     })
//     .then(result => {
//         res.status(200).json(result)
//     })
//     .catch(err => {
//         res.status(400).json(err)
//     });
// });


router.get('/retrieve-portfolio-sheet/:_id', (req, res) => {
    userData.findById(req.params._id)
    .then(data => {
        res.status(200).json(data)
    })
    .catch(err => {
        res.status(400).json(err)
    });
});



// UPDATE
router.put("/update-portfolio-sheet/:_id", (req, res) => {
    const field = { _id: req.params._id };
    const data = { $push: { portfolioSheet: req.body } };
    userData.findByIdAndUpdate(field, data, { new: true }, (err, data) => {
      if (err) return res.status(500).send(err);
      return res.status(200).json(data);
    });
  });

// router.post('/update-portfolio-sheet/:_id', (req, res) => {
//     userData.findById(req.params._id)
//     .then (data => {
//     const newData = {
//         token: req.body.token,
//         ticker: req.body.ticker,
//         coinPriceBtc: req.body.coinPriceBtc,
//         coinPriceUsd: req.body.coinPriceUsd,
//         holdings: req.body.holdings,
//         totalBtc: req.body.totalBtc,
//         totalUsd: req.body.totalUsd,
//         percentOfTotalPortfolio: req.body.percentOfTotalPortfolio
//     }
//     data.portfolioSheet.push(newData);
//     return data.save();
//     })
//     .then(result => {
//         res.status(200).json(result)
//     })
//     .catch(err => {
//         res.status(400).json(err)
//     });
// });


// // DELETE
// router.delete("/delete-portfolioSheet-sheet/:_id", (req, res) => {
//     const field = { _id: req.params._id };
//     const data = { portfolioSheet: [] };
//     userData.findByIdAndRemove(field, data, (err, data) => {
//       if (err) return res.status(500).send(err);
//       return res.status(200).json(data);
//     });
//   });



router.patch("/delete-portfolio-sheet/:_id", (req, res) => {
    const field = { _id: req.params._id }
    userData.findByIdAndUpdate(
      field,
      { $set: { "portfolioSheet": [] }},
      (err, data) => {
        if (err) return res.status(500).send(err);
        return res.status(200).json(data);
      }
    );
  });

// router.put('/update-portfolio/:_id', (req, res) => {
//     // @route   GET api/portfolioSheet/update-portfolio/:_id
//     // @desc    Test
//     // @access  Public 
//     userData.findOne(req.params.id)
//     .then(user => {
//         user.portfolioSheet.push(req.body);
//     })
//     .then(user => {
//         return user.save();
//     })
//     .then(data => {
//         res.status(200).json(data);
//     })
//     .catch(err => {
//         res.status(400).json(err);
//     });
// })


module.exports = router;
