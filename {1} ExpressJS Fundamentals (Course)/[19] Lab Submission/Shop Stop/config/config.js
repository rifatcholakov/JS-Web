const path = require('path')

module.exports = {
  development: {
    connectionString: 'mongodb://admin:abc123@ds213645.mlab.com:13645/expressj_lab',
    rootPath: path.normalize(path.join(__dirname, '../'))
  },
  production: {

  }
}
