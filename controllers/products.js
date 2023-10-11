/* This code is defining a router for handling various HTTP requests related to products. It uses the
Express framework and the `express.Router()` function to create the router object. */
const express   = require('express');
let router      = express.Router();
const Products  = require('../models/products');


// /Products 

// get all
router.get('/', async (req, res) =>{
    try {
        const products = await Products.find({});
        res.send(products);
    }   catch (error) {
            res.status(500).send(error);
    }
});

// findById
router.get('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, description, image } = req.body;
    try {
        const product = await Products.findByIdAndUpdate(id,
            { name: name },
            { category: category },
            { description: description },
            { image: image },
        );

        if (product) {
            res.send(product);
        } else {
            res.status(404).send("Produit introuvable.");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// create
router.post('/', async (req, res) => {
    const { name, category, description, image } = req.body;
    try {
        const product = new Products({ name, category, description, image });
        await product.save();
        res.send(product);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;

// router.use('/products' routeProd);

// const routeProd = require('./products')