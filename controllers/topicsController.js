const express = require('express');
const router  = express.Router();
const Topic   = require('../models/topic');
const User    = require('../models/user');

// index
router.get('/', async (req, res) => {
    
    try {
        if(req.userId) {
            const foundUser       = await User.findById(req.userId);
            const foundUserTopics = foundUser.topics;
            res.json({
                status:     200,
                username:   foundUser.username,
                data:       foundUserTopics
            }) 
        } else {
            const allTopics = await Topic.find();
            res.json({
                status: 200,
                data:   allTopics
            })
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// show
router.get('/:id', async (req, res) => {
    try {
        if(req.userId) {
            const foundUser      = await User.findById(req.userId);
            const foundUserTopic = foundUser.topics.id(req.params.id);
            res.json({
                status: 200,
                user:   foundUser.username,
                topic:  foundUserTopic
            })
        } else {
            const foundTopic = await Topic.findById(req.params.id);
            res.json({
                stauts: 200,
                topic:  foundTopic
            })
        }
  
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// create
router.post('/', async (req, res) => {
    const topicDbEntry   = {};
    topicDbEntry.title   = req.body.title;
    topicDbEntry.writer  = req.body.writer;
    topicDbEntry.date    = req.body.date;

    try {
        const topicExists  = await Topic.findOne({'title': topicDbEntry.title});  
        if( !topicExists && (topicDbEntry.title != '') ){
            if(req.session.logged) {
                const loggedUser   = await User.findById(req.session.userId);
                const createdTopic = await Topic.create(topicDbEntry);
                loggedUser.topics.push(createdTopic);
                await loggedUser.save();
                res.json({
                    status:   200,
                    topic:    createdTopic,
                    username: loggedUser.username,
                    data:     'successful'
                })
            } else {
                req.session.message = 'You did not logged in';
                res.json({
                    status:  400,
                    message: req.session.message
                })
            }
        } else {
            console.log('Topic Exists.');
            req.session.message = 'Topic already exists or title field is empty.';
            res.json({
                status:  400,
                message: req.session.message
            })
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
            if(req.body.title != '') {
                const updatedTopic           = await Topic.findByIdAndUpdate(req.params.id, req.body, {new: true});
                const foundUsers             = await User.find({});
                
                for ( const user of foundUsers) {
                    if(user.topics.id(req.params.id)){
                        user.topics.id(req.params.id).remove();
                        user.topics.push(updatedTopic);
                        await user.save();
                    }     
                };
                res.json({
                    status: 200,
                    data:   'successful'
                })
            } else {
                throw new Error('Title field is empty');
            }
        } else {
            throw new Error('You did not log in.');
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
            const foundUsers      = await User.find({});

            for(const user of foundUsers) {
                if(user.topics.id(req.params.id)) {
                    user.topics.id(req.params.id).remove();
                    await user.save();
                    res.json({
                        status:       200,
                        data:         'successful',
                        deletedTopic: deletedTopic
                    })
                }
            }
        } else {
            throw new Error('You did not log in');
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

module.exports = router;