const mongoose = require('mongoose');

const mongoDb = 'mongodb://localhost:27017/mongoplayground';

module.exports = () => {
    mongoose.connect(mongoDb);
};