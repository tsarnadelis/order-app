const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerName: String,
    products: [
        {
            productName: String,
            quantity: Number
        }
    ],
    notes: String,
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Order', OrderSchema);
