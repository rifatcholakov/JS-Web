const fs = require('fs')
const path = require('path')
const Product = require('../models/Product')
const Category = require('../models/Category')

module.exports.addGet  = (req,res) => {
  Category.find().then((categories) => {
    res.render('product/add', {categories: categories})
  })
}

module.exports.addPost = async (req, res) => {
  let productObj = req.body
  productObj.image = '/' + req.file.path;
  productObj.createor = req.user._id;

  let product = await Product.create(productObj);
  let category = await Category.findById(product.category);
  category.products.push(product._id);
  category.save();
  res.redirect('/');
}

module.exports.editGet = (req, res) => {
  let id = req.params.id;
  Product.findById(id).then(product => {
    if(!product || product.buyer == null) {
      res.sendStatus('404');
      return;
    }

    if(!product.creator.equals(req.user._id) &&
        req.user.roles.indexOf('Admin') < 0){
        res.sendStatus('401')
    }

    Category.find().then((categories) => {

      res.render('product/edit', {
        product: product,
        categories: categories
      })
    })
  })
}

module.exports.editPost = async (req, res) => {
  let id = req.params.id;
  let editedProduct = req.body;

  let product = await Product.findById(id);

  if(!product.creator.equals(req.user._id) &&
      req.user.roles.indexOf('Admin') < 0){
      res.sendStatus('401')
  }

  if(!product || product.buyer == null){
    res.redirect(`/?error=${encodeURIComponent('Product was not found!')}`);
    return;
  }

  product.name = editedProduct.name;
  product.description = editedProduct.description;
  product.price = editedProduct.price;

  if(req.file) {
    product.image = '/' + req.file.path;
  }

  product.save().then(() =>{
    res.redirect(`/?success=${encodeURIComponent('Component was edited successfully!')}`);
  })

  if(product.category.toString() !== editedProduct.category){
    Category.findById(product.category).then((currentCategory) => {
      Category.findById(editedProduct.category).then((nextCategory) => {
        let index = currentCategory.products.indexOf(product._id);

        if(index >= 0){
          currentCategory.products.splice(index, 1);
        }
        currentCategory.save();

        nextCategory.products.push(product._id);
        nextCategory.save();

        product.category = editedProduct.category;

        product.save().then(() => {
          res.redirect(
            '/?success=' + encodeURIComponent('Product was edited successfully!')
          )
        })
      })
    })
  } else {
    product.save().then(() =>{
      res.redirect(
        '/?success=' + encodeURIComponent('Product was edited successfully!')
      )
    })
  }
}

module.exports.deleteGet = (req, res) => {
  let id = req.params.id

  Product.findById(id).then((product) => {
    if(!product || product.buyer == null) {
      res.sendStatus(404);
      return;
    }
    if(!product.creator.equals(req.user._id) &&
        req.user.roles.indexOf('Admin') < 0){
        res.sendStatus('401')
    }
    Category.find().then((categories) => {
      res.render('product/delete', {
        product: product,
        categories: categories
      })
    })
  })
}

module.exports.deletePost = (req, res) => {
  let productId = req.params.id;

  Product.findById(productId).then((product) =>{
    if(!product || product.buyer == null){
      res.redirect(`/?error=${encodeURIComponent('Product was not found!')}`)
      return;
    }

    if(!product.creator.equals(req.user._id) &&
        req.user.roles.indexOf('Admin') < 0){
        res.sendStatus('401')
    }

    let image = product.image;
    let categories = product.categories;

    for(let categoryId of categories){
      Category.findById(categoryId).then((category) => {
        category.products.remove(productId);
      })
    }

    fs.unlink(image, (err)=>{
      console.log(err);
    })

    Product.findByIdAndRemove(productId);
  })
}

module.exports.buyGet = (req, res) => {
  let id = req.params.id;

  Product.findById(id).then((product) => {
    if(!product) {
      res.sendStatus(404);
      return;
    }

    Category.find().then((categories) => {
      res.render('product/buy', {
        product: product,
        categories: categories
      })
    })
  })
}

module.exports.buyPost = (req, res) => {
  let productId = req.params.id

  Product.findById(productId).then(product => {
    if(product.buyer) {
      let error = `error=${encodeURIComponent('Product was already bought!')}`
      res.redirect(`/?${error}`)
      return;
    }

    product.buyer = req.user._id
    product.save().then(() => {
      req.user.boughtProducts.push(productId);
      req.user.save().then(() => {
        res.redirect('/')
      })
    })
  })
}
