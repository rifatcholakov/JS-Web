const path = require('path');

module.exports = {
    development: {
        rootFolder: path.normalize(path.join(__dirname, '/../')),
        connectionString: 'mongodb://root:root123@ds223015.mlab.com:23015/softuni_blog'
    },
    production: {}
};
