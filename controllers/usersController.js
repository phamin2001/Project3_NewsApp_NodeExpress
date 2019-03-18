const express   = require('express');
const router    = express.Router();
const bcrypt    = require('bcryptjs');
const User      = require('../models/user');

// create
router.post('/', async (req, res) => {
    const password       = req.body.password;
    console.log(password, 'password');
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const userDbEntry        = {};
    userDbEntry.username     = req.body.username;
    userDbEntry.password     = hashedPassword;
    userDbEntry.email        = req.body.email;
    userDbEntry.displayName  = req.body.displayName;

    try {
        const userExists      = await User.findOne({'username': userDbEntry.username});
        if(!userExists) {
            const createdUser    = await User.create(userDbEntry);
            req.session.message  = '';
            req.session.username = createdUser.username;
            req.session.userId   = createdUser._id;
            req.session.logged   = true;

            res.json({
                status:     200,
                data:       'successful',
                username:   req.session.username,
                userId:     req.session.userId
            })
        } else {
            console.log('User Exists.');
            req.session.message = "User aleready exists, make another account.";
            res.json({
                status:   400, 
                message:  req.session.message
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
        const foundUser = await User.findById(req.session.userId);
        res.json({
            status: 200, 
            username:        foundUser.username,
            userId:          foundUser._id,
            userEmail:       foundUser.email,
            userDisplayName: foundUser.displayName
        })
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// update
router.put('/:id/', async (req, res) => {
    try {
        if(req.session.userId === req.params.id) {
            const updatedUser = await User.findByIdAndUpdate(req.session.userId, req.body, {new: true});
            res.send({
                status: 200,
                username:        updatedUser.username,
                userId:          updatedUser._id,
                userEmail:       updatedUser.email,
                userDisplayName: updatedUser.displayName
            })
        } else {
            // console.log('ERROR');
           throw new Error('You are not authorized');
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// delete
router.delete('/:id', async (req, res) => {
    try {
        if(req.session.userId === req.params.id) {
            const deletedUser = await User.findByIdAndDelete(req.session.userId);
            res.json({
                status: 200, 
                username:        deletedUser.username,
                userId:          deletedUser._id,
                userEmail:       deletedUser.email,
                userDisplayName: deletedUser.displayName
            })
        } else {
            throw new Error('You are not authorized.');
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

module. exports = router; 