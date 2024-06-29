const mongoose = require('mongoose');

const connectToDatabase = () => {
    return mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://thanasistsarnadelis:5422f8c30db0@cluster0.wbbqya3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
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
