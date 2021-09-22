const ObjectId = require('mongoose').Types.ObjectId;

exports.document = [
    {
        _id: ObjectId('614b48d878d8bc6351db1b51'),
        productId: ["614b48e078d8bc6351db1b55", "614b48e078d8bc6351db1b56"],
        quantity: [5, 3],
        cashierId: "TestCashier1"
    },
    {
        _id: ObjectId('614b48d878d8bc6351db1b52'),
        productId: ["614b48e078d8bc6351db1b57", "614b48e078d8bc6351db1b58"],
        quantity: [2, 1],
        cashierId: "TestCashier2"
    }
]