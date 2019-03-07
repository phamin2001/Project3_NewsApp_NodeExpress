const express   = require('express');
const router    = express.Router();
const User      = require('../models/user');
const bcrypt    = require('bcryptjs');

router.post('/registration', async (req, res) => {
    const password       = req.body.password;
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const userDbEntry        = {};
    userDbEntry.username     = req.session.username;
    userDbEntry.password     = hashedPassword;
    userDbEntry.email        = req.session.email;
    userDbEntry.displayName  = req.session.displayName;

    try {
        const userExists      = await User.findOne({'username': userDbEntry.username});
        if(!userExists) {
            const createdUser    = await User.create(userDbEntry);
            req.session.message  = '';
            req.session.username = createdUser.username;
            req.session.logged   = true;

            res.json({
                status:     200,
                data:       'register successful',
                username:   req.session.username
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

router.post('/login', async (req, res) => {
    try {
       const foundUser = await User.find({username: req.body.username}) ;
       if(foundUser) {
           if(bcrypt.compareSync(req.body.password, foundUser.password)) {
               req.session.message  = '';
               req.session.username = foundUser.username;
               req.session.userId   = foundUser._id;
               req.session.logged   = true

               res.json({
                   status:   200,
                   data:     'login successful',
                   username: req.session.username,
                   message:  req.session.message

               });
           } else {
               req.session.message = 'Username or Password are incorrect. Try againe.';
               res.json({
                status:     401,
                data:       'login unsuccessful',
                message:    req.session.message
               })
           }
       } else {
           req.session.message = 'Username or Password are incoret. Try againe.';
           res.json({
               status:  404,
               data:    'login unsuccessful',
               message: req.session.message
           })
       }
    } catch (err) {
        console.log('err');
        res.send(err);    
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            res.send(err);
        } else {
            res.json({
                status: 200,
                data:   'logout successful'
            })
        }
    })
});

module.exports = router