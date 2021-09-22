const express = require('express');
const router = express.Router();
const orderService = require('./orderServices');

//  List all orders endpoint
router.route('/')
    .get(async (req, res, next) => {
        try {
            const response = await orderService.listOrders();
            res.status(200).send({
                data: response
            })
        } catch (e) {
            next(e);
        }
    })

//  Get order by id endpoint
router.route('/:id')
    .get(async (req, res, next) => {
        try {
            const response = await orderService.getOrder(req.params.id);
            if (typeof response === 'object') {
                res.status(200).send(response);
            } else {
                res.status(400).send(response);
            }
        } catch (e) {
            next(e);
        }
    })

//  Get products from an order by order id endpoint
router.route('/getProducts/:id')
    .get(async (req, res, next) => {
        try {
            const response = await orderService.getProducts(req.params.id);
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
    })

/*
  Add a product to an order by order id endpoint
  Endpoint works for adding an existing product
  or a new product to an order
*/ 
router.route('/addProduct/:id')
    .patch(async (req, res, next) => {
        try {
            const response = await orderService.addProductToOrder(req.params.id, req.body);
            if (response === "Product was added to order") {
                res.status(200).send(response);
            } else {
                res.status(400).send(response);
            }
        } catch (e) {
            next(e);
        }
    })

//  Remove a product to an order by order id endpoint
router.route('/removeProduct/:id')
    .patch(async (req, res, next) => {
        try {
            const response = await orderService.removeProductFromOrder(req.params.id, req.body);
            if (response === "Specified amount has been removed from order") {
                res.status(200).send(response);
            } else {
                res.status(400).send(response);
            }
        } catch (e) {
            next(e);
        }
    })

//  Get Subtotal, tax total, and final total of order endpoint
router.route('/getPrice/:id')
    .get(async (req, res, next) => {
        try {
            let response = await orderService.getPrice(req.params.id); //  Get total listed price of products
            if (typeof response === 'object') {
                res.status(200).send(response);
            } else {
                res.status(400).send(response);
            }
        } catch (e) {
            next(e);
        }
    })

//  Create a new order endpoint
router.route('/new')
    .post(async (req, res, next) => {
        try {
            const response = await orderService.newOrder(req.body)
            //res.status(201).send(order);
            if (typeof response === 'object') {
                res.status(201).send(response);
            } else {
                res.status(400).send(response);
            }
        } catch (e) {
            next(e);
        }
    })

exports.router = router;