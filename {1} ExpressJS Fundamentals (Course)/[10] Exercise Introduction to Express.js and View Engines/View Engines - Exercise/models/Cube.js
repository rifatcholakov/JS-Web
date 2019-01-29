const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const cubeSchema = new Schema({
  name:{
    type: String,
    validate: {
      validator: function (name){
        let length = name.length;
        return length >= 3 && length <= 15
      },
      message: 'Name must be between 3 and 15 symbols!'
    }
  },
  description: {
    type: String,
    validate: {
      validator: function (description){
        let length = description.length;
        return length >= 20 && length <= 300
      },
      message: 'Description must be between 20 and 300 symbols!'
    }
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function(image) {
        let regex = '^https:\/\/.*\.(png|jpg)$';
        return new RegExp(regex).test(image);
      },
      message: 'Image URL must start with https://'
    }
  },
  difficulty: {
    type: Number,
    validate: {
      validator: function (difficulty){
        return difficulty >= 1 && difficulty <= 6
      },
      message: 'Difficulty should be between 1 aand 6!'
    }
  }
})

const Cube = mongoose.model('Cube', cubeSchema);

module.exports = Cube;
