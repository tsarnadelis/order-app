const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

let isConnected;

const connectToDatabase = () => {
    if (isConnected) {
        return Promise.resolve();
    }
    return mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(db => {
        isConnected = db.connections[0].readyState;
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
