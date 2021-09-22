const ObjectId = require('mongoose').Types.ObjectId;

exports.documents = [
    {
        _id: ObjectId('614b48e078d8bc6351db1b55'),
        upc: 456,
        name: "Banana",
        count: 50,
        type: "Fruit",
        price: 0.99
    },
    {
        _id: ObjectId('614b48e078d8bc6351db1b56'),
        upc: 4567,
        name: "Apple",
        count: 10,
        type: "Fruit",
        price: 1.99
    },
    {
        _id: ObjectId('614b48e078d8bc6351db1b57'),
        upc: 45678,
        name: "Celery",
        count: 5,
        type: "Vegetable",
        price: 2.99
    },
    {
        _id: ObjectId('614b48e078d8bc6351db1b58'),
        upc: 456789,
        name: "Lettuce",
        count: 8,
        type: "Vegetable",
        price: 3.99
    }
]

