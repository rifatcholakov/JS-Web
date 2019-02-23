const fs = require('fs')
const path = require('path')
const url = require('url')


function getContentType(url){
  let startOfExt = url.lastIndexOf('.') +1;
  let fileExt = url.slice(startOfExt, url.length);
  let contentTypes = JSON.parse(fs.readFileSync(__dirname + '/../config/content-types.json'));

  let contentType = contentTypes[fileExt];

  return contentType;
}

module.exports = (req,res) =>{
  req.pathname = req.pathname || url.parse(req.url).pathname
  if(req.pathname.startsWith('/content/') && req.method === 'GET'){
    let filePath = path.normalize(
      path.join(__dirname, '..'+req.pathname));
      fs.readFile(filePath, (err, data) => {
        if(err) {
          res.writeHead(404, {
            'Content-Type':'text/plain'
          });

          res.write('Resource not found!')
          res.end();
          return;
        }

        res.writeHead(200, {
          'Content-Type': getContentType(req.pathname)
        })

        res.write(data);
        res.end();
        return;
      })
  } else {
    return true;
  }
}
