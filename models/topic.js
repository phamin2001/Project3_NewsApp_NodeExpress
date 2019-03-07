const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    title:      {type: String, required: true},
    data:       {type: Date},
    writer:     {type: String}
})

module.exports = mongoose.model('Topic', TopicSchema);