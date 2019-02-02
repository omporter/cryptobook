const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const keys = require('../../config/keys');
const userData = require('../../models/UserData');



router.put('/update-content/:_id', (req, res) => {
    // @route   POST api/content/update-content/:id/
    // @desc    Test
    // @access  Public 
    const id = req.params._id;
    userData.updateOne(
        {_id: id},
        {$set: {
            content: req.body.newContent
        }}
    )
    .then( result => {
        res.status(200).json({result});
    })
    .catch(err => {
        res.status(404).json(err);
        console.log('err:', err)
    });
});


module.exports = router;
