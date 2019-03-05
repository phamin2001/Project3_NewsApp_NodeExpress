const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/newsProject', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose is cennected');
});

mongoose.connection.on('error', (err) => {
    console.log(err, 'mongoose failed to connect');
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose is disconnected');
});