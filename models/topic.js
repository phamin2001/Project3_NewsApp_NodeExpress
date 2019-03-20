const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    title:      {type: String, required: true},
    writer:     {type: String},
    date:       {type: Date}
});

module.exports = mongoose.model('Topic', TopicSchema);