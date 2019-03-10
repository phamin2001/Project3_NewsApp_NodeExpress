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
            const findLoggedUser             = User.findById(req.session.userId);
            const findCreatedTopic           = Topic.create(req.body);
            const [loggedUser, createdTopic] = await Promise.all([findLoggedUser, findCreatedTopic]);

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

// update
router.put('/:id', async (req, res) => {
    try {
        if(req.session.logged) {
            const updatedTopic           = await Topic.findByIdAndUpdate(req.params.id, req.body, {new: true});
            const foundUsers             = await User.find({});
            
            foundUsers.forEach ( (user) => {
                if(user.topics['topics._id'] === req.params.id){
                    user.topics.id(req.params.id).remove();
                    user.topics.push(updatedTopic);
                    await user.save();
                }     
            });
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
            const findDeletedTopic    = Topic.findByIdAndDelete(req.params.id);
            const findFoundUser       = User.findOne({'topics._id': req.params.id});
            const [deletedTopic, foundUser] = await Promise.all([findDeletedTopic, findFoundUser]);

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