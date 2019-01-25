
const mongoose = require('mongoose');
const formidable = require('formidable');
const Image = require('../models/imageSchema');;
let ObjectId = mongoose.ObjectId;

function addImage(req, res) {
  let form = formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      return;
    }
    let imageUrl = fields.imageUrl;
    let description = fields.description;
    let title = fields.imageTitle;

    let tags = fields.tagsID.split(',').reduce((arr, curVal) => {
      if (arr.includes(curVal) || curVal.length === 0) {
        return arr;
      } else {
        arr.push(curVal);
        return arr;
      }
    }, []);


    Image
      .create({
        url: imageUrl,
        description: description,
        title: title,
        tags: tags
      })
      .then(() => {
        res.writeHead(302, {
          location: '/'
        });
        res.end();
      })
      .catch((err) => {
        console.log(err.errors);
      });

  });
}

function deleteImg(req, res) {
  let removeId = req.pathquery.id;


  Image.remove({ _id: `${removeId}` }, function (err) {
    if (err) {
      console.log(err);
      return;
    }
  }).then(() => {
    res.writeHead(302, {
      location: '/search'
    });
    res.end();
  }).catch((err) => {
    console.log(err.errors);
  });


}


module.exports = (req, res) => {
  if (req.pathname === '/addImage' && req.method === 'POST') {
    addImage(req, res);
  } else if (req.pathname === '/delete' && req.method === 'GET') {
    deleteImg(req, res);
  } else {
    return true;
  }
};


