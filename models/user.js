const mongoose = require('mongoose');
const Topic    = require('./topic');

const UserSchema = new mongoose.Schema({
    username:       {type: String, required: true, unique: true},
    password:       {type: String, required: true},
    email:          {type: String},
    displayName:    {type: String},
    topics:         [Topic.schema]
});

module.exports = mongoose.model('User', UserSchema);