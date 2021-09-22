const express = require('express');
const router = express.Router();
const productService = require('./productServices');

//List all products endpoint
router.route('/')
    .get(async (req, res, next) => {
        try {
            const response = await productService.listProducts();
            res.status(200).send({
                data: response
            });
        } catch (e) {
            next(e);
        }
    });

/* Id routes start */

//Get product by id endpoint
router.route('/:id')
    .get(async (req, res, next) => {
        try{
            const response = await productService.getProductById(req.params.id);
            if (Array.isArray(response)) {
                res.status(200).send({
                    data: response
                });
            } else {
                res.status(400).send(response);
            }
        } catch (e) {
            next(e);
        }
    });

//Delete product by id endpoint 
router.route('/delete/:id')
    .delete(async (req, res, next) => {
        try {
            const response = await productService.deleteProductById(req.params.id);
            if (response === "Product Deleted") {
                res.status(200).send(response);
            } else {
                res.status(400).send(response);
            }
        } catch (e) {
            next(e);
        }
    });

//Update product by id endpoint
router.route('/update/:id')
    .patch(async (req, res, next) => {
        try {
            const response = await productService.updateProductById(req.params.id, req.body);
            if (response === "Product Updated") {
                res.status(200).send(response);
            } else {
                res.status(400).send(response);
            }
        } catch (e) {
            next(e);
        }
    });
/* Id routes end */

/* Upc routes start */

//Find product by upc endpoint
router.route('/upc/:upc')
    .get(async (req, res, next) => {
        try {
            const response = await productService.getProductByUpc(req.params.upc);
            if (typeof response === 'object') {
                res.status(200).send(response);
            } else {
                res.status(400).send("Product not found");
            }
        } catch (e) {
            next(e);
        }
    });

//Delete product by upc endpoint
router.route('/delete/upc/:upc')
    .delete(async (req, res, next) => {
        try {
            const response = await productService.deleteProductByUpc(req.params.upc);
            if (response === "Product Deleted") {
                res.status(200).send(response);
            } else {
                res.status(400).send(response);
            }
        } catch (e) {
            next(e);
        }
    })

//Update product by upc endpoint
router.route('/update/upc/:upc')
    .patch(async (req, res, next) => {
        try {
            const response = await productService.updateProductByUpc(req.params.upc, req.body);
            if (response === "Product Updated") {
                res.status(200).send(response);
            } else {
                res.status(400).send(response);
            }
        } catch (e) {
            next(e);
        }
    })
/* Upc routes end */

exports.router = router;