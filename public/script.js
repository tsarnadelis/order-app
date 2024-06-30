const apiUrl = '/.netlify/functions/orders';

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

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    });

    loadOrders();
});

async function loadOrders() {
    const response = await fetch(apiUrl);
    const orders = await response.json();

    const ordersDiv = document.getElementById('orders');
    ordersDiv.innerHTML = '';

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-container';
        orderDiv.style.backgroundColor = order.completed ? '#9eedaa' : 'lightyellow';
        orderDiv.innerHTML = `
            <div class="order-info">
                <p>Πελάτης:<strong> ${order.customerName}</strong></p>
                <p>Προιόν:<strong> ${order.products.map(p => `${p.productName}</strong> Ποσότητα: <strong>${p.quantity}`).join('</p><p>Προιόν: ')}</strong></p>
                <p>Σημειώσεις: <strong>${order.notes}</strong></p>
                <p>Κατάσταση: <strong>${order.completed ? 'Ολοκληρωμένη' : 'Εκκρεμής'}</strong></p>
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
    const confirmed = confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε την παραγγελία; Αυτή η ενέργεια είναι ΜΟΝΙΜΗ ΔΙΑΓΡΑΦΗ!");
    if (confirmed) {
        await fetch(`${apiUrl}?id=${id}`, { method: 'DELETE' });
        loadOrders();
    };
}

async function completeOrder(id) {
    await fetch(`${apiUrl}?id=${id}`, { method: 'PATCH' });
    loadOrders();
}

async function uncompleteOrder(id) {
    const confirmed = confirm("Είστε σίγουροι ότι θέλετε να δηλώσετε την παραγγελία ως ΕΚΚΡΕΜΗ;");
    if (confirmed) {
        await fetch(`${apiUrl}?id=${id}`, { method: 'PATCH' });
        loadOrders();
    }
}

loadOrders();
