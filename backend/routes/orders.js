const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Get all orders
router.get('/', async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

// Add a new order
router.post('/', async (req, res) => {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json(newOrder);
});

// Delete an order
router.delete('/:id', async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
});

// Mark an order as completed
router.patch('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id);
    order.completed = !order.completed;
    await order.save();
    res.json(order);
});

module.exports = router;
