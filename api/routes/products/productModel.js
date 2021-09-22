const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    id: String,
    upc: Number,
    name: String,
    count: Number,
    type: String,
    price: Number
})

module.exports = mongoose.model('Product', productSchema);