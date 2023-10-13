/* This code is defining a router for handling various HTTP requests related to products. It uses the
Express framework and the `express.Router()` function to create the router object. */
const express   = require('express');
let router      = express.Router();
const Products  = require('../models/products');
const flash     = require('connect-flash');

router.use(flash());

const isAdmin = (req, res, next) => {
    if(req.session && req.session.user && req.session.user.access === 'admin'){
        next()
    } else {
        res.status(403).send('Acces refusé');
    }
}


// /Products 

// get all
router.get('/', async (req, res) =>{
    try {
      const user = req.session.user;
        const products = await Products.find({});
        const message = req.flash(); 
        res.render('products/index', { products, message, user });
    } catch (error) {
        res.status(500).send(error);
    }
});

  
// findById
router.get('/detail/:id', async (req, res) => {
    const { id } = req.params;
    const user = req.session.user;
    try {
        const product = await Products.findById({_id: id}).exec();
        if (product) {
            res.render('products/detail', { product, user }); 
          } else {
            req.flash('error', 'Produit introuvable');
            res.status(404).send("Produit introuvable.");
            res.redirect('/products');
          }
    } catch (error) {  
        res.status(500).send(error);
    }
});

router.delete('/delete/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    
    try {
      const product = await Products.findOneAndDelete({ _id: id });
      if (product) {
        req.flash('success', 'Produit supprimé avec succès');
        res.redirect('/products');
        
      } else {
        req.flash('error', 'Impossible de supprimer le produit');
        res.redirect('/products');
      }
    } catch (error) {
      req.flash('error', 'Une erreur s\'est produite lors de la suppression du produit');
      res.status(500).send(error);
    }
  });
  
  router.get('/update/:id',isAdmin, async  (req, res) => {
    const { id } = req.params;
    const user = req.session.user;
    try {
        const product = await Products.findById(id).exec();
        res.render('products/update', { product, user });
    } catch (error) {
        res.status(500).send(error);
    }
  });

  router.put('/update/:id', isAdmin, async (req, res) => {
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
        
        // 
      } else {
        res.status(404).send("Produit introuvable.");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });  

router.get('/add', isAdmin, (req, res) => {
    res.render('products/addProduct');
  });

// create
router.post('/add', isAdmin, async (req, res) => {
    const { name, category, description, image } = req.body;
    try {
        const product = new Products({ name, category, description, image });
        await product.save();
        //res.send(product);
        req.flash('success', 'Le produit a été créé avec succès.');
        res.redirect('/products');
    } catch (error) {
        req.flash('error', 'Imposible de crée le produit');
        res.status(500).send(error);
    }
});

module.exports = router;