const mongoose = require('mongoose');
const Order = require('./orderModel');
const Product = require('../products/productModel');
const productService = require('../products/productServices');

exports.listOrders = async () => {
    try {
        const orders = await Order.find({});
        return orders;
    } catch (e) {
        throw e;
    }
}

exports.getOrder = async (orderId) => {
    try{
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return "Invalid id";
        }
        const order = await Order.findById(orderId);
        if (order === null) {
            return "Order not found";
        }
        return order;
    } catch (e) {
        throw e;
    }
}

exports.getProducts = async (orderId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return "Invalid id";
        }
        const order = await Order.findById(orderId);
        if (order === null) {
            return "Order not found";
        }
        const productIds = order.productId;
        const quantity = order.quantity;
        const products = [];
        for (let i = 0; i < productIds.length; i++) {
            let product = await Product.findById(productIds[i]);  //  Get product information from each product in order
            products.push({ _id: productIds[i], upc: product.upc, name: product.name, quantity: quantity[i] });  //  Push relevant information to array for output
        }
        return products;
    } catch (e) {
        throw e;
    }
}

exports.addProductToOrder = async (orderId, body) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return "Invalid id";
        }
        const order = await Order.findById(orderId);
        if (order === null) {
            return "Order not found";
        }
        if (!/^\d+$/.test(body.upc)) {
            return "Invalid upc code";
        }
        const productIds = order.productId;
        const productQuantity = order.quantity;
        let quantityUpdate = productQuantity;

        const productTarget = await Product.find({ upc: body.upc }).lean(); //  Find product that needs to be added to order
        if (productTarget.length === 0) {
            return "Upc does not exist";
        }
        let idTarget = String(productTarget[0]._id);  //  Find id of that product - use String() to take only the string portion

        const productIndex = productIds.findIndex((product) => product === idTarget);  //  Search order to see if the product is already part of the order

        if (productTarget[0].count > body.quantity) {  //  Check that there are enough products in stock before adding to order

            //  Remove products from stock to be added to the order
            const update = { count: productTarget[0].count - body.quantity };
            await productService.updateProductById(idTarget, update);

            if (productIndex > -1) {  //  Product is already in the order
                quantityUpdate[productIndex] += body.quantity;

                await Order.findByIdAndUpdate(orderId, { quantity: quantityUpdate })
            } else {  //  Product is not on the order yet
                const productUpdate = [...productIds, idTarget];
                quantityUpdate = [...productQuantity, body.quantity];
                
                await Order.findByIdAndUpdate(orderId, { productId: productUpdate, quantity: quantityUpdate });
            }

            return "Product was added to order";
        } else {
            return "There is not enough product in stock to add specified amount to order";
        }
    } catch (e) {
        throw e;
    }
}

exports.removeProductFromOrder = async (orderId, body) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return "Invalid id";
        }
        const order = await Order.findById(orderId);
        if (order === null) {
            return "Order not found";
        }
        if (!/^\d+$/.test(body.upc)) {
            return "Invalid upc code";
        }
        const productIds = order.productId;
        let quantityUpdate = order.quantity;
        
        const productTarget = await Product.find({ upc: body.upc }).lean();  //  Get information of product to be removed from order
        if (productTarget.length === 0) {
            return "Upc does not exist";
        }
        let idTarget = String(productTarget[0]._id);  //  Get id of product to be removed from order

        const productIndex = productIds.findIndex((product) => product === idTarget);  //  Find product to be removed in the order

        if (productIndex > -1) {  //  Product is in the order
            /*
              Determine if we are trying to remove more products than there is in the order
              and adjusting the value to be the number of products that is actually in the
              order and adding them back into stock
            */
            let update;
            if (body.quantity > quantityUpdate[productIndex]) {
                update = { count: productTarget[0].count + quantityUpdate[productIndex] };
            } else {
                update = { count: productTarget[0].count + body.quantity };
            }
            await productService.updateProductById(idTarget, update);

            //  Remove products from order
            quantityUpdate[productIndex] -= body.quantity;
            if (quantityUpdate[productIndex] < 1) {  //  Determine if the product is no longer in the order and remove product entirely from order
                let productUpdate = productIds;
                productUpdate.splice(productIndex, 1);
                quantityUpdate.splice(productIndex, 1);

                await Order.findByIdAndUpdate(orderId, { productId: productUpdate, quantity: quantityUpdate })
                return "Product removed to order";
            } else {  //  Remove the specified number of orders
                await Order.findByIdAndUpdate(orderId, { quantity: quantityUpdate })
                return "Specified amount has been removed from order";
            }
        } else {
            return "Product is not in this order";
        }
    } catch (e) {
        throw e;
    }
}

exports.getPrice = async (orderId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return "Invalid id";
        }
        const order = await Order.findById(orderId);
        if (order === null) {
            return "Order not found";
        }

        const productIds = order.productId;
        let subtotal = 0;
        for (let i = 0; i < productIds.length; i++) {
            let product = await Product.findById(productIds[i]);  //  Find product information
            subtotal += product.price;  //  Add price of product to subtotal of products in order
        }

        //  Calculate tax and total cost
        const tax = subtotal * 0.13; 
        const total = subtotal + tax;
        const response = {
            subtotal: Math.round(subtotal * 100) / 100,
            tax: Math.round(tax * 100) / 100,
            total: Math.round(total * 100) / 100
        }

        return response;
    } catch (e) {
        throw e;
    }
}

exports.newOrder = async (body) => {
    try {
        if (body.productId.length !== body.quantity.length) {
            return "The number of products and number of quantities given do not match";
        }
        const newOrder = new Order({
            productId: body.productId,
            quantity: body.quantity,
            cashierId: body.cashierId
        })
        await newOrder.save();
        return newOrder;
    } catch (e) {
        throw e;
    }
}