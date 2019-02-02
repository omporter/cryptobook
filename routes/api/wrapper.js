const express = require("express");
const router = express.Router();
const rp = require("request-promise");
const wrapperApiKey = require("../../config/wrapperApiKey"); // turns out you don't need to add the API key for it to work. 


router.get("/:ticker", (req, res) => {
  // documentation https://min-api.cryptocompare.com/documentation
  const url = 'https://min-api.cryptocompare.com/data/price?fsym=' + req.params.ticker + '&tsyms=USD,BTC'
  rp(url).then(response => {
    console.log('API call response:', response);
    res.status(200).json(response);
  }).catch((err) => {
    console.log('API call error:', err.message);
    res.status(400).json(err);
  });
});

module.exports = router;
