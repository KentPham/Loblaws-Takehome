const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    productId: [],
    quantity: [],
    cashierId: String
})

module.exports = mongoose.model('Order', orderSchema);