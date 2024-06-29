const { connectToDatabase, Order } = require('./mongoose');

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectToDatabase();

    const { httpMethod, path, body, queryStringParameters } = event;

    switch (httpMethod) {
        case 'GET':
            const orders = await Order.find();
            return {
                statusCode: 200,
                body: JSON.stringify(orders)
            };

        case 'POST':
            const newOrderData = JSON.parse(body);
            const newOrder = new Order(newOrderData);
            await newOrder.save();
            return {
                statusCode: 201,
                body: JSON.stringify(newOrder)
            };

        case 'DELETE':
            const idToDelete = queryStringParameters.id;
            await Order.findByIdAndDelete(idToDelete);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Order deleted' })
            };

        case 'PATCH':
            const idToUpdate = queryStringParameters.id;
            const orderToUpdate = await Order.findById(idToUpdate);
            orderToUpdate.completed = !orderToUpdate.completed;
            await orderToUpdate.save();
            return {
                statusCode: 200,
                body: JSON.stringify(orderToUpdate)
            };

        default:
            return {
                statusCode: 405,
                body: JSON.stringify({ message: 'Method Not Allowed' })
            };
    }
};
