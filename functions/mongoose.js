const mongoose = require('mongoose');

// Suppress deprecation warning
mongoose.set('strictQuery', true);

const connectToDatabase = () => {
    return mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

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

const Order = mongoose.model('Order', OrderSchema);

module.exports = { connectToDatabase, Order };
