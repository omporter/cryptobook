const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const keys = require('../../config/keys');
const Test = require('../../models/TestModel');


// @route   GET api/test
// @desc    Tests users route
// @access  Public 
router.get('/', (req, res) => {
    res.json({
        msg: "Users Works"
    })
});

// @route   GET api/test/1
// @desc    Tests users route
// @access  Public 
router.get('/1', (req, res) => {
    res.json({
        msg: "first test",
        msg2: 'second test'
    })
});

// @route   GET api/test/testpost
// @desc    Test
// @access  Public 
router.post('/testpost', (req, res) => {
    const test = new Test({
        // _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        content: req.body.content
    });
    test.save()
    .then( result => {
        res.status(200).json(result);
    })
    .catch(err => {
        res.status(404).json(err);
        console.log('err:', err)
    });
});




module.exports = router;

