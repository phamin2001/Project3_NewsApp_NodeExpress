const express = require('express');
const router  = express.Router();
const Topic   = require('../models/topic');
const User    = require('../models/user');

// index
router.get('/', async (req, res) => {
    try {
        const allTopics = await Topic.find();
        res.json({
            status: 200,
            data: allTopics
        })
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// show
router.get('/:id', async (req, res) => {
    try {
        const foundTopic = await Topic.findById(req.params.id);
        res.json({
            stauts: 200,
            topic:  foundTopic
        })
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// create
router.post('/', async (req, res) => {
    try {
        if(req.session.logged) {
            const loggedUser    = await User.findById(req.session.userId);
            const createdTopic  = await Topic.create(req.body);
            loggedUser.topics.push(createdTopic);
            await loggedUser.save();
            res.json({
                status: 200,
                data: 'successful'
            });
        } else {
            throw new Error('You didnot log in.');
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// update // waiting for help 
router.put('/:id', async (req, res) => {
    try {
        if(req.session.logged) {
            const updatedTopic  = await Topic.findByIdAndUpdate(req.params.id, req.body, {new: true});
            const foundUsers    = await User.findOne({'topics._id': req.params.id});

            foundUsers.topics.id(req.params.id).remove();
            foundUsers.topics.push(updatedTopic);
            await foundUsers.save();
            res.json({
                status: 200,
                data:   'successful'
            })
        } else {
            throw new Error('You didnot log in.');
        }
    } catch (err) {
        console.log(err);
        res.send(err);    
    }
});

// delete
router.delete('/:id', async (req, res) => {
    try {
        if(req.session.logged) {
            const deletedTopic    = await Topic.findByIdAndDelete(req.params.id);
            const foundUser       = await User.findOne({'topics._id': req.params.id});

            foundUser.topics.id(req.params.id).remove();
            await foundUser.save();
            
            res.json({
                status: 200,
                data: 'successful'
            })
        } else {
            throw new Error('You didnot log in');
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

module.exports = router;