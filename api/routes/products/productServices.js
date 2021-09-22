const mongoose = require('mongoose');
const Product = require('./productModel');

exports.listProducts = async () => {
    try {
        const products = await Product.find({});
        return products;
    } catch (e) {
        throw e;
    }
}

exports.getProductById = async (productId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return "Invalid id";
        }
        const product = await Product.findById(productId);
        if (product === null) {
            return "Product not found";
        }
        return product;
    } catch (e) {
        throw e;
    }
}

exports.deleteProductById = async (productId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return "Invalid Id";
        }
        const response = await Product.findByIdAndRemove(productId);
        if (response === null) {
            return "Product not found";
        } else {
            return "Product Deleted";
        }
    } catch (e) {
        throw e;
    }
}

exports.updateProductById = async (productId, update) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return "Invalid Id";
        }
        const params = Object.keys(update);
        const allowedFields = ["upc", "name", "count", "type", "price"];
        const isValidUpdate = params.every((param) => allowedFields.includes(param));

        if (isValidUpdate) {
            const response = await Product.findByIdAndUpdate(productId, update);
            if (response === null) {
                return "Product not found";
            } else {
                return "Product Updated";
            }
        } else {
            return "Invalid Update";
        }
    } catch (e) {
        throw e;
    }
}

exports.getProductByUpc = async (upc) => {
    try {
        if (!/^\d+$/.test(upc)) {
            return "Invalid upc code";
        }
        const product = await Product.find({ upc: upc });
        if (product.length === 0) {
            return "Product not found";
        } else {
            return product[0];
        }
    } catch (e) {
        throw e;
    }
}

exports.deleteProductByUpc = async (upc) => {
    try {
        if (!/^\d+$/.test(upc)) {
            return "Invalid upc code";
        }
        const response = await Product.findOneAndDelete({ upc: upc });
        if (response === null) {
            return "Product not found";
        } else {
            return "Product Deleted";
        }
    } catch (e) {
        throw e;
    }
}

exports.updateProductByUpc = async (upc, update) => {
    try {
        const params = Object.keys(update);
        const allowedFields = ["upc", "name", "count", "type", "price"];
        const isValidUpdate = params.every((param) => allowedFields.includes(param));

        if (!/^\d+$/.test(upc)) {
            return "Invalid upc code";
        }
        if (isValidUpdate) {
            const response = await Product.findOneAndUpdate({ upc: upc }, update);
            if (response === null) {
                return "Product not found";
            } else {
                return "Product Updated";
            }
        } else {
            return "Invalid Update";
        }
    } catch (e) {
        throw e;
    }
}