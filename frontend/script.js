document.getElementById('add-product').addEventListener('click', () => {
    const productDiv = document.createElement('div');
    productDiv.innerHTML = `
        <div class="product">
            <div class="product-tab">
                <h3>Προιόν</h3>
                <input type="text" placeholder="Προιόν">
            </div>
            <div class="product-tab">
                <h3>Ποσότητα</h3>
                <input type="number" placeholder="Ποσότητα">
            </div>
        </div>
        <button id="remove-product" onclick="removeProduct(this)">Αφαίρεσε προιόν</button>
    `;
    document.getElementById('products').appendChild(productDiv);
});


function removeProduct(button) {
    const productDiv = button.parentNode;
    productDiv.remove();
}

document.getElementById('submit-order').addEventListener('click', async () => {
    const customerName = document.getElementById('customerName').value;
    const products = Array.from(document.querySelectorAll('#products .product')).map(productDiv => {
        const productName = productDiv.querySelector('input[type="text"]').value;
        const quantity = productDiv.querySelector('input[type="number"]').value;
        return {
            productName,
            quantity
        };
    });
    const notes = document.getElementById('notes').value;

    const order = { customerName, products, notes };

    await fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    });

    loadOrders();
});

async function loadOrders() {
    const response = await fetch('http://localhost:5000/orders');
    const orders = await response.json();

    const ordersDiv = document.getElementById('orders');
    ordersDiv.innerHTML = '';

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-container';
        orderDiv.style.backgroundColor = order.completed ? '#9eedaa' : 'lightyellow';
        orderDiv.innerHTML = `
            <div class="order-info">
                <p><strong>Πελάτης:</strong> ${order.customerName}</p>
                <p><strong>Προιόν:</strong> ${order.products.map(p => `${p.productName} (${p.quantity})`).join(', ')}</p>
                <p><strong>Σημειώσεις:</strong> ${order.notes}</p>
                <p><strong>Κατάσταση:</strong> ${order.completed ? 'Ολοκληρωμένη' : 'Εκκρεμής'}</p>
            </div>
            <div class="order-actions">
                <button class="delete-order" onclick="deleteOrder('${order._id}')">Διαγραφή</button>
                <button class="complete-order" onclick="completeOrder('${order._id}')" ${order.completed ? 'disabled' : ''}>Ολοκλήρωση</button>
                <button class="uncomplete-order" onclick="uncompleteOrder('${order._id}')"  ${!order.completed ? 'disabled' : ''}>Αναίρεση</button>
            </div>
            `;
        ordersDiv.appendChild(orderDiv);
    });
}

async function deleteOrder(id) {
    const confirmed = confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε την παραγγελία; αυτή η είναι ΜΟΝΙΜΗ ΔΙΑΓΡΑΦΗ!");
    if (confirmed) {
        await fetch(`http://localhost:5000/orders/${id}`, { method: 'DELETE' });
        loadOrders();
    }
}

async function completeOrder(id) {
    await fetch(`http://localhost:5000/orders/${id}`, { method: 'PATCH' });
    loadOrders();
}

async function uncompleteOrder(id) {
    const confirmed = confirm("Είστε σίγουροι ότι θέλετε να δηλώσετε την παραγγελία ως ΕΚΚΡΕΜΗ;");
    if (confirmed) {
        await fetch(`http://localhost:5000/orders/${id}`, { method: 'PATCH' });
        loadOrders();
    }
}

loadOrders();
