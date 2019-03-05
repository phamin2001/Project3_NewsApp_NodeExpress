const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title:      {type:String, required: true}, 
    content:    {type: String, required: true},
    writers:    [{type: String, required: true}],
    date:       {type: Date}
})

module.exports = mongoose.model('NewsCollection', newsSchema);