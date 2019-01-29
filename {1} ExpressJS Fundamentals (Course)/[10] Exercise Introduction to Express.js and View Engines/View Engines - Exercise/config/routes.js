
const {homeGet, aboutGet,search} = require('../controllers/home')
const {addCubePageGet, addCubePost, details} = require('../controllers/cube')

module.exports = app => {
    app.get('/', homeGet);
    app.get('/about', aboutGet);
    app.get('/search', search);
    
    app.get('/create', addCubePageGet);
    app.post('/create', addCubePost)
    app.get('/details/:id', details)
};
