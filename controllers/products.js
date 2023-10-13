/* This code is defining a router for handling various HTTP requests related to products. It uses the
Express framework and the `express.Router()` function to create the router object. */
const express   = require('express');
let router      = express.Router();
const Products  = require('../models/products');
const flash = require('connect-flash');

router.use(flash());


// /Products 

// get all
router.get('/', async (req, res) =>{
    try {
        const products = await Products.find({});
        const successMessage = req.flash('success'); 
        res.render('products/index', { products, successMessage });
    } catch (error) {
            res.status(500).send(error);
    }
});

// findById
router.get('/get/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Products.findById({id: id}).exec();
        if (product) {
            res.send(product);
          } else {
            res.send('Produit introuvable');
          }
    } catch (error) {  
        res.status(500).send(error);
    }
});

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Products.findOneAndDelete({id: id});
        if (product) {
            res.send(product);
        }
        else {
            res.send('impossible de supprimer le produit');
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/update/:id', async  (req, res) => {
    const { id } = req.params;
    try {
        const product = await Products.findById(id).exec();
        res.render('products/update', { product });
    } catch (error) {
        res.status(500).send(error);
    }
  });

  router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, description, image } = req.body;
  
    try {
      const product = await Products.findByIdAndUpdate(id, {
        name: name,
        category: category,
        description: description,
        image: image,
      }, { new: true });
      if (product) {
        res.send(product);
      } else {
        res.status(404).send("Produit introuvable.");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });
  

router.get('/add', (req, res) => {
    res.render('products/addProduct');
  });

// create
router.post('/add', async (req, res) => {
    const { name, category, description, image } = req.body;
    try {
        const product = new Products({ name, category, description, image });
        await product.save();
        //res.send(product);
        req.flash('success', 'Produit créé avec succès');
        res.redirect('/products');
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;

// router.use('/products' routeProd);

// const routeProd = require('./products')