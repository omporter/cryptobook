// // @route   POST api/user-data/testpost
// // @desc    Test
// // @access  Public 
// router.post('/init', (req, res) => {
//     const test = new userData({
//         // _id: new mongoose.Types.ObjectId(),
//         title: req.body.title,
//         content: req.body.content,
//         portfolioSheet: {
//             token: req.body.portfolioSheet.token,
//             ticker: req.body.portfolioSheet.ticker,
//             coinPriceBtc: req.body.portfolioSheet.coinPriceBtc,
//             coinPriceUsd: req.body.portfolioSheet.coinPriceUsd,
//             holdings: req.body.portfolioSheet.holdings,
//             totalBtc: req.body.portfolioSheet.totalBtc,
//             totalUsd: req.body.portfolioSheet.totalUsd,
//             percentOfTotalPortfolio: req.body.portfolioSheet.percentOfTotalPortfolio
//         }, 
//         liveTradesSheet: {
//             tradeIds: req.body.portfolioSheet.tradeId,
//             coins: req.body.portfolioSheet.coin
//         }
//     });
//     test.save()
//     .then( result => {
//         res.status(200).json(result);
//     })
//     .catch(err => {
//         res.status(404).json(err);
//         console.log('err:', err)
//     });
// });