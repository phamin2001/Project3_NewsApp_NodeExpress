const express = require('express');
const router  = express.Router();
const Topics  = require('../models/topic');
const User    = require('../models/user');


router.get('/', async (req, res) => {
    try {
        const allTopics = await Topics.find();
        res.json({
            status: 200,
            data: allTopics
        })
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

router.get('/new', async (req, res) => {
    try {
    
    } catch (err) {
        
    }
})

router.post('/', async (req, res) => {
    try {
        if(req.session.logged) {
            const createdTopic = await Topics.create(req.body);
            res.json({
                status: 200,
                data: createdTopic
            });
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

router.get('/new', async (req, res) => {


})

module.exports = router;