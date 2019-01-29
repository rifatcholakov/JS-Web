const Cube = require('../models/cube')

function handleErrors(err, res, cubeBody) {
  let errors = [];

  for(let property in err.errors){
    errors.push(err.errors[property].message)
  }

  res.locals.globalErrors = errors;
  res.render('create', cubeBody)
}

module.exports = {
  addCubePageGet: (req, res) => {
    res.render('create');
  },
  addCubePost: (req, res) => {
    let cubeBody = req.body;
    cubeBody.difficulty = Number(cubeBody.difficulty);

    Cube.create(cubeBody)
        .then((cube) => {
          res.redirect('/')
        })
        .catch(e => handleErrors(e, res, cubeBody));
  },
  details: (req, res) => {
    Cube.findById(req.params.id)
      .then(cube =>{
        console.log(cube);
          res.render('details', cube);
      })
      .catch(err => {handleErrors(err, res, cube)});
  }

}
