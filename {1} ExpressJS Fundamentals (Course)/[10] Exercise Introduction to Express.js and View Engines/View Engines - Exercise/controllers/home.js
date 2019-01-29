const Cube = require('../models/cube')

function handleQueryErrors(from, to){

  let fromNumber = Number(from);
  let toNumber = Number(to);
  let errors = [];

  if(from && (fromNumber < 1 || fromNumber > 6)){
    errors.push('From must be between 1 and 6.');
  }

  if(to && (toNumber < 1 || toNumber > 6)){
    errors.push('To must be between 1 and 6.');
  }

  if(from && to && fromNumber > toNumber) {
    errors.push('From must be lower than To.')
  }

  return errors;
}

module.exports = {
  homeGet: (req, res) => {
    Cube.find({})
      .select('id name imageUrl difficulty')
      .then((cubes) => {
        res.render('index', {cubes});
      })
      .catch(err => {
        console.log(err);
      })
  },
  aboutGet: (req, res) => {
    res.render('about');
  },
  search: (req,res) => {
    let {name, from, to} = req.query;

    let errors = handleQueryErrors(from, to);

    if(errors.length > 0){
      res.locals.globalErrors = errors;
      res.render('index');
    } else {
      let query = Cube.find({}).select('id name imageUrl difficulty');

      if(from){
        query.where('difficulty').gte(Number(from));
      }

      if(to){
        query.where('difficulty').lte(Number(to));
      }

      query.then((cubes) => {
        cubes = cubes.filter(cube =>
          cube.name.toLowerCase().includes(name.toLowerCase()));
        res.render('index', {cubes});
      })
      .catch(err => {
        console.log(err);
      })
    }
  }
}
