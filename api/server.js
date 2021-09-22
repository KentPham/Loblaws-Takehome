'use strict'

//  Initialize required packages
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');

//  Get Url and port information
const { URL, PORT } = require('./utils/constants');

//  Hook in routing code for each collection
const { router: productRouter } = require('./routes/products/productRoutes');
const { router: orderRouter } = require('./routes/orders/orderRoutes');

const router = express();

//  Set parsing methods
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//  Create generic endpoints for collections
router.use('/api/products', productRouter);
router.use('/api/orders', orderRouter);

//  Create and Launch Server
const server = http.createServer(router);

mongoose
    .connect(URL, { useNewUrlParser: true })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
        })
    })
    .catch((err) => console.log(err.message));